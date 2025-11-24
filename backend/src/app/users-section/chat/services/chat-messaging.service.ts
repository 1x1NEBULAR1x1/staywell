import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { Message, Role, UserWithoutPassword } from '@shared/src';
import { SendMessageDto, EditMessageDto, DeleteMessageDto } from '../dto';
import { SAFE_USER_SELECT } from '@shared/src';
import { ChatNotificationService } from './chat-notification.service';

// Special ID for support chat
const SUPPORT_ID = 'support';

@Injectable()
export class ChatMessagingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: ChatNotificationService,
  ) {}

  /**
   * Send message
   */
  async sendMessage(
    user: UserWithoutPassword,
    data: SendMessageDto,
  ): Promise<Message> {
    let receiver_id: string;

    if (user.role === Role.USER) {
      // Users send to support (will be handled by any admin)
      if (data.receiver_id !== SUPPORT_ID) {
        throw new ForbiddenException('Users can only send messages to support');
      }
      receiver_id = SUPPORT_ID;
    } else if (user.role === Role.ADMIN) {
      // Admins can send to specific users
      if (data.receiver_id === SUPPORT_ID) {
        throw new ForbiddenException(
          'Admins cannot send messages to support directly',
        );
      }

      // Validate that the receiver exists and is a user
      const receiver = await this.prisma.user.findUnique({
        where: { id: data.receiver_id },
      });
      if (!receiver) throw new NotFoundException('User not found');

      receiver_id = data.receiver_id;
    } else {
      throw new ForbiddenException('Only users and admins can send messages');
    }

    const message = await this.prisma.message.create({
      data: {
        sender_id: user.id,
        receiver_id: receiver_id,
        message: data.message,
        booking_id: data.booking_id,
      },
      include: {
        sender: { select: SAFE_USER_SELECT },
      },
    });

    // Send notification through WebSocket
    await this.notificationService.notifyNewMessage(message);

    return message;
  }

  /**
   * Edit message
   */
  async editMessage(
    user: UserWithoutPassword,
    data: EditMessageDto,
  ): Promise<Message> {
    const existingMessage = await this.prisma.message.findUnique({
      where: { id: data.message_id },
      include: {
        sender: { select: SAFE_USER_SELECT },
      },
    });

    if (!existingMessage) {
      throw new NotFoundException('Message not found');
    }

    // Only sender can edit their own messages
    if (existingMessage.sender_id !== user.id) {
      throw new ForbiddenException('You can only edit your own messages');
    }

    // Cannot edit deleted messages
    if (existingMessage.is_excluded) {
      throw new BadRequestException('Cannot edit deleted message');
    }

    // Create new message with edited content
    const editedMessage = await this.prisma.message.create({
      data: {
        sender_id: user.id,
        receiver_id: existingMessage.receiver_id,
        message: data.message,
        booking_id: existingMessage.booking_id,
        replace_to: existingMessage.id,
      },
      include: {
        sender: { select: SAFE_USER_SELECT },
      },
    });

    // Update original message edited timestamp
    await this.prisma.message.update({
      where: { id: existingMessage.id },
      data: { edited: new Date() },
    });

    // Notify about edited message
    await this.notificationService.notifyMessageEdited(editedMessage);

    return editedMessage;
  }

  /**
   * Delete message (soft delete)
   */
  async deleteMessage(
    user: UserWithoutPassword,
    data: DeleteMessageDto,
  ): Promise<void> {
    const message = await this.prisma.message.findUnique({
      where: { id: data.message_id },
      include: {
        sender: { select: SAFE_USER_SELECT },
      },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Only sender or admin can delete messages
    if (user.role !== Role.ADMIN && message.sender_id !== user.id) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    // Soft delete - mark as excluded
    await this.prisma.message.update({
      where: { id: data.message_id },
      data: { is_excluded: true },
    });

    // Notify about deleted message
    await this.notificationService.notifyMessageDeleted(message);
  }

  /**
   * Mark messages as read
   */
  async markMessagesAsRead(
    user: UserWithoutPassword,
    chat_partner_id: string,
  ): Promise<void> {
    if (user.role === Role.USER) {
      // Users mark messages from support as read
      if (chat_partner_id !== SUPPORT_ID) {
        throw new ForbiddenException(
          'Users can only mark support messages as read',
        );
      }

      await this.prisma.message.updateMany({
        where: {
          sender: { role: Role.ADMIN },
          receiver_id: user.id,
          is_read: false,
        },
        data: { is_read: true },
      });
    } else if (user.role === Role.ADMIN) {
      // Admins mark messages from specific user as read
      await this.prisma.message.updateMany({
        where: {
          sender_id: chat_partner_id,
          receiver_id: user.id,
          is_read: false,
        },
        data: { is_read: true },
      });
    } else {
      throw new ForbiddenException(
        'Only users and admins can mark messages as read',
      );
    }

    // Notify chat partner that messages were read
    await this.notificationService.notifyMessagesRead(user.id, chat_partner_id);
  }
}
