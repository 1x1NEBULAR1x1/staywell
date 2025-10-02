import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/lib/prisma";
import { CreateEventDto, UpdateEventDto } from "../dto";
import { FilesService } from "src/lib/files";

/**
 * Service for performing CRUD operations on events
 * Provides low-level database access for event management
 */
@Injectable()
export class CrudService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
  ) { }
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
      ? this.filesService.saveImage({ file, dir_name: "EVENTS" })
      : data.image;
    return this.prisma.event.create({ data: { ...data, image: image! } });
  }
  /**
   * Find a specific event by ID
   * @param id - Event's unique identifier
   * @returns Event with related images, guide, and booking events
   */
  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        images: true,
        guide: true,
      },
    });
    if (!event) throw new NotFoundException("Event not found");
    return event;
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
    await this.findOne(id);
    const image = file
      ? this.filesService.saveImage({ file, dir_name: "EVENTS" })
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
    return !(await this.findOne(id))
      ? await this.update({ id, data: { is_excluded: true } })
      : await this.prisma.event.delete({ where: { id } });
  }
}
