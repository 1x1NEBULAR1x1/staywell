import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { Message, Role, SafeUser, UserWithoutPassword } from '@shared/src';
import { GetHistoryDto, GetChatsDto } from '../dto';
import { SAFE_USER_SELECT } from '@shared/src';
import { ChatConnectionService } from './chat-connection.service';

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
  ) { }

  /**
   * Get message history
   */
  async getMessageHistory(user: UserWithoutPassword, data: GetHistoryDto) {
    let whereCondition: any;
    if (user.role === Role.USER) {
      // Users see their own messages with support
      if (data.chat_partner_id !== SUPPORT_ID) {
        throw new ForbiddenException('Users can only access support chat');
      }
      whereCondition = {
        OR: [
          { sender_id: user.id, receiver_id: SUPPORT_ID },
          { sender: { role: Role.ADMIN }, receiver_id: user.id },
        ],
        is_excluded: false,
      };
    } else if (user.role === Role.ADMIN) {
      // Admins see messages with specific user
      whereCondition = {
        OR: [
          { sender_id: user.id, receiver_id: data.chat_partner_id },
          { sender_id: data.chat_partner_id, receiver_id: user.id },
          // Also include support messages from this user
          { sender_id: data.chat_partner_id, receiver_id: SUPPORT_ID },
          { sender_id: user.id, receiver_id: SUPPORT_ID, sender: { role: Role.ADMIN } },
        ],
        is_excluded: false,
      };
    } else {
      throw new ForbiddenException('Only users and admins can access chat history');
    }

    const messages = await this.prisma.message.findMany({
      where: whereCondition,
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

    const total = await this.prisma.message.count({
      where: whereCondition,
    });

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
  async getChats(user: UserWithoutPassword, data: GetChatsDto): Promise<{ items: ChatWithLastMessage[]; total: number }> {
    // Only admins can access chats list
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can access chats list');
    }

    // Get recent messages to find chat partners
    const recentMessages = await this.prisma.message.findMany({
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
    const userIdsSet = new Set<string>();
    for (const msg of recentMessages) {
      // Check if this message involves an admin or support
      const isWithAdmin = (msg.sender_id === user.id || msg.receiver_id === user.id);
      const isWithSupport = (msg.sender_id === SUPPORT_ID || msg.receiver_id === SUPPORT_ID);

      if (isWithAdmin || isWithSupport) {
        // Add the user ID (not admin/support)
        if (msg.sender_id !== SUPPORT_ID && msg.sender_id !== user.id) {
          userIdsSet.add(msg.sender_id);
        }
        if (msg.receiver_id !== SUPPORT_ID && msg.receiver_id !== user.id) {
          userIdsSet.add(msg.receiver_id);
        }
      }
    }

    const userIds = Array.from(userIdsSet);

    // Get user details
    const chatUsers = await this.prisma.user.findMany({
      where: {
        id: { in: userIds },
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
    const userLatestMessageMap = new Map<string, Date>();
    for (const msg of recentMessages) {
      const userId = msg.sender_id !== SUPPORT_ID && msg.sender_id !== user.id ? msg.sender_id :
        msg.receiver_id !== SUPPORT_ID && msg.receiver_id !== user.id ? msg.receiver_id : null;

      if (userId && userIds.includes(userId)) {
        if (!userLatestMessageMap.has(userId) || userLatestMessageMap.get(userId)! < msg.created) {
          userLatestMessageMap.set(userId, msg.created);
        }
      }
    }

    // Sort users by latest message date
    const sortedUsers = chatUsers
      .filter(u => userLatestMessageMap.has(u.id))
      .sort((a, b) => {
        const dateA = userLatestMessageMap.get(a.id)!;
        const dateB = userLatestMessageMap.get(b.id)!;
        return dateB.getTime() - dateA.getTime();
      });

    const total = sortedUsers.length;

    if (total === 0) {
      return { items: [], total };
    }

    // Apply pagination to sorted users
    const paginatedUsers = sortedUsers.slice(data.skip ?? 0, (data.skip ?? 0) + (data.take ?? 50));

    // Get last messages and unread counts for each chat
    const chatsData = await Promise.all(
      paginatedUsers.map(async (userData) => {
        // Get last message between user and admin/support
        const lastMessage = await this.prisma.message.findFirst({
          where: {
            OR: [
              { sender_id: userData.id, receiver_id: { in: [SUPPORT_ID, user.id] } },
              { sender_id: { in: [SUPPORT_ID, user.id] }, receiver_id: userData.id },
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
        const unreadCount = await this.prisma.message.count({
          where: {
            sender_id: userData.id,
            receiver_id: { in: [SUPPORT_ID, user.id] },
            is_read: false,
            is_excluded: false,
          },
        });

        // Get last seen time
        const last_seen = await this.connectionService.getLastSeen(userData.id);

        return {
          user: userData,
          last_message: lastMessage,
          unread_count: unreadCount,
          last_seen,
        };
      })
    );

    return { items: chatsData, total };
  }
}
