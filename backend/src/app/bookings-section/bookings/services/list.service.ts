import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { Booking, Prisma, User, Role } from '@shared/src/database';
import { BookingsFiltersDto } from '../dto';
import { BaseListResult } from '@shared/src/common';
import { BookingsFilters, ExtendedBooking, EXTENDED_BOOKING_INCLUDE } from '@shared/src/types/bookings-section';

@Injectable()
export class ListService {
  constructor(private readonly prisma: PrismaService) { }

  customFilters(options: BookingsFiltersDto) {
    const {
      status,
      user_id,
      booking_variant_id,
      transaction_id,
      start_date,
      end_date,
    } = options;
    const filters: Prisma.BookingWhereInput = {};
    if (status) filters.status = status;
    if (user_id) filters.user_id = user_id;
    if (booking_variant_id) filters.booking_variant_id = booking_variant_id;
    if (transaction_id) filters.transaction_id = transaction_id;
    if (start_date || end_date) {
      if (start_date && end_date) {
        filters.OR = [{ AND: [{ start: { lte: end_date } }, { end: { gte: start_date } }] }];
      } else if (start_date) {
        filters.start = { gte: start_date };
      } else if (end_date) {
        filters.end = { lte: end_date };
      }
    }
    return filters;
  }

  /**
   * Finds bookings based on filter criteria
   * @param filterDto Filter and pagination parameters
   * @returns List of bookings with pagination metadata
   */
  async findAll({
    filters: filtersDto,
    user,
  }: {
    filters: BookingsFiltersDto;
    user: User;
  }): Promise<BaseListResult<ExtendedBooking>> {
    const user_id = user.role === Role.ADMIN ? filtersDto.user_id : user.id;
    const { is_excluded, ...filters } = { ...filtersDto, user_id };
    const query_options = this.prisma.buildQuery({
      filters,
      date_field: 'start',
      customFilters: this.customFilters,
    });
    const { items, total } = await this.prisma.findWithPagination<ExtendedBooking>({
      model: this.prisma.booking,
      query_options,
      include: EXTENDED_BOOKING_INCLUDE,
    });
    const { take, skip } = query_options;
    return { items, total, skip, take };
  }
}
