import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "src/lib/prisma";
import {
  CreateAmenityDto,
  UpdateAmenityDto,
} from "../dto";
import { ExtendedAmenity } from "@shared/src/types/apartments-section";
import { FilesService } from "src/lib/files";

@Injectable()
export class CrudService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
  ) { }

  private async checkCommonName({ name, id }: { name?: string; id?: string }) {
    if (name && (
      await this.prisma.amenity.findFirst({
        where: id ? { name, NOT: { id } } : { name },
      })
    )) throw new ConflictException("Amenity with this name already exists");
  }
  /**
   * Create a new amenity
   * @param createAmenityDto - The amenity to create
   * @returns The created amenity
   */
  async create({
    file,
    data,
  }: {
    data: CreateAmenityDto;
    file?: Express.Multer.File;
  }): Promise<ExtendedAmenity> {
    if (await this.prisma.amenity.findFirst({ where: { name: data.name } }))
      throw new ConflictException("Amenity with this name already exists");
    const image = file ? this.filesService.saveImage({ file, dir_name: "AMENITIES" }) : data.image;
    return await this.prisma.amenity.create({
      data: { ...data, image: image! },
      include: { apartment_amenities: true },
    });
  }
  /**
   * Find an amenity by ID
   * @param id - The ID of the amenity
   * @returns The found amenity
   */
  async findOne(id: string) {
    const amenity = await this.prisma.amenity.findUnique({
      where: { id },
      include: { apartment_amenities: true },
    });
    if (!amenity) throw new NotFoundException("Amenity not found");
    return amenity;
  }
  /**
   * Update an amenity
   * @param id - The ID of the amenity
   * @param updateAmenityDto - The amenity to update
   * @returns The updated amenity
   */
  async update({
    id,
    data,
    file,
  }: {
    id: string;
    data: UpdateAmenityDto;
    file?: Express.Multer.File;
  }): Promise<ExtendedAmenity> {
    await this.checkCommonName({ id, name: data.name });
    const image = file ? this.filesService.saveImage({ file, dir_name: "AMENITIES" }) : data.image;
    return await this.prisma.amenity.update({
      where: { id },
      data: { ...data, image },
      include: { apartment_amenities: true },
    });
  }
  /**
   * Remove an amenity
   * @param id - The ID of the amenity
   * @returns The removed amenity
   */
  async remove(id: string) {
    const amenity = await this.findOne(id);
    if (amenity.apartment_amenities.length > 0)
      throw new ConflictException(
        "Cannot delete amenity that is in use by apartments",
      );
    return !amenity.is_excluded
      ? await this.update({ id, data: { is_excluded: true } })
      : await this.prisma.amenity.delete({ where: { id } });
  }
}
