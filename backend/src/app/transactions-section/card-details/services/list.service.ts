import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { CardDetail, Prisma, User, Role } from '@shared/src/database';
import { BaseListResult } from '@shared/src/common';
import { CardDetailsFiltersDto } from '../dto';

/**
 * Service for retrieving lists of card payment details with filtering and pagination
 */
@Injectable()
export class ListService {
  constructor(private readonly prisma: PrismaService) {}

  customFilters(options: CardDetailsFiltersDto) {
    const { user_id, holder, start, end } = options;
    const filters: Prisma.CardDetailWhereInput = {};
    if (user_id) filters.user_id = user_id;
    if (holder) filters.holder = { contains: holder, mode: 'insensitive' };
    if (start) {
      filters.expiry_year = { gte: start.getFullYear() };
      filters.expiry_month = { gte: start.getMonth() };
    }
    if (end) {
      filters.expiry_year = { lte: end.getFullYear() };
      filters.expiry_month = { lte: end.getMonth() };
    }
    return filters;
  }
  /**
   * Find all card details with filtering and pagination
   * @param filters - Query parameters for filtering and pagination
   * @returns Paginated list of card details with total count
   */
  async findAll({
    user,
    filters,
  }: {
    filters: CardDetailsFiltersDto;
    user: User;
  }): Promise<BaseListResult<CardDetail>> {
    const final_filters =
      user.role === Role.ADMIN ? filters : { ...filters, user_id: user.id };
    const query_options = this.prisma.buildQuery<CardDetail>(
      final_filters,
      'created',
      'created',
      this.customFilters,
    );
    const { items, total } = await this.prisma.findWithPagination<CardDetail>(
      this.prisma.cardDetail,
      query_options,
      { user: true },
    );
    return {
      items,
      total,
      skip: query_options.skip,
      take: query_options.take,
    };
  }
}
