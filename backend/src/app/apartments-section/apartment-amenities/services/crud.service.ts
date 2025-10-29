import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { ExtendedApartmentAmenity } from '@shared/src/types/apartments-section';
import { CreateApartmentAmenityDto } from '../dto';
import { Prisma } from '@shared/src/database';

@Injectable()
export class CrudService {
  constructor(private prisma: PrismaService) {}

  private async checkApartment(id?: string) {
    if (id && !(await this.prisma.apartment.findUnique({ where: { id } }))) {
      throw new NotFoundException('Apartment not found');
    }
  }

  private async checkAmenity(id?: string) {
    if (id && !(await this.prisma.amenity.findUnique({ where: { id } })))
      throw new NotFoundException('Amenity not found');
  }

  private async checkApartmentAmenity({
    apartment_id,
    amenity_id,
  }: {
    apartment_id?: string;
    amenity_id?: string;
  }) {
    if (!apartment_id || !amenity_id) return;
    const existing_apartment_amenity =
      await this.prisma.apartmentAmenity.findUnique({
        where: { apartment_id_amenity_id: { apartment_id, amenity_id } },
      });
    if (existing_apartment_amenity)
      throw new ConflictException('ApartmentAmenity already exists');
  }

  async create(
    data: CreateApartmentAmenityDto,
  ): Promise<ExtendedApartmentAmenity> {
    await Promise.all([
      this.checkApartment(data.apartment_id),
      this.checkAmenity(data.amenity_id),
      this.checkApartmentAmenity(data),
    ]);
    return await this.prisma.apartmentAmenity.create({
      data: data,
      include: { amenity: true },
    });
  }

  async findOne(where: Prisma.ApartmentAmenityWhereUniqueInput) {
    const apartment_amenity = await this.prisma.apartmentAmenity.findUnique({
      where,
      include: { amenity: true },
    });
    if (!apartment_amenity)
      throw new NotFoundException('ApartmentAmenity not found');
    return apartment_amenity;
  }

  async remove({
    apartment_id,
    amenity_id,
    id,
  }: {
    apartment_id?: string;
    amenity_id?: string;
    id?: string;
  }) {
    if (!id && !(amenity_id && apartment_id))
      throw new BadRequestException(
        'id | (apartment_id & amenity_id) required',
      );
    const apartment_amenity = await this.findOne({
      id,
      apartment_id,
      amenity_id,
    });
    return await this.prisma.apartmentAmenity.delete({
      where: { id: apartment_amenity.id },
    });
  }
}
