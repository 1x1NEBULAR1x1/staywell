import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { BookingEvent, Prisma, User, Role } from '@shared/src/database';
import { BookingEventsFiltersDto } from '../dto';
import { BaseListResult } from '@shared/src/common';
import { ExtendedBookingEvent } from '@shared/src/types/events-section';

/**
 * Service for retrieving lists of event bookings with filtering and pagination
 */
@Injectable()
export class ListService {
  constructor(private readonly prisma: PrismaService) {}

  customFilters(options: BookingEventsFiltersDto) {
    const { booking_id, event_id, transaction_id, user_id } = options;
    const filters: Prisma.BookingEventWhereInput = {};
    if (user_id) filters.booking = { user_id };
    if (booking_id) filters.booking_id = booking_id;
    if (event_id) filters.event_id = event_id;
    if (transaction_id) filters.transaction_id = transaction_id;
    return filters;
  }
  /**
   * Find all event bookings with filtering and pagination
   * @param filterDto - Query parameters for filtering and pagination
   * @returns Paginated list of booking events with total count
   */
  async findAll({
    filters,
    user,
  }: {
    filters: BookingEventsFiltersDto;
    user: User;
  }): Promise<BaseListResult<ExtendedBookingEvent>> {
    const final_filters =
      user.role === Role.ADMIN ? filters : { ...filters, user_id: user.id };

    const query_options = this.prisma.buildQuery(
      final_filters,
      'created',
      'created',
      (filters: BookingEventsFiltersDto) => this.customFilters(filters),
    );

    const { items, total } =
      (await this.prisma.findWithPagination<BookingEvent>(
        this.prisma.bookingEvent,
        query_options,
        { event: true },
      )) as { items: ExtendedBookingEvent[]; total: number };
    return {
      items,
      total,
      skip: query_options.skip,
      take: query_options.take,
    };
  }
}
