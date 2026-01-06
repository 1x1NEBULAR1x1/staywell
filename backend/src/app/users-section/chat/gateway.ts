import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatWebsocketService } from './services/chat-websocket.service';
import { User, Role, UserWithoutPassword } from '@shared/src';
import { WebsocketAuthService } from 'src/lib/websocket/service';
import {
  SendMessageDto,
  EditMessageDto,
  DeleteMessageDto,
  GetHistoryDto,
  GetChatsDto,
  JoinChatDto,
} from './dto';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() readonly server!: Server;

  constructor(
    private readonly chatWebsocketService: ChatWebsocketService,
    private readonly authService: WebsocketAuthService,
  ) {}

  afterInit() {
    // Set server in service after WebSocket initialization
    this.chatWebsocketService.setServer(this.server);

    // Apply authentication middleware to this namespace
    this.server.use((socket: Socket, next: (err?: Error) => void) => {
      void (async () => {
        try {
          const token = this.authService.extractTokenFromHandshake(
            socket.handshake,
          );

          if (!token) {
            return next(new Error('Authentication error'));
          }

          const user = await this.authService.validateToken(token);

          if (!user) {
            return next(new Error('Authentication error'));
          }

          (socket.data as { user: UserWithoutPassword }).user = user;
          next();
        } catch {
          next(new Error('Authentication error'));
        }
      })();
    });
  }

  async handleConnection(client: Socket) {
    try {
      const user = (client.data as { user: UserWithoutPassword }).user;
      if (!user) {
        client.disconnect();
        return;
      }

      // Add user to connected users
      await this.chatWebsocketService.addConnectedUser(user.id, client.id);

      // Join admin room if user is admin
      if (user.role === Role.ADMIN) {
        await client.join('admins');
        // Notify all users that support is now online
        const lastSeen = new Date();
        this.chatWebsocketService
          .getNotificationService()
          .notifySupportOnlineStatus(lastSeen);
      } else {
        // For regular users, send current support status
        const adminSockets = await this.server.in('admins').fetchSockets();
        const isSupportOnline = adminSockets.length > 0;
        const lastSeen = isSupportOnline ? new Date() : null; // If no admins online, we'll need to get last seen from somewhere
        client.emit('user_online_status', {
          user_id: 'support',
          last_seen: lastSeen,
        });
      }

      // Send confirmation of connection
      client.emit('connected', { user_id: user.id });
    } catch (error: unknown) {
      console.error(
        'Chat gateway connection error:',
        error instanceof Error ? error.message : String(error),
      );
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      const user = (client.data as { user: UserWithoutPassword }).user;
      if (user) {
        const wasAdmin = user.role === Role.ADMIN;
        await this.chatWebsocketService.removeConnectedUser(user.id, client.id);

        // If admin disconnected, check if any admins are still online
        if (wasAdmin) {
          // Check if there are any other admins online
          const adminSockets = await this.server.in('admins').fetchSockets();
          const isAnyAdminOnline = adminSockets.length > 0;

          if (!isAnyAdminOnline) {
            // No admins online - notify users that support is offline
            const lastSeen = await this.chatWebsocketService.getLastSeen(
              user.id,
            );
            this.chatWebsocketService
              .getNotificationService()
              .notifySupportOnlineStatus(lastSeen);
          } else {
            // Other admins are still online - support is still online
            this.chatWebsocketService
              .getNotificationService()
              .notifySupportOnlineStatus(new Date());
          }
        }
      }
    } catch (error: unknown) {
      console.error(
        'Chat gateway disconnect error:',
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  @SubscribeMessage('join_chat')
  async handleJoinChat(
    @MessageBody() data: JoinChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = (client.data as { user: UserWithoutPassword }).user;
    if (!user) return;

    try {
      await this.chatWebsocketService.joinChat(user, data.chat_partner_id);

      // Update last seen time when joining chat
      await this.chatWebsocketService.updateLastSeen(user.id);

      // Join room for specific chat
      let roomName: string;
      if (data.chat_partner_id === 'support') {
        // Users joining support
        roomName = `chat_${[user.id, 'support'].sort().join('_')}`;
      } else {
        // Admins joining user chat or direct chats
        if (user.role === Role.ADMIN) {
          // For admin-user chats, use the standardized support room format
          roomName = `chat_${[data.chat_partner_id, 'support'].sort().join('_')}`;
        } else {
          roomName = `chat_${[user.id, data.chat_partner_id].sort().join('_')}`;
        }
      }
      await client.join(roomName);

      client.emit('chat_joined', { chat_partner_id: data.chat_partner_id });
    } catch (error: unknown) {
      client.emit('error', {
        message: error instanceof Error ? error.message : 'Failed to join chat',
      });
    }
  }

  @SubscribeMessage('leave_chat')
  async handleLeaveChat(
    @MessageBody() data: { chat_partner_id: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = (client.data as { user: UserWithoutPassword }).user;
    if (!user) return;

    // Leave room for specific chat
    let roomName: string;
    if (data.chat_partner_id === 'support') {
      roomName = `chat_${[user.id, 'support'].sort().join('_')}`;
    } else {
      if (user.role === Role.ADMIN) {
        roomName = `chat_${[data.chat_partner_id, 'support'].sort().join('_')}`;
      } else {
        roomName = `chat_${[user.id, data.chat_partner_id].sort().join('_')}`;
      }
    }
    await client.leave(roomName);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = (client.data as { user: UserWithoutPassword }).user;
    if (!user) return;

    try {
      const message = await this.chatWebsocketService.sendMessage(user, data);
      client.emit('message_sent', { message });
    } catch (error: unknown) {
      client.emit('error', {
        message:
          error instanceof Error ? error.message : 'Failed to send message',
      });
    }
  }

  @SubscribeMessage('edit_message')
  async handleEditMessage(
    @MessageBody() data: EditMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = (client.data as { user: UserWithoutPassword }).user;
    if (!user) return;

    try {
      const message = await this.chatWebsocketService.editMessage(user, data);
      client.emit('message_edited', { message });
    } catch (error: unknown) {
      client.emit('error', {
        message:
          error instanceof Error ? error.message : 'Failed to edit message',
      });
    }
  }

  @SubscribeMessage('delete_message')
  async handleDeleteMessage(
    @MessageBody() data: DeleteMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = (client.data as { user: UserWithoutPassword }).user;
    if (!user) return;

    try {
      await this.chatWebsocketService.deleteMessage(user, data);
      client.emit('message_deleted', { message_id: data.message_id });
    } catch (error: unknown) {
      client.emit('error', {
        message:
          error instanceof Error ? error.message : 'Failed to delete message',
      });
    }
  }

  @SubscribeMessage('get_history')
  async handleGetHistory(
    @MessageBody() data: GetHistoryDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = (client.data as { user: UserWithoutPassword }).user;
    if (!user) return;

    try {
      const history = await this.chatWebsocketService.getMessageHistory(
        user,
        data,
      );
      client.emit('history_loaded', {
        ...history,
        chat_partner_id: data.chat_partner_id,
      });
    } catch (error: unknown) {
      client.emit('error', {
        message:
          error instanceof Error ? error.message : 'Failed to load history',
      });
    }
  }

  @SubscribeMessage('get_chats')
  async handleGetChats(
    @MessageBody() data: GetChatsDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = (client.data as { user: UserWithoutPassword }).user;
    if (!user) return;

    try {
      const chats = await this.chatWebsocketService.getChats(user, data);
      client.emit('chats_loaded', chats);
    } catch (error: unknown) {
      client.emit('error', {
        message:
          error instanceof Error ? error.message : 'Failed to load chats',
      });
    }
  }

  @SubscribeMessage('mark_messages_read')
  async handleMarkMessagesRead(
    @MessageBody() data: { chat_partner_id: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = (client.data as { user: UserWithoutPassword }).user as User;
    if (!user) return;

    try {
      await this.chatWebsocketService.markMessagesAsRead(
        user,
        data.chat_partner_id,
      );
    } catch (error: unknown) {
      client.emit('error', {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to mark messages as read',
      });
    }
  }

  @SubscribeMessage('typing_start')
  handleTypingStart(
    @MessageBody() data: { chat_partner_id: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = (client.data as { user: UserWithoutPassword }).user;
    if (!user) return;

    // Determine room name
    let roomName: string;
    if (data.chat_partner_id === 'support') {
      roomName = `chat_${[user.id, 'support'].sort().join('_')}`;
    } else {
      if (user.role === Role.ADMIN) {
        roomName = `chat_${[data.chat_partner_id, 'support'].sort().join('_')}`;
      } else {
        roomName = `chat_${[user.id, data.chat_partner_id].sort().join('_')}`;
      }
    }

    // If admin is typing to a user, send as support
    // If user is typing to support, send as user
    const sender_id =
      user.role === Role.ADMIN && data.chat_partner_id !== 'support'
        ? 'support'
        : user.id;

    client.to(roomName).emit('user_typing', {
      user_id: sender_id,
      chat_partner_id: data.chat_partner_id,
      is_typing: true,
    });
  }

  @SubscribeMessage('typing_stop')
  handleTypingStop(
    @MessageBody() data: { chat_partner_id: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = (client.data as { user: UserWithoutPassword }).user;
    if (!user) return;

    // Determine room name
    let roomName: string;
    if (data.chat_partner_id === 'support') {
      roomName = `chat_${[user.id, 'support'].sort().join('_')}`;
    } else {
      if (user.role === Role.ADMIN) {
        roomName = `chat_${[data.chat_partner_id, 'support'].sort().join('_')}`;
      } else {
        roomName = `chat_${[user.id, data.chat_partner_id].sort().join('_')}`;
      }
    }

    // If admin is typing to a user, send as support
    // If user is typing to support, send as user
    const sender_id =
      user.role === Role.ADMIN && data.chat_partner_id !== 'support'
        ? 'support'
        : user.id;

    client.to(roomName).emit('user_typing', {
      user_id: sender_id,
      chat_partner_id: data.chat_partner_id,
      is_typing: false,
    });
  }
}
