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
  JoinChatDto
} from './dto';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() readonly server!: Server;

  constructor(
    private readonly chatWebsocketService: ChatWebsocketService,
    private readonly authService: WebsocketAuthService,
  ) { }

  afterInit() {
    // Set server in service after WebSocket initialization
    this.chatWebsocketService.setServer(this.server);

    // Apply authentication middleware to this namespace
    this.server.use(async (socket, next) => {
      try {
        const token = this.authService.extractTokenFromHandshake(socket.handshake);

        if (!token) {
          return next(new Error('Authentication error'));
        }

        const user = await this.authService.validateToken(token);

        if (!user) {
          return next(new Error('Authentication error'));
        }

        socket.data.user = user;
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
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
        await this.chatWebsocketService.removeConnectedUser(user.id, client.id);
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

      // Join room for specific chat
      const roomName = `chat_${[user.id, data.chat_partner_id].sort().join('_')}`;
      await client.join(roomName);

      client.emit('chat_joined', { chat_partner_id: data.chat_partner_id });
    } catch (error: any) {
      client.emit('error', { message: error.message || 'Failed to join chat' });
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
    const roomName = `chat_${[user.id, data.chat_partner_id].sort().join('_')}`;
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
    } catch (error: any) {
      client.emit('error', { message: error.message || 'Failed to send message' });
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
    } catch (error: any) {
      client.emit('error', { message: error.message || 'Failed to edit message' });
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
    } catch (error: any) {
      client.emit('error', { message: error.message || 'Failed to delete message' });
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
      const history = await this.chatWebsocketService.getMessageHistory(user, data);
      client.emit('history_loaded', { ...history, chat_partner_id: data.chat_partner_id });
    } catch (error: any) {
      client.emit('error', { message: error.message || 'Failed to load history' });
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
    } catch (error: any) {
      client.emit('error', { message: error.message || 'Failed to load chats' });
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
      await this.chatWebsocketService.markMessagesAsRead(user, data.chat_partner_id);
    } catch (error: any) {
      client.emit('error', { message: error.message || 'Failed to mark messages as read' });
    }
  }

  @SubscribeMessage('typing_start')
  handleTypingStart(
    @MessageBody() data: { chat_partner_id: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = (client.data as { user: UserWithoutPassword }).user;
    if (!user) return;

    // Send event to chat partner
    const roomName = `chat_${[user.id, data.chat_partner_id].sort().join('_')}`;
    client.to(roomName).emit('user_typing', {
      user_id: user.id,
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

    // Send event to chat partner
    const roomName = `chat_${[user.id, data.chat_partner_id].sort().join('_')}`;
    client.to(roomName).emit('user_typing', {
      user_id: user.id,
      chat_partner_id: data.chat_partner_id,
      is_typing: false,
    });
  }
}
