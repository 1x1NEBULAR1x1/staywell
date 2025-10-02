import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/lib/prisma";
import { Role, TransactionStatus, User, SAFE_USER_SELECT } from "@shared/src";
import { CreateTransactionDto, UpdateTransactionDto } from "../dto";
/**
 * Service for performing CRUD operations on transactions
 */
@Injectable()
export class CrudService {
  constructor(private readonly prisma: PrismaService) { }
  /**
   * Create a new transaction
   * @param createTransactionDto - DTO with transaction properties
   * @returns The created transaction
   */
  async create({ data, user }: { data: CreateTransactionDto; user: User }) {
    const user_id = user.role === Role.ADMIN ? data.user_id : user.id;
    return this.prisma.transaction.create({
      data: { ...data, user_id, transaction_status: TransactionStatus.PENDING },
      include: {
        user: { select: SAFE_USER_SELECT },
        card_detail: true,
        transfer_detail: true,
        booking: true,
        booking_event: true,
      },
    });
  }
  /**
   * Find a specific transaction by ID
   * @param id - Transaction ID
   * @returns Transaction with related entities
   */
  async findOne({ id, user }: { id: string; user: User }) {
    const where = user.role === Role.ADMIN ? { id } : { id, user_id: user.id };
    return this.prisma.transaction.findUnique({
      where,
      include: {
        user: { select: SAFE_USER_SELECT },
        card_detail: true,
        transfer_detail: true,
        booking: true,
        booking_event: true,
      },
    });
  }

  /**
   * Update an existing transaction
   * @param id - Transaction ID
   * @param updateTransactionDto - DTO with updated transaction properties
   * @returns The updated transaction
   */
  async update({
    id,
    user,
    data,
  }: {
    id: string;
    data: UpdateTransactionDto;
    user: User;
  }) {
    await this.findOne({ id, user });
    const user_id = user.role === Role.ADMIN ? data.user_id : user.id;
    return this.prisma.transaction.update({
      where: { id },
      data: { ...data, user_id },
      include: {
        user: { select: SAFE_USER_SELECT },
        card_detail: true,
        transfer_detail: true,
        booking: true,
        booking_event: true,
      },
    });
  }

  /**
   * Remove a transaction
   * @param id - Transaction ID
   * @returns The deleted transaction
   */
  async remove({ id, user }: { id: string; user: User }) {
    await this.findOne({ id, user });
    return await this.prisma.transaction.delete({ where: { id } });
  }
}
