import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/lib/prisma";
import { FilesService } from "src/lib/files";
import { CreateEventImageDto, UpdateEventImageDto } from "../dto";

/**
 * Service for performing CRUD operations on event images
 */
@Injectable()
export class CrudService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
  ) { }

  /**
   * Create a new event image
   * @param createEventImageDto - DTO with event image properties
   * @returns The created event image
   */
  async create({
    data,
    file,
  }: {
    data: CreateEventImageDto;
    file?: Express.Multer.File;
  }) {
    const image = file
      ? this.filesService.saveImage({ file, dir_name: "EVENT_IMAGES" })
      : data.image;
    return this.prisma.eventImage.create({ data: { ...data, image } });
  }
  /**
   * Find a specific event image by ID
   * @param id - Event image ID
   * @returns Event image with related event
   */
  async findOne(id: string) {
    const eventImage = await this.prisma.eventImage.findUnique({ where: { id } });
    if (!eventImage) throw new NotFoundException("Event image not found");
    return eventImage;
  }
  /**
   * Update an existing event image
   * @param id - Event image ID
   * @param updateEventImageDto - DTO with updated event image properties
   * @returns The updated event image
   */
  async update({
    id,
    data,
    file,
  }: {
    id: string;
    data: UpdateEventImageDto;
    file?: Express.Multer.File;
  }) {
    await this.findOne(id);
    const image = file
      ? this.filesService.saveImage({ file, dir_name: "EVENT_IMAGES" })
      : data.image;
    return this.prisma.eventImage.update({
      where: { id },
      data: { ...data, image },
    });
  }
  /**
   * Remove an event image
   * @param id - Event image ID
   * @returns The deleted event image
   */
  async remove(id: string) {
    return !(await this.findOne(id)).is_excluded
      ? await this.update({ id, data: { is_excluded: false } })
      : await this.prisma.eventImage.delete({ where: { id } });
  }
}
