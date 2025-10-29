import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { Prisma } from '@shared/src/database';
import { BaseListResult } from '@shared/src/common';
import { ExtendedBookingVariant } from '@shared/src/types/bookings-section';
import { BookingVariantsFiltersDto } from '../dto';

@Injectable()
export class ListService {
  constructor(private prisma: PrismaService) {}

  customFilters(options: BookingVariantsFiltersDto) {
    const {
      apartment_id,
      min_price,
      max_price,
      min_capacity,
      max_capacity,
      is_available,
    } = options;
    const filters: Prisma.BookingVariantWhereInput = {};
    if (apartment_id) filters.apartment_id = apartment_id;
    if (is_available !== undefined) filters.is_available = is_available;
    if (min_price !== undefined || max_price !== undefined) {
      filters.price = {};
      if (min_price !== undefined) filters.price.gte = min_price;
      if (max_price !== undefined) filters.price.lte = max_price;
    }
    if (min_capacity !== undefined || max_capacity !== undefined) {
      filters.capacity = {};
      if (min_capacity !== undefined) filters.capacity.gte = min_capacity;
      if (max_capacity !== undefined) filters.capacity.lte = max_capacity;
    }
    return filters;
  }
  /**
   * Find all booking variants based on filter criteria
   * @param filterDto Filter parameters and pagination
   * @returns Filtered list of booking variants with pagination metadata
   */
  async findAll({
    take,
    skip,
    ...filters
  }: BookingVariantsFiltersDto): Promise<
    BaseListResult<ExtendedBookingVariant>
  > {
    const query_options = this.prisma.buildQuery(
      { take, skip, ...filters },
      'created',
      'created',
      (filters: BookingVariantsFiltersDto) => this.customFilters(filters),
    );

    const { items, total } = (await this.prisma.findWithPagination(
      this.prisma.bookingVariant,
      query_options,
      { apartment: true },
    )) as unknown as { items: ExtendedBookingVariant[]; total: number }; //TODO TYPE ERROR HERE

    return { items, total, skip, take };
  }
}
