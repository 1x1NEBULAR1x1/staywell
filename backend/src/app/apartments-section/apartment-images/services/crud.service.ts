import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { CreateApartmentImageDto, UpdateApartmentImageDto } from '../dto';
import { FilesService } from 'src/lib/files';

@Injectable()
export class CrudService {
  constructor(
    private prisma: PrismaService,
    private filesService: FilesService,
  ) {}

  private async checkApartment(id: string) {
    if (!(await this.prisma.apartment.findUnique({ where: { id } })))
      throw new NotFoundException('Apartment not found');
  }
  /**
   * Create a new apartment image
   * @param data - The apartment image to create
   * @returns The created apartment image
   */
  async create({
    data,
    file,
  }: {
    data: CreateApartmentImageDto;
    file?: Express.Multer.File;
  }) {
    await this.checkApartment(data.apartment_id);
    const image = file
      ? this.filesService.saveImage({ file, dir_name: 'APARTMENT_IMAGES' })
      : data.image;

    if (!image) throw new BadRequestException('Image is required');
    return await this.prisma.apartmentImage.create({
      data: { ...data, image: image },
    });
  }
  /**
   * Find a apartment image by id
   * @param id - The apartment image id
   * @returns The apartment image
   */
  async findOne(id: string) {
    const image = await this.prisma.apartmentImage.findUnique({
      where: { id },
    });
    if (!image) throw new NotFoundException('Apartment image not found');
    return image;
  }
  /**
   * Update a apartment image
   * @param id - The apartment image id
   * @param updateApartmentImageDto - The apartment image to update
   * @returns The updated apartment image
   */
  async update({
    data,
    id,
    file,
  }: {
    id: string;
    data: UpdateApartmentImageDto;
    file?: Express.Multer.File;
  }) {
    await this.findOne(id);
    const image = file
      ? this.filesService.saveImage({ file, dir_name: 'APARTMENT_IMAGES' })
      : data.image;
    return await this.prisma.apartmentImage.update({
      where: { id },
      data: { ...data, image },
    });
  }
  /**
   * Remove a apartment image
   * @param id - The apartment image id
   * @returns The removed apartment image
   */
  async remove(id: string) {
    return !(await this.findOne(id)).is_excluded
      ? await this.update({ id, data: { is_excluded: true } })
      : await this.prisma.apartmentImage.delete({ where: { id } });
  }
}
