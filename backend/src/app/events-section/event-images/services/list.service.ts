import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { EventImage, Prisma } from '@shared/src/database';
import { BaseListResult } from '@shared/src/common';
import { EventImagesFiltersDto } from '../dto';

/**
 * Service for retrieving lists of event images with filtering and pagination
 */
@Injectable()
export class ListService {
  constructor(private readonly prisma: PrismaService) { }

  customFilters(options: EventImagesFiltersDto) {
    const { event_id } = options;
    const filters: Prisma.EventImageWhereInput = {};
    if (event_id) filters.event_id = event_id;
    return filters;
  }
  /**
   * Find all event images with filtering and pagination
   * @param filterDto - Query parameters for filtering and pagination
   * @returns Paginated list of event images with total count
   */
  async findAll(filters: EventImagesFiltersDto): Promise<BaseListResult<EventImage>> {
    const query_options = this.prisma.buildQuery<EventImage>({
      filters,
      customFilters: this.customFilters,
    });
    const { items, total } = await this.prisma.findWithPagination<EventImage>({
      model: this.prisma.eventImage,
      query_options,
    });
    const { take, skip } = query_options;
    return { items, total, skip, take };
  }
}
