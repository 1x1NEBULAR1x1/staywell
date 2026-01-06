import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { Role, UserWithoutPassword } from '@shared/src';

@Injectable()
export class ChatRoomService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Join user to chat room
   */
  async joinChat(
    user: UserWithoutPassword,
    chat_partner_id: string,
  ): Promise<void> {
    if (user.role === Role.ADMIN) {
      // Admins can join chats with specific users
      // Validate that the chat partner exists and is a user
      const partner = await this.prisma.user.findUnique({
        where: { id: chat_partner_id },
      });

      if (!partner) throw new NotFoundException('Chat partner not found');
    } else if (user.role === Role.USER) {
      // Users can only join support chat
      if (chat_partner_id !== 'support') {
        throw new ForbiddenException('Users can only join support chat');
      }
    } else {
      throw new ForbiddenException('Invalid user role');
    }
  }

  /**
   * Get chat room name
   */
  getChatRoomName(user1: string, user2: string): string {
    return `chat_${[user1, user2].sort().join('_')}`;
  }
}
