import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { CardDetail, Prisma, User, Role } from '@shared/src/database';
import { BaseListResult } from '@shared/src/common';
import { SAFE_USER_SELECT } from '@shared/src/types/users-section';
import { CardDetailsFiltersDto } from '../dto';

/**
 * Service for retrieving lists of card payment details with filtering and pagination
 */
@Injectable()
export class ListService {
  constructor(private readonly prisma: PrismaService) { }

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
    filters: filtersDto,
  }: {
    filters: CardDetailsFiltersDto;
    user: User;
  }): Promise<BaseListResult<CardDetail>> {
    const user_id = user.role === Role.ADMIN ? filtersDto.user_id : user.id;
    const filters = { ...filtersDto, user_id };
    const query_options = this.prisma.buildQuery<CardDetail>({
      filters,
      customFilters: this.customFilters,
    });
    const { items, total } = await this.prisma.findWithPagination<CardDetail>({
      model: this.prisma.cardDetail,
      query_options,
      include: { user: { select: SAFE_USER_SELECT } },
    });
    const { take, skip } = query_options;
    return { items, total, skip, take };
  }
}
