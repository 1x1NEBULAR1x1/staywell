import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { BedType } from '@shared/src/database';
import { CreateBedTypeDto, UpdateBedTypeDto } from '../dto';
import { FilesService } from 'src/lib/files';

@Injectable()
export class CrudService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
  ) {}

  private async checkCommonName({ id, name }: { name: string; id?: string }) {
    if (
      await this.prisma.bedType.findFirst({
        where: id ? { name, NOT: { id } } : { name },
      })
    )
      throw new ConflictException('bed type with same name exists');
  }
  /**
   * Create a new bed type
   * @param data - The bed type to create
   * @returns The created bed type
   */
  async create({
    data,
    file,
  }: {
    data: CreateBedTypeDto;
    file?: Express.Multer.File;
  }): Promise<BedType> {
    await this.checkCommonName({ name: data.name });
    const image = file
      ? this.filesService.saveImage({ file, dir_name: 'BED_TYPES' })
      : data.image;
    if (!image) throw new BadRequestException('Image is required');
    return await this.prisma.bedType.create({
      data: { ...data, image: image },
    });
  }
  /**
   * Find a bed type by ID
   * @param id - The ID of the bed type
   * @returns The found bed type
   */
  async findOne(id: string) {
    const bedType = await this.prisma.bedType.findUnique({
      where: { id },
      include: { apartment_beds: true },
    });
    if (!bedType) throw new NotFoundException('Bed type not found');
    return bedType;
  }
  /**
   * Update a bed type
   * @param id - The ID of the bed type
   * @param data - The bed type to update
   * @returns The updated bed type
   */
  async update({
    id,
    file,
    data,
  }: {
    id: string;
    data: UpdateBedTypeDto;
    file?: Express.Multer.File;
  }) {
    await Promise.all([
      this.findOne(id),
      data.name && this.checkCommonName({ id, name: data.name }),
    ]);
    const image = file
      ? this.filesService.saveImage({ file, dir_name: 'BED_TYPES' })
      : data.image;
    return await this.prisma.bedType.update({
      where: { id },
      data: { ...data, image },
    });
  }
  /**
   * Remove a bed type
   * @param id - The ID of the bed type
   * @returns The removed bed type
   */
  async remove(id: string) {
    const bed_type = await this.findOne(id);
    if (bed_type.apartment_beds.length > 0)
      throw new ConflictException(
        'Cannot delete bed type that is in use by apartments',
      );
    return !bed_type.is_excluded
      ? await this.prisma.bedType.update({
          where: { id },
          data: { is_excluded: true },
        })
      : await this.prisma.bedType.delete({ where: { id } });
  }
}
