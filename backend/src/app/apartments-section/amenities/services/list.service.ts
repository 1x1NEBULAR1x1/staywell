import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { AmenitiesFiltersDto } from '../dto';
import { Prisma, Amenity } from '@shared/src/database';
import { ExtendedAmenity } from '@shared/src/types/apartments-section';
import { BaseListResult } from '@shared/src/common/base-types/base-list-result.interface';

@Injectable()
export class ListService {
  constructor(private prisma: PrismaService) {}

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
  async findAll({
    take,
    skip,
    ...filters
  }: AmenitiesFiltersDto): Promise<BaseListResult<ExtendedAmenity>> {
    const query_options = this.prisma.buildQuery(
      { ...filters, take, skip },
      'created',
      'created',
      (filters: AmenitiesFiltersDto) => this.customFilters(filters),
    );

    const { items, total } = (await this.prisma.findWithPagination<Amenity>(
      this.prisma.amenity,
      query_options,
      { apartment_amenities: true },
    )) as { items: ExtendedAmenity[]; total: number };

    return { items, total, skip, take };
  }
}
