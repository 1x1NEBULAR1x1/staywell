import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { BookingVariant, Prisma } from '@shared/src/database';
import { CreateBookingVariantDto, UpdateBookingVariantDto } from '../dto';

@Injectable()
export class CrudService {
  constructor(private prisma: PrismaService) {}

  private async checkApartment(id?: string) {
    const apartment = await this.prisma.apartment.findUnique({ where: { id } });
    if (id && !apartment) throw new NotFoundException('Apartment not found');
  }

  async create(data: CreateBookingVariantDto) {
    await this.checkApartment(data.apartment_id);
    return await this.prisma.bookingVariant.create({
      data,
      include: { apartment: true },
    });
  }

  async find({ where }: { where: Prisma.BookingVariantWhereUniqueInput }) {
    const bookingVariant = await this.prisma.bookingVariant.findUnique({
      where,
      include: { apartment: true },
    });
    if (!bookingVariant)
      throw new NotFoundException('Booking variant not found');
    return bookingVariant;
  }

  async update({
    where,
    data,
  }: {
    where: Prisma.BookingVariantWhereUniqueInput;
    data: UpdateBookingVariantDto;
  }) {
    await this.find({ where });
    return await this.prisma.bookingVariant.update({
      where,
      data,
      include: { apartment: true },
    });
  }

  async remove({
    where,
  }: {
    where: Prisma.BookingVariantWhereUniqueInput;
  }): Promise<BookingVariant> {
    return !(await this.find({ where })).is_excluded
      ? await this.update({ where, data: { is_excluded: true } })
      : await this.prisma.bookingVariant.delete({ where });
  }
}
