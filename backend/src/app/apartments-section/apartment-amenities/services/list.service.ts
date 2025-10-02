import { Injectable } from "@nestjs/common";
import { ExtendedApartmentAmenity } from "@shared/src/types/apartments-section";
import { BaseListResult } from "@shared/src/common/base-types/base-list-result.interface";
import { Prisma, ApartmentAmenity } from "@shared/src/database";
import { ApartmentAmenitiesFiltersDto } from "../dto";
import { PrismaService } from "src/lib/prisma";

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
  async findAll(
    { take, skip, ...filters }: ApartmentAmenitiesFiltersDto,
  ): Promise<BaseListResult<ExtendedApartmentAmenity>> {
    const query_options = this.prisma.buildQuery(
      { take, skip, ...filters },
      "created",
      "created",
      (filters: ApartmentAmenitiesFiltersDto) => this.customFilters(filters),
    );
    const { items, total } =
      await this.prisma.findWithPagination<ApartmentAmenity>(
        this.prisma.apartmentAmenity,
        query_options,
        { amenity: true },
      ) as { items: ExtendedApartmentAmenity[]; total: number };
    return { items, total, skip, take };
  }
}
