import { Injectable } from '@nestjs/common';
import { EXTENDED_APARTMENT_AMENITY_INCLUDE, ExtendedApartmentAmenity } from '@shared/src/types/apartments-section';
import { BaseListResult } from '@shared/src/common/base-types/base-list-result.interface';
import { Prisma, ApartmentAmenity } from '@shared/src/database';
import { ApartmentAmenitiesFiltersDto } from '../dto';
import { PrismaService } from 'src/lib/prisma';

@Injectable()
export class ListService {
  constructor(private prisma: PrismaService) { }

  customFilters(options: ApartmentAmenitiesFiltersDto) {
    const { amenity_id, apartment_id } = options;
    const filters: Prisma.ApartmentAmenityWhereInput = {};
    if (amenity_id) filters.amenity_id = amenity_id;
    if (apartment_id) filters.apartment_id = apartment_id;
    return filters;
  }

  /**
   * Find all Apartment Amenities based on filter criteria
   * @param filters Filter parameters and pagination
   * @returns Filtered list of apartment amenities with pagination metadata
   */
  async findAll(filters: ApartmentAmenitiesFiltersDto): Promise<
    BaseListResult<ExtendedApartmentAmenity>
  > {
    const query_options = this.prisma.buildQuery<ApartmentAmenity>({
      filters,
      customFilters: this.customFilters,
    });
    const { items, total } = await this.prisma.findWithPagination<ExtendedApartmentAmenity>({
      model: this.prisma.apartmentAmenity,
      query_options,
      include: EXTENDED_APARTMENT_AMENITY_INCLUDE,
    });
    const { take, skip } = query_options;
    return { items, total, skip, take };
  }
}
