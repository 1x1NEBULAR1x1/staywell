import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/lib/prisma";
import {
  AvailableApartment,
} from "@shared/src/types/apartments-section";
import { ApartmentsFiltersDto } from "../dto";
import { Apartment, BookingVariant, Prisma, Review } from "@shared/src/database";
import { BaseListResult } from "@shared/src/common/base-types/base-list-result.interface";

@Injectable()
export class AvailableListService {
  constructor(private prisma: PrismaService) { }

  /**
   * Finds all available apartments for a specific date range with filtering
   * @param filters Search parameters including date range, filtering and sorting options
   * @returns List of available apartments with pagination metadata
   */
  async findAvailableApartments(
    filters: ApartmentsFiltersDto,
  ): Promise<BaseListResult<AvailableApartment>> {
    const {
      start_date,
      end_date,
      max_capacity,
      is_smoking,
      is_pet_friendly,
      is_available,
      min_price,
      type,
      guests,
      max_price,
      skip,
      take,
    } = filters;
    const where: Prisma.ApartmentWhereInput = {
      is_available: is_available !== undefined ? is_available : true,
      is_smoking: is_smoking !== undefined ? is_smoking : true,
      is_pet_friendly: is_pet_friendly !== undefined ? is_pet_friendly : true,
      booking_variants: {
        some: {
          price: { gte: min_price, lte: max_price },
        },
      },
    };
    if (max_capacity) where.max_capacity = { gte: max_capacity };
    if (type) where.type = type;
    if (guests && guests > 0) where.max_capacity = { gte: guests };
    // Find all booking variants that match the criteria
    const booking_variants = await this.prisma.bookingVariant.findMany({
      where: {
        apartment: { ...where },
        is_available: true,
        ...(min_price !== undefined && { price: { gte: min_price } }),
        ...(max_price !== undefined && { price: { lte: max_price } }),
      },
      include: {
        apartment: {
          include: {
            images: true,
            apartment_beds: { include: { bed_type: true } },
            apartment_amenities: { include: { amenity: true } },
            reviews: true,
          },
        },
      },
      skip: skip || 0,
      take: take || 10,
    });

    // Group booking variants by apartment and find the cheapest price
    const apartment_map = new Map<
      string,
      {
        apartment: Apartment;
        variants: BookingVariant[];
        cheapest_price: number;
      }
    >();

    booking_variants.forEach((variant) => {
      if (guests && variant.capacity < guests) {
        return;
      }

      if (
        (min_price !== undefined && variant.price < min_price) ||
        (max_price !== undefined && variant.price > max_price)
      ) {
        return;
      }

      if (!apartment_map.has(variant.apartment_id)) {
        apartment_map.set(variant.apartment_id, {
          apartment: variant.apartment,
          variants: [variant],
          cheapest_price: variant.price,
        });
      } else {
        const apartment_data = apartment_map.get(variant.apartment_id)!;
        apartment_data.variants.push(variant);

        if (variant.price < apartment_data.cheapest_price) {
          apartment_data.cheapest_price = variant.price;
        }
      }
    });

    // Find apartments that are not reserved or booked for the selected dates
    const reservations = await this.prisma.reservation.findMany({
      where: {
        OR: [
          {
            start: { lte: end_date },
            end: { gte: start_date },
          },
        ],
      },
    });

    const bookings = await this.prisma.booking.findMany({
      where: {
        OR: [
          {
            start: { lte: end_date },
            end: { gte: start_date },
          },
        ],
      },
      include: {
        booking_variant: true,
      },
    });

    const reserved_apartment_ids = new Set(
      reservations.map((r) => r.apartment_id),
    );
    const booked_apartment_ids = new Set(
      bookings.map((b) => b.booking_variant.apartment_id),
    );

    const available_apartments = Array.from(apartment_map.values()).filter(
      (apartment_data) => {
        return (
          !reserved_apartment_ids.has(apartment_data.apartment.id) &&
          !booked_apartment_ids.has(apartment_data.apartment.id)
        );
      },
    );

    // Transform results to GetApartmentType format
    return {
      items: available_apartments.map((apartment) => {
        // Find the maximum capacity among all booking variants
        const maxCapacityFromVariants =
          apartment.variants.length > 0
            ? Math.max(...apartment.variants.map((v) => v.capacity))
            : 0;
        // Use the greater value between apartment's max_capacity and variants' capacity
        const effective_capacity = Math.max(
          maxCapacityFromVariants,
          apartment.apartment.max_capacity || 0,
        );
        // Calculate average rating
        const rating =
          Array.isArray(apartment.apartment["reviews"]) &&
            apartment.apartment["reviews"].length > 0
            ? apartment.apartment["reviews"].reduce(
              (acc: number, review: Review) => acc + review.rating,
              0,
            ) / apartment.apartment["reviews"].length
            : 0;
        return {
          ...apartment.apartment,
          price: apartment.cheapest_price,
          capacity: effective_capacity,
          rating,
        };
      }),
      total: available_apartments.length,
      skip: skip || 0,
      take: take || 10,
    };
  }
}
