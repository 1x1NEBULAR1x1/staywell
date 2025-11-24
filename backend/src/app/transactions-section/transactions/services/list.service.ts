import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { SAFE_USER_SELECT } from '@shared/src';
import { Prisma, User, Role, Transaction } from '@shared/src/database';
import { TransactionsFiltersDto } from '../dto';

/**
 * Service for retrieving lists of transactions with filtering and pagination
 */
@Injectable()
export class ListService {
  constructor(private readonly prisma: PrismaService) { }

  customFilters = (options: TransactionsFiltersDto) => {
    const {
      user_id,
      min_amount,
      max_amount,
      payment_method,
      transaction_status,
      transaction_type,
      card_details_id,
      transfer_details_id,
      search,
      description,
    } = options;
    const filters: Prisma.TransactionWhereInput = {};
    if (user_id) filters.user_id = user_id;
    if (min_amount || max_amount) {
      filters.amount = {
        ...(min_amount && { gte: min_amount }),
        ...(max_amount && { lte: max_amount }),
      };
    }
    if (payment_method) filters.payment_method = payment_method;
    if (transaction_status) filters.transaction_status = transaction_status;
    if (transaction_type) filters.transaction_type = transaction_type;
    if (card_details_id) filters.card_details_id = card_details_id;
    if (transfer_details_id) filters.transfer_details_id = transfer_details_id;
    if (search)
      filters.OR = [{ description: { contains: search, mode: 'insensitive' } }];
    if (description)
      filters.description = { contains: description, mode: 'insensitive' };
    return filters;
  };
  /**
   * Find all transactions with filtering and pagination
   * @param filters - Query parameters for filtering and pagination
   * @returns Paginated list of transactions with total count
   */
  async findAll({
    user,
    filters: filtersDto,
  }: {
    filters: TransactionsFiltersDto;
    user: User;
  }) {
    const user_id = user.role === Role.ADMIN ? filtersDto.user_id : user.id;
    const filters = { ...filtersDto, user_id };
    const query_options = this.prisma.buildQuery<Transaction>({
      filters,
      customFilters: this.customFilters,
    });
    const { items, total } = await this.prisma.findWithPagination<Transaction>({
      model: this.prisma.transaction,
      query_options,
      include: { user: { select: SAFE_USER_SELECT }, card_detail: true, transfer_detail: true },
    });
    const { take, skip } = query_options;
    return { items, total, skip, take };
  }
}