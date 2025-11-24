import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';

export interface AvailableEvent {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  capacity: number;
  available_spots: number;
  start: Date;
  end: Date;
  guide?: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

export interface EventsConfigResult {
  available_events: AvailableEvent[];
}

@Injectable()
export class EventsConfigService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Gets available events for a specific booking date range
   * @param startDate Start date of the booking period
   * @param endDate End date of the booking period
   * @returns Configuration with available events
   */
  async getAvailableEvents({
    start_date,
    end_date,
  }: {
    start_date: Date;
    end_date: Date;
  }): Promise<EventsConfigResult> {
    // Find events that overlap with the booking period
    const events = await this.prisma.event.findMany({
      where: {
        is_excluded: false,
        OR: [
          {
            // Event starts during booking period
            start: { gte: start_date, lte: end_date },
          },
          {
            // Event ends during booking period
            end: { gte: start_date, lte: end_date },
          },
          {
            // Event spans the entire booking period
            AND: [
              { start: { lte: start_date } },
              { end: { gte: end_date } },
            ],
          },
        ],
      },
      include: {
        guide: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
        booking_events: {
          select: {
            number_of_people: true,
          },
        },
      },
      orderBy: {
        start: 'asc',
      },
    });

    // Calculate available spots for each event
    const availableEvents = events.map((event) => {
      const bookedSpots = event.booking_events.reduce(
        (total, booking) => total + booking.number_of_people,
        0,
      );

      const availableSpots = event.capacity - bookedSpots;

      return {
        id: event.id,
        name: event.name,
        image: event.image,
        description: event.description,
        price: event.price,
        capacity: event.capacity,
        available_spots: Math.max(0, availableSpots), // Ensure non-negative
        start: event.start,
        end: event.end,
        guide: event.guide || undefined,
      };
    }).filter(event => event.available_spots > 0); // Only return events with available spots

    return {
      available_events: availableEvents,
    };
  }
}



