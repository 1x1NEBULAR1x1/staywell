import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { Message, Role, UserWithoutPassword } from '@shared/src';
import { GetHistoryDto, GetChatsDto } from '../dto';
import { SAFE_USER_SELECT } from '@shared/src';
import { ChatConnectionService } from './chat-connection.service';
import { Prisma } from '@shared/src/database';

// Special ID for support chat
const SUPPORT_ID = 'support';

export interface ChatWithLastMessage {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    image: string | null;
  };
  last_message: Message | null;
  unread_count: number;
  last_seen: Date | null;
}

@Injectable()
export class ChatHistoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly connectionService: ChatConnectionService,
  ) {}

  /**
   * Get message history
   */
  async getMessageHistory(user: UserWithoutPassword, data: GetHistoryDto) {
    let where: Prisma.MessageWhereInput;
    if (user.role === Role.USER) {
      // Users see their own messages with support
      if (data.chat_partner_id !== SUPPORT_ID) {
        throw new ForbiddenException('Users can only access support chat');
      }
      where = {
        OR: [
          { sender_id: user.id, receiver_id: SUPPORT_ID },
          { sender: { role: Role.ADMIN }, receiver_id: user.id },
        ],
        is_excluded: false,
      };
    } else if (user.role === Role.ADMIN) {
      // Admins see messages with specific user
      where = {
        OR: [
          { sender_id: user.id, receiver_id: data.chat_partner_id },
          { sender_id: data.chat_partner_id, receiver_id: user.id },
          // Also include support messages from this user
          { sender_id: data.chat_partner_id, receiver_id: SUPPORT_ID },
          {
            sender_id: user.id,
            receiver_id: SUPPORT_ID,
            sender: { role: Role.ADMIN },
          },
        ],
        is_excluded: false,
      };
    } else {
      throw new ForbiddenException(
        'Only users and admins can access chat history',
      );
    }

    const messages = await this.prisma.message.findMany({
      where,
      include: {
        sender: { select: SAFE_USER_SELECT },
        replaces: {
          include: {
            sender: { select: SAFE_USER_SELECT },
          },
        },
      },
      orderBy: { created: 'desc' },
      skip: data.skip,
      take: data.take,
    });

    const total = await this.prisma.message.count({ where });

    return {
      items: messages.reverse(), // Return in chronological order
      total,
      skip: data.skip,
      take: data.take,
    };
  }

  /**
   * Get chats list (for admins)
   */
  async getChats(
    user: UserWithoutPassword,
    data: GetChatsDto,
  ): Promise<{ items: ChatWithLastMessage[]; total: number }> {
    // Only admins can access chats list
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can access chats list');
    }

    // Get recent messages to find chat partners
    const recent_messages = await this.prisma.message.findMany({
      where: {
        is_excluded: false,
      },
      select: {
        sender_id: true,
        receiver_id: true,
        created: true,
      },
      orderBy: { created: 'desc' },
      take: 2000, // Get enough messages to find recent chat partners
    });

    // Extract unique user IDs who have chatted with admins/support
    const user_ids_map = new Set<string>();
    for (const msg of recent_messages) {
      // Check if this message involves an admin or support
      const is_with_admin =
        msg.sender_id === user.id || msg.receiver_id === user.id;
      const is_with_support =
        msg.sender_id === SUPPORT_ID || msg.receiver_id === SUPPORT_ID;

      if (is_with_admin || is_with_support) {
        // Add the user ID (not admin/support)
        if (msg.sender_id !== SUPPORT_ID && msg.sender_id !== user.id) {
          user_ids_map.add(msg.sender_id);
        }
        if (msg.receiver_id !== SUPPORT_ID && msg.receiver_id !== user.id) {
          user_ids_map.add(msg.receiver_id);
        }
      }
    }

    const user_ids_array = Array.from(user_ids_map);

    // Get user details
    const chat_users = await this.prisma.user.findMany({
      where: {
        id: { in: user_ids_array },
        is_active: true,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        image: true,
      },
    });

    // Create a map of user latest message dates from the recent messages we already have
    const user_latest_message_map = new Map<string, Date>();
    for (const msg of recent_messages) {
      const user_id =
        msg.sender_id !== SUPPORT_ID && msg.sender_id !== user.id
          ? msg.sender_id
          : msg.receiver_id !== SUPPORT_ID && msg.receiver_id !== user.id
            ? msg.receiver_id
            : null;

      if (user_id && user_ids_array.includes(user_id)) {
        if (
          !user_latest_message_map.has(user_id) ||
          user_latest_message_map.get(user_id)! < msg.created
        ) {
          user_latest_message_map.set(user_id, msg.created);
        }
      }
    }

    // Sort users by latest message date
    const sorted_users = chat_users
      .filter((u) => user_latest_message_map.has(u.id))
      .sort((a, b) => {
        const dateA = user_latest_message_map.get(a.id)!;
        const dateB = user_latest_message_map.get(b.id)!;
        return dateB.getTime() - dateA.getTime();
      });

    const total = sorted_users.length;

    if (total === 0) return { items: [], total };

    // Apply pagination to sorted users
    const paginated_users = sorted_users.slice(
      data.skip ?? 0,
      (data.skip ?? 0) + (data.take ?? 50),
    );

    // Get last messages and unread counts for each chat
    const chats_data = await Promise.all(
      paginated_users.map(async (user) => {
        // Get last message between user and admin/support
        const last_message = await this.prisma.message.findFirst({
          where: {
            OR: [
              {
                sender_id: user.id,
                receiver_id: { in: [SUPPORT_ID, user.id] },
              },
              {
                sender_id: { in: [SUPPORT_ID, user.id] },
                receiver_id: user.id,
              },
            ],
            is_excluded: false,
          },
          include: {
            sender: { select: SAFE_USER_SELECT },
            replaces: {
              include: {
                sender: { select: SAFE_USER_SELECT },
              },
            },
          },
          orderBy: { created: 'desc' },
        });

        // Count unread messages from user to admin/support
        const unread_count = await this.prisma.message.count({
          where: {
            sender_id: user.id,
            receiver_id: { in: [SUPPORT_ID, user.id] },
            is_read: false,
            is_excluded: false,
          },
        });

        // Get last seen time
        const last_seen = await this.connectionService.getLastSeen(user.id);

        return {
          user,
          last_message,
          unread_count,
          last_seen,
        };
      }),
    );

    return { items: chats_data, total };
  }
}
