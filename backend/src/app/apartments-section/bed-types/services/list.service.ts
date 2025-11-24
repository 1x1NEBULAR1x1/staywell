import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { Prisma, BedType } from '@shared/src/database';
import { BedTypesFiltersDto } from '../dto';
import { BaseListResult } from '@shared/src/common/base-types/base-list-result.interface';

@Injectable()
export class ListService {
  constructor(private prisma: PrismaService) { }

  customFilters(options: BedTypesFiltersDto) {
    const { search, name } = options;
    const filters: Prisma.BedTypeWhereInput = {};
    if (search) filters.name = { contains: search, mode: 'insensitive' };
    if (name) filters.name = { contains: name, mode: 'insensitive' };
    return filters;
  }
  /**
   * Finds all bed types based on filter criteria
   * @param filters Filter parameters and pagination
   * @returns Filtered list of bed types with pagination metadata
   */
  async findAll(filters: BedTypesFiltersDto): Promise<BaseListResult<BedType>> {
    const query_options = this.prisma.buildQuery<BedType>({
      filters,
      customFilters: this.customFilters,
    });
    const { items, total } = await this.prisma.findWithPagination<BedType>({
      model: this.prisma.bedType,
      query_options,
    });
    const { take, skip } = query_options;
    return { items, total, skip, take };
  }
}
