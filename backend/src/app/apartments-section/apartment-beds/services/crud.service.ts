import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { ApartmentBed } from '@shared/src/database';
import { CreateApartmentBedDto, UpdateApartmentBedDto } from '../dto';

@Injectable()
export class CrudService {
  constructor(private prisma: PrismaService) {}

  private async checkApartment(id?: string) {
    if (id && !(await this.prisma.apartment.findUnique({ where: { id } })))
      throw new NotFoundException('Apartment not found');
  }

  private async checkBedType(id?: string) {
    if (id && !(await this.prisma.bedType.findUnique({ where: { id } })))
      throw new NotFoundException('BedType not found');
  }

  private async checkApartmentBed({
    apartment_id,
    bed_type_id,
  }: {
    apartment_id?: string;
    bed_type_id?: string;
  }) {
    if (
      apartment_id &&
      bed_type_id &&
      (await this.prisma.apartmentBed.findUnique({
        where: { apartment_id_bed_type_id: { apartment_id, bed_type_id } },
      }))
    )
      throw new ConflictException('ApartmentBed already exists');
  }
  /**
   * Find a ApartmentBed by ID
   * @param id - Apartment bed id
   * @returns ApartmentBed object
   */
  async findOne(id: string): Promise<ApartmentBed> {
    const apartment_bed = await this.prisma.apartmentBed.findUnique({
      where: { id },
    });
    if (!apartment_bed) throw new NotFoundException('ApartmentBed not found');
    return apartment_bed;
  }
  /**
   * Create a new apartment bed
   * @param data - Apartment bed data
   * @returns New ApartmentBed data
   */
  async create(data: CreateApartmentBedDto) {
    await Promise.all([
      this.checkBedType(data.bed_type_id),
      this.checkApartment(data.apartment_id),
      this.checkApartmentBed(data),
    ]);
    return await this.prisma.apartmentBed.create({
      data,
      include: { bed_type: true },
    });
  }
  /**
   * Update a ApartmentBed by ID
   * @param id - Apartment bed id
   * @param data - ApartmentBed data to update
   * @returns Updated ApartmentBed data
   */
  async update({
    id,
    data,
  }: {
    id: string;
    data: UpdateApartmentBedDto;
  }): Promise<ApartmentBed> {
    await Promise.all([
      this.checkBedType(data.bed_type_id),
      this.checkApartment(data.apartment_id),
      this.checkApartmentBed(data),
    ]);
    return await this.prisma.apartmentBed.update({
      where: { id },
      data,
      include: { bed_type: true },
    });
  }
  /**
   * Remove a ApartmentBed by ID
   * @param id - ApartmentBed id
   * @returns ApartmentBed
   */
  async remove(id: string) {
    return !(await this.findOne(id)).is_excluded
      ? await this.update({ id, data: { is_excluded: true } })
      : this.prisma.apartmentBed.delete({ where: { id } });
  }
}
