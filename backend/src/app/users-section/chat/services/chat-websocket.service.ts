import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { Message } from '@shared/src/database';
import { UserWithoutPassword } from '@shared/src';
import { SendMessageDto, EditMessageDto, DeleteMessageDto, GetHistoryDto, GetChatsDto } from '../dto';
import { ChatConnectionService } from './chat-connection.service';
import { ChatMessagingService } from './chat-messaging.service';
import { ChatNotificationService } from './chat-notification.service';
import { ChatRoomService } from './chat-room.service';
import { ChatHistoryService, ChatWithLastMessage } from './chat-history.service';

@Injectable()
export class ChatWebsocketService {
  constructor(
    private readonly connectionService: ChatConnectionService,
    private readonly messagingService: ChatMessagingService,
    private readonly notificationService: ChatNotificationService,
    private readonly roomService: ChatRoomService,
    private readonly historyService: ChatHistoryService,
  ) { }

  /**
   * Set WebSocket server (called by gateway after initialization)
   */
  setServer(server: Server): void {
    this.notificationService.setServer(server);
  }

  /**
   * Add connected user to chat
   */
  async addConnectedUser(user_id: string, socket_id: string): Promise<void> {
    await this.connectionService.addConnectedUser(user_id, socket_id);
    // Notify all admins about user online status change
    await this.notificationService.notifyUserOnlineStatus(user_id, true);
  }

  /**
   * Remove connected user
   */
  async removeConnectedUser(user_id: string, socket_id: string): Promise<void> {
    await this.connectionService.removeConnectedUser(user_id, socket_id);

    // Check if user still has other connections
    const remainingSockets = await this.connectionService.getConnectedUserSockets(user_id);
    if (remainingSockets.length === 0) {
      // User is now offline
      await this.notificationService.notifyUserOnlineStatus(user_id, false);
    }
  }

  /**
   * Get all sockets of connected user
   */
  async getConnectedUserSockets(user_id: string): Promise<string[]> {
    return await this.connectionService.getConnectedUserSockets(user_id);
  }

  /**
   * Check online status of user
   */
  async isUserOnline(user_id: string): Promise<boolean> {
    return await this.connectionService.isUserOnline(user_id);
  }

  /**
   * Get list of all online users
   */
  async getOnlineUsers(): Promise<string[]> {
    return await this.connectionService.getOnlineUsers();
  }

  /**
   * Send message
   */
  async sendMessage(user: UserWithoutPassword, data: SendMessageDto): Promise<Message> {
    return await this.messagingService.sendMessage(user, data);
  }

  /**
   * Edit message
   */
  async editMessage(user: UserWithoutPassword, data: EditMessageDto): Promise<Message> {
    return await this.messagingService.editMessage(user, data);
  }

  /**
   * Delete message (soft delete)
   */
  async deleteMessage(user: UserWithoutPassword, data: DeleteMessageDto): Promise<void> {
    await this.messagingService.deleteMessage(user, data);
  }

  /**
   * Get message history
   */
  async getMessageHistory(user: UserWithoutPassword, data: GetHistoryDto) {
    return await this.historyService.getMessageHistory(user, data);
  }

  /**
   * Get chats list (for admins)
   */
  async getChats(user: UserWithoutPassword, data: GetChatsDto): Promise<{ items: ChatWithLastMessage[]; total: number }> {
    return await this.historyService.getChats(user, data);
  }

  /**
   * Mark messages as read
   */
  async markMessagesAsRead(user: UserWithoutPassword, chat_partner_id: string): Promise<void> {
    await this.messagingService.markMessagesAsRead(user, chat_partner_id);
  }

  /**
   * Join user to chat room
   */
  async joinChat(user: UserWithoutPassword, chat_partner_id: string): Promise<void> {
    await this.roomService.joinChat(user, chat_partner_id);
  }
}
