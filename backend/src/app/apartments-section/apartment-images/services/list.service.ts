import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/lib/prisma";
import { Prisma, ApartmentImage } from "@shared/src/database";
import { ApartmentImagesFiltersDto } from "../dto";
import { BaseListResult } from "@shared/src/common/base-types/base-list-result.interface";
@Injectable()
export class ListService {
  constructor(private prisma: PrismaService) { }

  customFilters(options: ApartmentImagesFiltersDto) {
    const { apartment_id, description, search, name } = options;
    const filters: Prisma.ApartmentImageWhereInput = {};
    if (apartment_id) filters.apartment_id = apartment_id;
    if (name) filters.name = { contains: name, mode: "insensitive" };
    if (description) filters.description = { contains: description, mode: "insensitive" };
    if (search) {
      filters.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    return filters;
  }
  /**
   * Search for apartment images by filter params
   * @param apartment_id Apartment ID to filter by
   * @param filters Filter params and pagination
   * @returns Filtered list of apartment images
   */
  async findAll(
    { take, skip, ...filters }: ApartmentImagesFiltersDto,
  ): Promise<BaseListResult<ApartmentImage>> {
    const query_options = this.prisma.buildQuery(
      { ...filters, take, skip },
      "created",
      "created",
      (filters: ApartmentImagesFiltersDto) => this.customFilters(filters),
    );
    const { items, total } =
      await this.prisma.findWithPagination<ApartmentImage>(
        this.prisma.apartmentImage,
        query_options,
        { apartment: true },
      );
    return { items, total, skip, take };
  }
}
