import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/lib/prisma";
import {
  BookingAdditionalOption,
  Prisma,
  User,
} from "@shared/src/database";
import { BookingAdditionalOptionsFiltersDto } from "../dto";
import { BaseListResult } from "@shared/src/common";
import { ExtendedBookingAdditionalOption } from "@shared/src/types/bookings-section";
import { CheckService } from "./check.service";

@Injectable()
export class ListService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly checkService: CheckService,
  ) { }

  customFilters(options: BookingAdditionalOptionsFiltersDto) {
    const { booking_id, option_id, min_amount, max_amount } = options;
    const filters: Prisma.BookingAdditionalOptionWhereInput = {};
    if (booking_id) filters.booking_id = booking_id;
    if (option_id) filters.option_id = option_id;
    if (min_amount) filters.amount = { gte: min_amount };
    if (max_amount) filters.amount = { lte: max_amount };
    return filters;
  }
  /**
   * Finds booking-option relationships based on filter criteria
   * @param filterDto Filter and pagination parameters
   * @returns List of booking options with pagination metadata
   */
  async findAll(
    { take, skip, ...filters }: BookingAdditionalOptionsFiltersDto,
  ): Promise<BaseListResult<ExtendedBookingAdditionalOption>> {
    const query_options = this.prisma.buildQuery(
      { take, skip, ...filters },
      "created",
      "created",
      (filters: BookingAdditionalOptionsFiltersDto) =>
        this.customFilters(filters),
    );
    const { items, total } =
      await this.prisma.findWithPagination<BookingAdditionalOption>(
        this.prisma.bookingAdditionalOption,
        query_options,
        { additional_option: true },
      ) as { items: ExtendedBookingAdditionalOption[]; total: number };
    return { items, total, skip, take };
  }

  /**
   * Calculates the total price of additional options for a booking
   * @param bookingId Booking ID
   * @returns Total price
   */
  async calculateTotalPrice({
    user,
    booking_id,
  }: {
    user: User;
    booking_id: string;
  }): Promise<{ total_price: number }> {
    await this.checkService.checkOwnerOrAdmin({ booking_id, user });
    const booking_options = await this.prisma.bookingAdditionalOption.findMany({
      where: { booking_id },
      include: { additional_option: true },
    });
    return {
      total_price: booking_options.reduce((total, booking_option) => {
        return (
          total + booking_option.amount * booking_option.additional_option.price
        );
      }, 0),
    };
  }
}
