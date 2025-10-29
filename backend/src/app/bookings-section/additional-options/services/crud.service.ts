import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { AdditionalOption, Prisma } from '@shared/src/database';
import { CreateAdditionalOptionDto, UpdateAdditionalOptionDto } from '../dto';
import { FilesService } from 'src/lib/files';

@Injectable()
export class CrudService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
  ) {}

  /**
   * Creates a new additional option
   * @param createAdditionalOptiondata Option creation data
   * @returns Created additional option
   */
  async create({
    data,
    file,
  }: {
    data: CreateAdditionalOptionDto;
    file?: Express.Multer.File;
  }): Promise<AdditionalOption> {
    if (await this.findOne({ name: data.name }))
      throw new ConflictException(
        'Additional option with this name already exists',
      );
    const image = file
      ? this.filesService.saveImage({ file, dir_name: 'ADDITIONAL_OPTIONS' })
      : data.image;
    return await this.prisma.additionalOption.create({
      data: { ...data, image: image! },
    });
  }
  /**
   * Finds an additional option by ID
   * @param id Option ID
   * @returns Additional option
   */
  async findOne(
    where: Prisma.AdditionalOptionWhereUniqueInput,
  ): Promise<AdditionalOption> {
    const option = await this.prisma.additionalOption.findUnique({ where });
    if (!option) throw new NotFoundException('Additional option not found');
    return option;
  }
  /**
   * Updates an additional option
   * @param id Option ID
   * @param updateAdditionalOptiondata Update option data
   * @returns Updated additional option
   */
  async update({
    id,
    data,
    file,
  }: {
    id: string;
    data: UpdateAdditionalOptionDto;
    file?: Express.Multer.File;
  }): Promise<AdditionalOption> {
    await this.findOne({ id });
    if (await this.findOne({ name: data.name }))
      throw new ConflictException(
        'Additional option with this name already exists',
      );
    const image = file
      ? this.filesService.saveImage({ file, dir_name: 'ADDITIONAL_OPTIONS' })
      : data.image;
    return await this.prisma.additionalOption.update({
      where: { id },
      data: { ...data, image },
    });
  }
  /**
   * Deletes an additional option
   * @param id Option ID
   * @returns Success message
   */
  async remove(id: string): Promise<AdditionalOption> {
    const option = await this.findOne({ id });

    if (
      await this.prisma.bookingAdditionalOption.findFirst({
        where: { option_id: id },
      })
    )
      throw new ConflictException(
        'Cannot delete option that is used in bookings',
      );

    return option.is_excluded
      ? await this.update({ id, data: { is_excluded: true } })
      : await this.prisma.additionalOption.delete({ where: { id } });
  }
}
