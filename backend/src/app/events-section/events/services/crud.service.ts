import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { CreateEventDto, UpdateEventDto } from '../dto';
import { FilesService } from 'src/lib/files';
import {
  EXTENDED_EVENT_INCLUDE,
  ExtendedEvent,
} from '@shared/src/types/events-section/extended.types';
import { Prisma } from '@shared/src/database';

/**
 * Service for performing CRUD operations on events
 * Provides low-level database access for event management
 */
@Injectable()
export class CrudService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
  ) {}
  /**
   * Create a new event in the database
   * @param createEventDto - Data transfer object with event properties
   * @returns The created event with all fields
   */
  async create({
    data,
    file,
  }: {
    data: CreateEventDto;
    file?: Express.Multer.File;
  }) {
    const image = file
      ? this.filesService.saveImage({ file, dir_name: 'EVENTS' })
      : data.image;
    return this.prisma.event.create({ data: { ...data, image: image! } });
  }
  /**
   * Find a specific event by ID
   * @param where - Event's unique identifier
   * @returns Event with related images, guide, and booking events
   */
  async find(where: Prisma.EventWhereUniqueInput): Promise<ExtendedEvent> {
    const event = await this.prisma.event.findUnique({
      where,
      include: EXTENDED_EVENT_INCLUDE,
    });
    if (!event) throw new NotFoundException('Event not found');
    return {
      ...event,
      available_spots: Math.max(
        0,
        event.capacity -
          event.booking_events.reduce(
            (total, booking) => total + booking.number_of_people,
            0,
          ),
      ),
    };
  }
  /**
   * Update an existing event
   * @param id - Event's unique identifier
   * @param updateEventDto - Partial data for updating the event
   * @returns The updated event
   */
  async update({
    id,
    data,
    file,
  }: {
    id: string;
    data: UpdateEventDto;
    file?: Express.Multer.File;
  }) {
    await this.find({ id });
    const image = file
      ? this.filesService.saveImage({ file, dir_name: 'EVENTS' })
      : data.image;
    return this.prisma.event.update({
      where: { id },
      data: { ...data, image },
    });
  }
  /**
   * Remove an event from the database
   * @param id - Event's unique identifier
   * @returns The deleted event
   */
  async remove(id: string) {
    return !(await this.find({ id })).is_excluded
      ? await this.update({ id, data: { is_excluded: true } })
      : await this.prisma.event.delete({ where: { id } });
  }
}
