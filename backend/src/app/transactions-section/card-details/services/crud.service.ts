import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { CardDetail, Prisma, User, Role } from '@shared/src/database';
import { CreateCardDetailDto, UpdateCardDetailDto } from '../dto';
/**
 * Service for performing CRUD operations on card payment details
 */
@Injectable()
export class CrudService {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Create new card payment details
   * @param createCardDetailDto - DTO with card details properties
   * @returns The created card details
   */
  async create({
    data,
    user,
  }: {
    data: CreateCardDetailDto;
    user: User;
  }): Promise<CardDetail> {
    await this.findOne({ where: { number: data.number }, user });
    const user_id = user.role == Role.ADMIN ? data.user_id : user.id;
    return await this.prisma.cardDetail.create({
      data: { ...data, user_id },
      include: { user: true, transactions: true },
    });
  }
  /**
   * Find specific card details by ID
   * @param id - Card details ID
   * @returns Card details with related user and transactions
   */
  async findOne({
    user,
    where,
  }: {
    where: Prisma.CardDetailWhereUniqueInput;
    user: User;
  }): Promise<CardDetail> {
    const card_detail = await this.prisma.cardDetail.findUnique({
      where,
      include: { user: true, transactions: true },
    });
    if (!card_detail) throw new NotFoundException('CardDetail not found');
    if (user.role !== Role.ADMIN && user.id !== card_detail.user_id)
      throw new ForbiddenException('Access denied');
    return card_detail;
  }
  /**
   * Update existing card details
   * @param id - Card details ID
   * @param updateCardDetailDto - DTO with updated card details properties
   * @returns The updated card details
   */
  async update({
    id,
    data,
    user,
  }: {
    id: string;
    data: UpdateCardDetailDto;
    user: User;
  }): Promise<CardDetail> {
    await Promise.all([
      this.findOne({ where: { id }, user }),
      this.findOne({ where: { number: data.number }, user }),
    ]);
    const user_id = user.role === Role.ADMIN ? data.user_id : user.id;
    return await this.prisma.cardDetail.update({
      where: { id },
      data: { ...data, user_id },
      include: { user: true, transactions: true },
    });
  }
  /**
   * Remove card details
   * @param id - Card details ID
   * @returns The deleted card details
   */
  async remove({ user, id }: { id: string; user: User }) {
    return !(await this.findOne({ where: { id }, user })).is_excluded
      ? await this.update({ id, data: { is_excluded: true }, user })
      : await this.prisma.cardDetail.delete({ where: { id } });
  }
}
