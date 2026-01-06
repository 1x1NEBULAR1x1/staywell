import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { Message, Role } from '@shared/src/database';
import { PrismaService } from 'src/lib/prisma';

@Injectable()
export class ChatNotificationService {
  private server!: Server;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Set WebSocket server (called by gateway after initialization)
   */
  setServer(server: Server): void {
    this.server = server;
  }

  /**
   * Notify about new message
   */
  async notifyNewMessage(message: Message): Promise<void> {
    if (!this.server) {
      return console.warn('WebSocket server not initialized yet');
    }

    const room_name = await this.getChatRoomName(
      message.sender_id,
      message.receiver_id,
    );

    // Send to all clients in the chat room
    this.server.to(room_name).emit('new_message', { message });

    // Notify all admins that chats list might need to be updated
    // This is needed because new message can change the order or unread count in chat list
    this.server.to('admins').emit('chats_updated');
  }

  /**
   * Notify about message edit
   */
  async notifyMessageEdited(message: Message): Promise<void> {
    if (!this.server) return;

    const room_name = await this.getChatRoomName(
      message.sender_id,
      message.receiver_id,
    );
    this.server.to(room_name).emit('message_edited', { message });
  }

  /**
   * Notify about message deletion
   */
  async notifyMessageDeleted(message: Message): Promise<void> {
    if (!this.server) return;

    const room_name = await this.getChatRoomName(
      message.sender_id,
      message.receiver_id,
    );
    this.server
      .to(room_name)
      .emit('message_deleted', { message_id: message.id });
  }

  /**
   * Notify about messages read
   */
  async notifyMessagesRead(
    reader_id: string,
    chat_partner_id: string,
  ): Promise<void> {
    if (!this.server) return;

    const room_name = await this.getChatRoomName(reader_id, chat_partner_id);
    this.server.to(room_name).emit('messages_read', {
      reader_id,
      chat_partner_id,
    });
  }

  /**
   * Notify about user online status change
   */
  notifyUserOnlineStatus(user_id: string, last_seen: Date | null): void {
    if (!this.server) return;

    // Notify all connected admins about user status
    this.server.to('admins').emit('user_online_status', {
      user_id,
      last_seen,
    });
  }

  /**
   * Notify about support (admin) online status change
   */
  notifySupportOnlineStatus(last_seen: Date | null): void {
    if (!this.server) return;

    // Notify all users about support status
    this.server.emit('user_online_status', {
      user_id: 'support',
      last_seen,
    });
  }

  /**
   * Check if message is related to support
   */
  private isSupportMessage(message: Message): boolean {
    return message.receiver_id === 'support' || message.sender_id === 'support';
  }

  /**
   * Get support room name (standardized for user-support chats)
   */
  private getSupportRoomName(senderId: string, receiverId: string): string {
    // For support messages, always use the user ID + support
    const userId =
      receiverId === 'support'
        ? senderId
        : senderId === 'support'
          ? receiverId
          : senderId;
    return `chat_${[userId, 'support'].sort().join('_')}`;
  }

  /**
   * Get chat room name
   */
  private async getChatRoomName(user1: string, user2: string): Promise<string> {
    // For support-related messages, use standardized room name
    if (user1 === 'support' || user2 === 'support') {
      const userId = user1 === 'support' ? user2 : user1;
      return `chat_${[userId, 'support'].sort().join('_')}`;
    }

    // Check if this is admin-user communication (should use support room)
    try {
      const [user1Data, user2Data] = await Promise.all([
        user1 !== 'support'
          ? this.prisma.user.findUnique({
              where: { id: user1 },
              select: { role: true },
            })
          : null,
        user2 !== 'support'
          ? this.prisma.user.findUnique({
              where: { id: user2 },
              select: { role: true },
            })
          : null,
      ]);

      // If one is admin and one is user, use support room format
      if (
        (user1Data?.role === Role.ADMIN && user2Data?.role === Role.USER) ||
        (user1Data?.role === Role.USER && user2Data?.role === Role.ADMIN)
      ) {
        const userId = user1Data?.role === Role.USER ? user1 : user2;
        return `chat_${[userId, 'support'].sort().join('_')}`;
      }
    } catch (error) {
      console.error('Error checking user roles for room name:', error);
    }

    // For direct admin-user messages or other cases
    return `chat_${[user1, user2].sort().join('_')}`;
  }
}
