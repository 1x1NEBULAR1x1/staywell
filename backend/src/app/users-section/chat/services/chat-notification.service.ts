import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { Message } from '@shared/src/database';

@Injectable()
export class ChatNotificationService {
  private server!: Server;

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
      console.warn('WebSocket server not initialized yet');
      return;
    }

    const room_name = this.getChatRoomName(message.sender_id, message.receiver_id);
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

    const room_name = this.getChatRoomName(message.sender_id, message.receiver_id);
    this.server.to(room_name).emit('message_edited', { message });
  }

  /**
   * Notify about message deletion
   */
  async notifyMessageDeleted(message: Message): Promise<void> {
    if (!this.server) return;

    const room_name = this.getChatRoomName(message.sender_id, message.receiver_id);
    this.server.to(room_name).emit('message_deleted', { message_id: message.id });
  }

  /**
   * Notify about messages read
   */
  async notifyMessagesRead(reader_id: string, chat_partner_id: string): Promise<void> {
    if (!this.server) return;

    const room_name = this.getChatRoomName(reader_id, chat_partner_id);
    this.server.to(room_name).emit('messages_read', {
      reader_id,
      chat_partner_id,
    });
  }

  /**
   * Notify about user online status change
   */
  async notifyUserOnlineStatus(user_id: string, is_online: boolean): Promise<void> {
    if (!this.server) return;

    // Notify all connected admins
    this.server.to('admins').emit('user_online_status', {
      user_id,
      is_online,
    });
  }

  /**
   * Get chat room name
   */
  private getChatRoomName(user1: string, user2: string): string {
    return `chat_${[user1, user2].sort().join('_')}`;
  }
}
