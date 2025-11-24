import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { BookingEvent, Prisma, User, Role } from '@shared/src/database';
import { BookingEventsFiltersDto } from '../dto';
import { BaseListResult } from '@shared/src/common';
import { EXTENDED_BOOKING_EVENT_INCLUDE, ExtendedBookingEvent } from '@shared/src/types/events-section';

/**
 * Service for retrieving lists of event bookings with filtering and pagination
 */
@Injectable()
export class ListService {
  constructor(private readonly prisma: PrismaService) { }

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
    filters: filtersDto,
    user,
  }: {
    filters: BookingEventsFiltersDto;
    user: User;
  }): Promise<BaseListResult<ExtendedBookingEvent>> {
    const user_id = user.role === Role.ADMIN ? filtersDto.user_id : user.id;
    const filters = { ...filtersDto, user_id };
    const query_options = this.prisma.buildQuery<BookingEvent>({
      filters,
      customFilters: this.customFilters,
    });

    const { items, total } = await this.prisma.findWithPagination<ExtendedBookingEvent>({
      model: this.prisma.bookingEvent,
      query_options,
      include: EXTENDED_BOOKING_EVENT_INCLUDE,
    });
    const { take, skip } = query_options;
    return { items, total, skip, take };
  }
}
