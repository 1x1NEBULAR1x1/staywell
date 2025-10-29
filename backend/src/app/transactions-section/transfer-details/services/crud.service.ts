import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { Role, User, SAFE_USER_SELECT } from '@shared/src';
import { CreateTransferDetailDto, UpdateTransferDetailDto } from '../dto';
/**
 * Service for performing CRUD operations on bank transfer details
 */
@Injectable()
export class CrudService {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Create new bank transfer details
   * @param data - DTO with transfer details properties
   * @returns The created transfer details
   */
  async create({ data, user }: { data: CreateTransferDetailDto; user: User }) {
    const user_id = user.role === Role.ADMIN ? data.user_id : user.id;
    return await this.prisma.transferDetail.create({
      data: { ...data, user_id },
      include: { user: { select: SAFE_USER_SELECT }, transactions: true },
    });
  }
  /**
   * Find specific bank transfer details by ID
   * @param id - Transfer details ID
   * @returns Transfer details with related user and transactions
   */
  async findOne({ id, user }: { user: User; id: string }) {
    const where = user.role === Role.ADMIN ? { id } : { id, user_id: user.id };
    const transfer_detail = await this.prisma.transferDetail.findUnique({
      where,
      include: { user: { select: SAFE_USER_SELECT }, transactions: true },
    });
    if (!transfer_detail)
      throw new NotFoundException('TransferDetails not found');
    return transfer_detail;
  }
  /**
   * Update existing bank transfer details
   * @param id - Transfer details ID
   * @param updateTransferDetailDto - DTO with updated transfer details properties
   * @returns The updated transfer details
   */
  async update({
    user,
    id,
    data,
  }: {
    user: User;
    id: string;
    data: UpdateTransferDetailDto;
  }) {
    await this.findOne({ user, id });
    const user_id = user.role === Role.ADMIN ? data.user_id : user.id;
    return await this.prisma.transferDetail.update({
      where: { id },
      data: { ...data, user_id },
      include: { user: { select: SAFE_USER_SELECT }, transactions: true },
    });
  }
  /**
   * Remove bank transfer details
   * @param id - Transfer details ID
   * @returns The deleted transfer details
   */
  async remove({ id, user }: { id: string; user: User }) {
    await this.findOne({ id, user });
    const where = user.role === Role.ADMIN ? { id } : { id, user_id: user.id };
    return await this.prisma.transferDetail.delete({ where });
  }
}
