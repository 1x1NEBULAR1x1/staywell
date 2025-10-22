import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "src/lib/prisma";
import { CreateMessageDto, UpdateMessageDto } from "../dto";
import { User, Role } from "@shared/src/database";

@Injectable()
export class CrudService {
  constructor(private readonly prisma: PrismaService) { }

  async create({ user, data }: { user: User; data: CreateMessageDto }) {
    return this.prisma.message.create({
      data: {
        sender_id: user.id,
        receiver_id: data.receiver_id,
        message: data.message,
        booking_id: data.booking_id,
      },
      include: {
        sender: { select: { id: true, first_name: true, last_name: true, image: true } },
        receiver: { select: { id: true, first_name: true, last_name: true, image: true } },
      },
    });
  }

  async findOne({ id, user }: { id: string; user: User }) {
    const message = await this.prisma.message.findUnique({
      where: { id },
      include: {
        sender: { select: { id: true, first_name: true, last_name: true, image: true } },
        receiver: { select: { id: true, first_name: true, last_name: true, image: true } },
      },
    });

    if (!message) {
      throw new NotFoundException("Message not found");
    }

    // Only sender, receiver, or admin can view the message
    if (
      user.role !== Role.ADMIN &&
      message.sender_id !== user.id &&
      message.receiver_id !== user.id
    ) {
      throw new ForbiddenException("You don't have permission to view this message");
    }

    return message;
  }

  async update({ id, user, data }: { id: string; user: User; data: UpdateMessageDto }) {
    const message = await this.findOne({ id, user });

    // Only receiver or admin can mark as read
    if (data.is_read !== undefined && user.role !== Role.ADMIN && message.receiver_id !== user.id) {
      throw new ForbiddenException("You can't mark this message as read");
    }

    // Only sender can edit message content
    if (data.message && user.role !== Role.ADMIN && message.sender_id !== user.id) {
      throw new ForbiddenException("You can't edit this message");
    }

    return this.prisma.message.update({
      where: { id },
      data,
      include: {
        sender: { select: { id: true, first_name: true, last_name: true, image: true } },
        receiver: { select: { id: true, first_name: true, last_name: true, image: true } },
      },
    });
  }

  async remove({ id, user }: { id: string; user: User }) {
    const message = await this.findOne({ id, user });

    // Only sender or admin can delete
    if (user.role !== Role.ADMIN && message.sender_id !== user.id) {
      throw new ForbiddenException("You can't delete this message");
    }

    return this.prisma.message.delete({
      where: { id },
    });
  }
}


