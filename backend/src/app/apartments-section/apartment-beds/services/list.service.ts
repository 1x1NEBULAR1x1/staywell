import { Injectable } from '@nestjs/common';
import { Prisma, ApartmentBed } from '@shared/src/database';
import { BaseListResult } from '@shared/src/common/base-types/base-list-result.interface';
import { EXTENDED_APARTMENT_BED_INCLUDE, ExtendedApartmentBed } from '@shared/src/types/apartments-section';
import { ApartmentBedsFiltersDto } from '../dto';
import { PrismaService } from 'src/lib/prisma';

@Injectable()
export class ListService {
  constructor(private prisma: PrismaService) { }

  customFilters(options: ApartmentBedsFiltersDto) {
    const { bed_type_id, min_count, max_count, apartment_id } = options;
    const filters: Prisma.ApartmentBedWhereInput = {};
    if (apartment_id) filters.apartment_id = apartment_id;
    if (bed_type_id) filters.bed_type_id = bed_type_id;
    if (min_count || max_count) {
      filters.count = {};
      if (min_count) filters.count.gte = min_count;
      if (max_count) filters.count.lte = max_count;
    }
    return filters;
  }
  /**
   * Search for all apartment_beds data by filters
   * @param apartment_id Apartment ID to filter by
   * @param filterDto Filter params and pagination
   * @returns Filtered list of apartment beds
   */
  async findAll(filters: ApartmentBedsFiltersDto): Promise<BaseListResult<ExtendedApartmentBed>> {
    const query_options = this.prisma.buildQuery<ApartmentBed>({
      filters,
      customFilters: this.customFilters,
    });
    const { items, total } = await this.prisma.findWithPagination<ExtendedApartmentBed>({
      model: this.prisma.apartmentBed,
      query_options,
      include: EXTENDED_APARTMENT_BED_INCLUDE,
    });
    const { take, skip } = query_options;
    return { items, total, skip, take };
  }
}
