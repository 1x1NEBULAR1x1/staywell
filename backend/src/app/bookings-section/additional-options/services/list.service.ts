import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { AdditionalOption, Prisma } from '@shared/src/database';
import { BaseListResult } from '@shared/src/common';
import { AdditionalOptionsFiltersDto } from '../dto';

@Injectable()
export class ListService {
  constructor(private readonly prisma: PrismaService) {}

  customFilters(options: AdditionalOptionsFiltersDto) {
    const { name, min_price, max_price } = options;
    const filters: Prisma.AdditionalOptionWhereInput = {};
    if (name) {
      filters.name = {
        contains: name,
        mode: 'insensitive',
      };
    }
    if (min_price !== undefined || max_price !== undefined) {
      filters.price = {};
      if (min_price !== undefined) filters.price.gte = min_price;
      if (max_price !== undefined) filters.price.lte = max_price;
    }
    return filters;
  }
  /**
   * Finds additional options based on filter criteria
   * @param filters Filter and pagination parameters
   * @returns List of additional options with pagination metadata
   */
  async findAll(
    filters: AdditionalOptionsFiltersDto,
  ): Promise<BaseListResult<AdditionalOption>> {
    const query_options = this.prisma.buildQuery<AdditionalOption>(
      filters,
      'created',
      'created',
      this.customFilters,
    );

    const { items, total } =
      await this.prisma.findWithPagination<AdditionalOption>(
        this.prisma.additionalOption,
        query_options,
      );

    return {
      items,
      total,
      skip: query_options.skip,
      take: query_options.take,
    };
  }
}
