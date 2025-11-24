import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { CheckService } from './check.service';

export interface DatesConfigResult {
  occupied_dates: string[]; // Array of date strings in YYYY-MM-DD format
}

@Injectable()
export class DatesConfigService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly checkService: CheckService,
  ) {}

  /**
   * Gets configuration of occupied dates for a specific apartment in a given month
   * @param apartmentId Apartment ID to check
   * @param year Year to check
   * @param month Month (1-12) to check
   * @returns Configuration with occupied dates
   */
  async getDatesConfig({
    id,
    year,
    month,
  }: {
    id: string;
    year: number;
    month: number;
  }): Promise<DatesConfigResult> {
    // Validate apartment exists
    await this.checkService.checkNotFound({ id });

    // Calculate start and end of the month
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0); // Last day of the month

    // Find all reservations that overlap with this month
    const reservations = await this.prisma.reservation.findMany({
      where: {
        apartment_id: id,
        OR: [
          {
            start: { lte: endOfMonth },
            end: { gte: startOfMonth },
          },
        ],
      },
    });

    // Find all bookings that overlap with this month
    const bookings = await this.prisma.booking.findMany({
      where: {
        booking_variant: {
          apartment_id: id,
        },
        OR: [
          {
            start: { lte: endOfMonth },
            end: { gte: startOfMonth },
          },
        ],
      },
    });

    // Collect all occupied dates
    const occupiedDates = new Set<string>();

    // Add dates from reservations
    reservations.forEach((reservation) => {
      this.addDateRangeToSet(occupiedDates, reservation.start, reservation.end);
    });

    // Add dates from bookings
    bookings.forEach((booking) => {
      this.addDateRangeToSet(occupiedDates, booking.start, booking.end);
    });

    return {
      occupied_dates: Array.from(occupiedDates).sort(),
    };
  }

  /**
   * Helper method to add a date range to the occupied dates set
   */
  private addDateRangeToSet(dateSet: Set<string>, start: Date, end: Date): void {
    const current = new Date(start);
    const endDate = new Date(end);

    while (current <= endDate) {
      const dateString = current.toISOString().split('T')[0]; // YYYY-MM-DD format
      dateSet.add(dateString);
      current.setDate(current.getDate() + 1);
    }
  }
}



