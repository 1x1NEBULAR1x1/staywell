import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { Prisma, Apartment, User, Role } from '@shared/src/database';
import { ApartmentsFiltersDto } from '../dto';
import { ApartmentWithPrice, ExtendedApartment } from '@shared/src/types/apartments-section';
import { BaseListResult } from '@shared/src/common/base-types/base-list-result.interface';
import { SAFE_USER_SELECT, USER_WITHOUT_PASSWORD_SELECT } from '@shared/src';

@Injectable()
export class ListService {
  constructor(private prisma: PrismaService) { }

  customFilters = (options: ApartmentsFiltersDto) => {
    const {
      min_price,
      max_price,
      min_capacity,
      max_capacity,
      is_available,
      is_smoking,
      is_pet_friendly,
      type,
      guests,
      check_availability,
      start_date,
      end_date,
      search,
    } = options;
    const filters: Prisma.ApartmentWhereInput = {};
    if (min_price)
      filters.booking_variants = { some: { price: { gte: min_price } } };
    if (max_price)
      filters.booking_variants = { some: { price: { lte: max_price } } };
    if (is_available !== undefined) filters.is_available = is_available;
    if (is_smoking !== undefined) filters.is_smoking = is_smoking;
    if (is_pet_friendly !== undefined)
      filters.is_pet_friendly = is_pet_friendly;
    if (type) filters.type = type;
    if (min_capacity || max_capacity || guests) {
      if (min_capacity) filters.max_capacity = { gte: min_capacity };
      if (max_capacity) filters.max_capacity = { lte: max_capacity };
      if (guests) filters.max_capacity = { gte: guests };
    }
    if (check_availability && start_date && end_date) {
      filters.AND = [
        { booking_variants: { some: { is_available: true } } },
        {
          booking_variants: {
            none: {
              bookings: {
                some: { start: { gte: start_date }, end: { lte: end_date } },
              },
            },
          },
        },
        {
          reservations: {
            none: { start: { gte: start_date }, end: { lte: end_date } },
          },
        },
      ];
    }
    if (search)
      filters.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    return filters;
  };
  /**
   * Finds all apartments based on filter criteria
   * @param filters Filter and pagination parameters
   * @returns Filtered list of apartments with pagination metadata
   */
  async list({
    filters,
    user,
  }: {
    filters: ApartmentsFiltersDto;
    user?: User;
  }): Promise<BaseListResult<ApartmentWithPrice>> {
    const query_options = this.prisma.buildQuery<Apartment>({
      filters,
      customFilters: this.customFilters,
    });

    const { items, total } = await this.prisma.findWithPagination<ExtendedApartment>({
      model: this.prisma.apartment,
      query_options,
      include: {
        images: true,
        reviews: { include: { user: { select: SAFE_USER_SELECT } } },
        apartment_beds: { include: { bed_type: true } },
        apartment_amenities: { include: { amenity: true } },
        // Admins can see reservations
        ...(user?.role === Role.ADMIN
          ? {
            reservations: {
              include: { user: { select: USER_WITHOUT_PASSWORD_SELECT } }
            }
          } : {}
        ),
        // See only available booking variants for the current filters
        booking_variants: {
          // Admins can see bookings
          ...(user?.role === Role.ADMIN
            ? {
              bookings: {
                include: {
                  user: { select: USER_WITHOUT_PASSWORD_SELECT },
                  transaction: true,
                  booking_additional_options: { include: { additional_option: true } },
                  booking_variant: true,
                }
              }
            } : {
              where: {
                is_available: true,
                ...(filters.min_price !== undefined && {
                  price: { gte: filters.min_price },
                }),
                ...(filters.max_price !== undefined && {
                  price: { lte: filters.max_price },
                }),
              },
            }
          ),

        },
      },
    });

    const apartments_with_price: ApartmentWithPrice[] =
      items.map((apartment) => {
        if (
          !apartment.booking_variants ||
          apartment.booking_variants.length === 0
        )
          return { ...apartment, cheapest_variant: null };
        let valid_variants = apartment.booking_variants;
        if (filters.guests)
          valid_variants = valid_variants.filter(
            (v) => v.capacity >= (filters.guests || 0),
          );
        if (valid_variants.length === 0)
          return { ...apartment, cheapest_variant: null };
        const cheapest_variant = valid_variants.reduce(
          (cheapest, current) =>
            current.price < cheapest.price ? current : cheapest,
          valid_variants[0],
        );
        return {
          ...apartment,
          cheapest_variant: {
            id: cheapest_variant.id,
            price: cheapest_variant.price,
          },
        };
      });

    let filtered_apartments = apartments_with_price;
    if (filters.min_price !== undefined || filters.max_price !== undefined) {
      filtered_apartments = filtered_apartments.filter(
        (apartment) => apartment.cheapest_variant !== null,
      );
    }
    const { take, skip } = query_options;
    return {
      items: filtered_apartments,
      total,
      skip,
      take,
    };
  }
}
