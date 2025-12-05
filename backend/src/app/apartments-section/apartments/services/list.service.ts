import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { Prisma, Apartment, User, Role } from '@shared/src/database';
import { ApartmentsFiltersDto } from '../dto';
import {
  ApartmentWithPrice,
  ExtendedApartment,
} from '@shared/src/types/apartments-section';
import { BaseListResult } from '@shared/src/common/base-types/base-list-result.interface';
import { SAFE_USER_SELECT, USER_WITHOUT_PASSWORD_SELECT } from '@shared/src';

@Injectable()
export class ListService {
  constructor(private prisma: PrismaService) {}

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
      start_date,
      end_date,
      search,
    } = options;
    const filters: Prisma.ApartmentWhereInput = {};
    if (min_price)
      filters.booking_variants = { some: { price: { gte: min_price } } };
    if (max_price)
      filters.booking_variants = { some: { price: { lte: max_price } } };
    // When is_available is false, show all apartments regardless of their is_available status
    if (is_available !== undefined && is_available !== false) {
      filters.is_available = is_available;
    }
    // For is_available: false, don't filter by is_available in database
    if (is_smoking !== undefined) filters.is_smoking = is_smoking;
    if (is_pet_friendly !== undefined)
      filters.is_pet_friendly = is_pet_friendly;
    if (type) filters.type = type;
    // Apply capacity filters only when showing suitable apartments (is_available: true)
    if (is_available !== false) {
      if (min_capacity) filters.max_capacity = { gte: min_capacity };
      if (max_capacity) filters.max_capacity = { lte: max_capacity };
      if (guests) filters.max_capacity = { gte: guests };
    }
    if (start_date && end_date && is_available !== false) {
      filters.AND = [
        {
          booking_variants: {
            some: {
              is_available: true,
              bookings: {
                none: {
                  start: { lte: end_date },
                  end: { gte: start_date },
                },
              },
            },
          },
        },
        {
          reservations: {
            none: {
              start: { lte: end_date },
              end: { gte: start_date },
            },
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
    // Remove start_date and end_date from filters so buildQuery doesn't apply automatic date filtering
    const { start_date, end_date, ...filters_without_dates } = filters;

    const query_options = this.prisma.buildQuery<Apartment>({
      filters: filters_without_dates,
      customFilters: (options) =>
        this.customFilters({ ...options, start_date, end_date }),
    });
    const { items, total } =
      await this.prisma.findWithPagination<ExtendedApartment>({
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
                  include: { user: { select: USER_WITHOUT_PASSWORD_SELECT } },
                },
              }
            : {}),
          // See only available booking variants for the current filters
          booking_variants: {
            // Admins can see bookings
            ...(user?.role === Role.ADMIN
              ? {
                  bookings: {
                    include: {
                      user: { select: USER_WITHOUT_PASSWORD_SELECT },
                      transaction: true,
                      booking_additional_options: {
                        include: { additional_option: true },
                      },
                      booking_variant: true,
                    },
                  },
                }
              : {
                  where: {
                    is_available: true,
                    ...(filters.min_price !== undefined && {
                      price: { gte: filters.min_price },
                    }),
                    ...(filters.max_price !== undefined && {
                      price: { lte: filters.max_price },
                    }),
                  },
                }),
          },
        },
      });

    const apartments_with_price: (ApartmentWithPrice | null)[] = items.map(
      (apartment) => {
        if (
          !apartment.booking_variants ||
          apartment.booking_variants.length === 0
        ) {
          // If no booking variants at all
          return filters.is_available === false
            ? { ...apartment, cheapest_variant: null }
            : null;
        }

        let valid_variants = apartment.booking_variants;

        // Filter variants by capacity requirements
        const min_capacity_required =
          filters.min_capacity || filters.guests || 0;
        const max_capacity_required = filters.max_capacity;

        if (min_capacity_required > 0) {
          valid_variants = valid_variants.filter(
            (v) => v.capacity >= min_capacity_required,
          );
        }
        if (max_capacity_required && max_capacity_required > 0) {
          valid_variants = valid_variants.filter(
            (v) => v.capacity <= max_capacity_required,
          );
        }

        if (valid_variants.length === 0) {
          // No suitable variants after filtering
          return filters.is_available === false
            ? { ...apartment, cheapest_variant: null }
            : null;
        }

        // Find cheapest variant from filtered variants
        const cheapest_variant = valid_variants.reduce(
          (cheapest, current) =>
            current.price < cheapest.price ? current : cheapest,
          valid_variants[0],
        );

        // Has suitable variants
        return {
          ...apartment,
          cheapest_variant: {
            id: cheapest_variant.id,
            price: cheapest_variant.price,
          },
        };
      },
    );

    // Filter out null results
    const filtered_apartments = apartments_with_price.filter(
      (apartment): apartment is ApartmentWithPrice => apartment !== null,
    );
    const { take, skip } = query_options;
    return {
      items: filtered_apartments,
      total,
      skip,
      take,
    };
  }
}
