import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/lib/prisma";
import { MessagesFiltersDto } from "../dto";
import { Prisma, User, Role, Message } from "@shared/src/database";
import { BaseListResult } from "@shared/src/common";

@Injectable()
export class ListService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll({
    filters,
    user,
  }: {
    filters: MessagesFiltersDto;
    user: User;
  }): Promise<BaseListResult<Message>> {
    const {
      take = 20,
      skip = 0,
      sort_field = "created",
      sort_direction = "desc",
      sender_id,
      receiver_id,
      chat_partner_id,
      is_read,
      booking_id,
    } = filters;

    const where: Prisma.MessageWhereInput = {};

    // Non-admin users can only see their own messages
    if (user.role !== Role.ADMIN) {
      where.OR = [
        { sender_id: user.id },
        { receiver_id: user.id },
      ];
    }

    // Filter by sender
    if (sender_id) {
      where.sender_id = sender_id;
    }

    // Filter by receiver
    if (receiver_id) {
      where.receiver_id = receiver_id;
    }

    // Filter by chat partner (either sender or receiver)
    if (chat_partner_id) {
      where.OR = [
        { sender_id: chat_partner_id, receiver_id: user.id },
        { receiver_id: chat_partner_id, sender_id: user.id },
      ];
    }

    // Filter by read status
    if (is_read !== undefined) {
      where.is_read = is_read;
    }

    // Filter by booking
    if (booking_id) {
      where.booking_id = booking_id;
    }

    const [items, total] = await Promise.all([
      this.prisma.message.findMany({
        where,
        take,
        skip,
        orderBy: { [sort_field]: sort_direction },
        include: {
          sender: { select: { id: true, first_name: true, last_name: true, image: true } },
          receiver: { select: { id: true, first_name: true, last_name: true, image: true } },
        },
      }),
      this.prisma.message.count({ where }),
    ]);

    return {
      items,
      total,
      take,
      skip,
    };
  }
}


