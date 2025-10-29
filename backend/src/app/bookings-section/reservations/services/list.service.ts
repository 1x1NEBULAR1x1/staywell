import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import {
  SAFE_USER_SELECT,
  BaseListResult,
  ExtendedReservation,
} from '@shared/src';
import { Prisma, User, Role } from '@shared/src/database';
import { ReservationsFiltersDto } from '../dto';

@Injectable()
export class ListService {
  constructor(private prisma: PrismaService) {}

  customFilters(options: ReservationsFiltersDto) {
    const {
      user_id,
      apartment_id,
      check_in_date_start,
      check_in_date_end,
      check_out_date_start,
      check_out_date_end,
    } = options;
    const filters: Prisma.ReservationWhereInput = {};
    if (user_id) filters.user_id = user_id;
    if (apartment_id) filters.apartment_id = apartment_id;
    if (check_in_date_start || check_in_date_end) {
      filters.start = {};
      if (check_in_date_start) filters.start.gte = check_in_date_start;
      if (check_in_date_end) filters.start.lte = check_in_date_end;
    }
    if (check_out_date_start || check_out_date_end) {
      filters.end = {};
      if (check_out_date_start) filters.end.gte = check_out_date_start;
      if (check_out_date_end) filters.end.lte = check_out_date_end;
    }
    return filters;
  }
  /**
   * Find all reservations based on filter criteria
   * @param filters Filter parameters and pagination
   * @returns Filtered list of reservations with pagination metadata
   */
  async findAll({
    filters,
    user,
  }: {
    filters: ReservationsFiltersDto;
    user: User;
  }): Promise<BaseListResult<ExtendedReservation>> {
    const final_filters =
      user.role === Role.ADMIN ? filters : { ...filters, user_id: user.id };
    delete final_filters.is_excluded;
    const query_options = this.prisma.buildQuery(
      final_filters,
      'created',
      'created',
      (filters: ReservationsFiltersDto) => this.customFilters(filters),
    );
    const { items, total } = await this.prisma.findWithPagination(
      this.prisma.reservation,
      query_options,
      {
        user: { select: SAFE_USER_SELECT },
        apartment: true,
      },
    );
    return {
      items: items as ExtendedReservation[],
      total,
      skip: query_options.skip,
      take: query_options.take,
    };
  }
}
