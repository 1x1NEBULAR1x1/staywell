import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { Event, Prisma } from '@shared/src/database';
import { EventsFiltersDto } from '../dto';
import { BaseListResult } from '@shared/src/common';
import { ExtendedEvent } from '@shared/src/types/events-section';

/**
 * Service for retrieving lists of events with filtering and pagination
 */
@Injectable()
export class ListService {
  constructor(private readonly prisma: PrismaService) {}

  customFilters(options: EventsFiltersDto) {
    const {
      search,
      guide_id,
      min_capacity,
      max_capacity,
      max_price,
      min_price,
    } = options;
    const filters: Prisma.EventWhereInput = {};
    if (guide_id) filters.guide_id = guide_id;
    if (min_price || max_price) {
      filters.price = {};
      if (min_price) filters.price.gte = min_price;
      if (max_price) filters.price.lte = max_price;
    }
    if (min_capacity || max_capacity) {
      filters.capacity = {};
      if (min_capacity) filters.capacity.gte = min_capacity;
      if (max_capacity) filters.capacity.lte = max_capacity;
    }
    if (search) {
      filters.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    return filters;
  }
  /**
   * Find all events with filtering and pagination
   * @param filters - Query parameters for filtering and pagination
   * @returns Paginated list of events with total count
   */
  async findAll({
    take,
    skip,
    ...filters
  }: EventsFiltersDto): Promise<BaseListResult<ExtendedEvent>> {
    const query_options = this.prisma.buildQuery(
      { take, skip, ...filters },
      'created',
      'created',
      (filters: EventsFiltersDto) => this.customFilters(filters),
    );
    const { items, total } = (await this.prisma.findWithPagination(
      this.prisma.event,
      query_options,
      { images: true, guide: true },
    )) as unknown as { items: ExtendedEvent[]; total: number };
    return { items, total, skip, take };
  }
}
