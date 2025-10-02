import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/lib/prisma";
import { ApartmentAvailabilityResult } from "@shared/src/types/apartments-section";
import { CheckService } from "./check.service";

@Injectable()
export class AvailabilityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly checkService: CheckService,
  ) { }

  /**
   * Checks if a specific apartment is available for booking during the given date range
   * @param apartmentId Apartment ID to check
   * @param startDate Start date of the period
   * @param endDate End date of the period
   * @returns Availability status and related information
   */
  async checkApartmentAvailability({
    id,
    start_date,
    end_date,
  }: {
    id: string;
    start_date: Date;
    end_date: Date;
  }): Promise<ApartmentAvailabilityResult> {
    const apartment = await this.checkService.checkNotFound({ id });

    if (!apartment.is_available) {
      return {
        is_available: false,
        apartment,
        reason: "Apartment is not active",
      };
    }
    if (!apartment.is_excluded) {
      return {
        is_available: false,
        apartment,
        reason: "Apartment is excluded",
      };
    }
    const overlapping_reservations = await this.prisma.reservation.findMany({
      where: {
        apartment_id: apartment.id,
        OR: [
          {
            start: { lte: end_date },
            end: { gte: start_date },
          },
        ],
      },
    });
    if (overlapping_reservations.length > 0) {
      return {
        is_available: false,
        apartment,
        reason: "Apartment has overlapping reservations",
        reservations: overlapping_reservations,
      };
    }
    const overlapping_bookings = await this.prisma.booking.findMany({
      where: {
        booking_variant: {
          apartment_id: apartment.id,
        },
        OR: [
          {
            start: { lte: end_date },
            end: { gte: start_date },
          },
        ],
      },
    });
    if (overlapping_bookings.length > 0) {
      return {
        is_available: false,
        apartment,
        reason: "Apartment has overlapping bookings",
        bookings: overlapping_bookings,
      };
    }
    return {
      is_available: true,
      apartment,
    };
  }
}
