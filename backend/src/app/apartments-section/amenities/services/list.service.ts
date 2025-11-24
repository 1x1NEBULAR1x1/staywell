import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { AmenitiesFiltersDto } from '../dto';
import { Prisma, Amenity } from '@shared/src/database';
import { ExtendedAmenity } from '@shared/src/types/apartments-section';
import { BaseListResult } from '@shared/src/common/base-types/base-list-result.interface';

@Injectable()
export class ListService {
  constructor(private prisma: PrismaService) { }

  customFilters(options: AmenitiesFiltersDto) {
    const { name } = options;
    const filters: Prisma.AmenityWhereInput = {};
    if (name) filters.name = { contains: name, mode: 'insensitive' };
    return filters;
  }
  /**
   * Finds all amenities based on filter criteria
   * @param filters Filter parameters and pagination
   * @returns Filtered list of amenities with pagination metadata
   */
  async findAll(filters: AmenitiesFiltersDto): Promise<BaseListResult<Amenity>> {
    const query_options = this.prisma.buildQuery<Amenity>({
      filters,
      customFilters: this.customFilters,
    });
    const { items, total } = await this.prisma.findWithPagination<Amenity>({
      model: this.prisma.amenity,
      query_options,
    });
    const { take, skip } = query_options;
    return { items, total, skip, take };
  }
}
