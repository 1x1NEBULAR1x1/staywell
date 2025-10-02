import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/lib/prisma";
import { BookingVariant } from "@shared/src/database";
import { CreateBookingVariantDto, UpdateBookingVariantDto } from "../dto";

@Injectable()
export class CrudService {
  constructor(private prisma: PrismaService) { }

  private async checkApartment(id?: string) {
    const apartment = await this.prisma.apartment.findUnique({ where: { id } });
    if (id && !apartment) throw new NotFoundException("Apartment not found");
  }

  async create(data: CreateBookingVariantDto) {
    await this.checkApartment(data.apartment_id);
    return await this.prisma.bookingVariant.create({
      data,
      include: { apartment: true },
    });
  }

  async findOne(id: string) {
    const bookingVariant = await this.prisma.bookingVariant.findUnique({
      where: { id },
      include: { apartment: true },
    });
    if (!bookingVariant)
      throw new NotFoundException("Booking variant not found");
    return bookingVariant;
  }

  async update(id: string, data: UpdateBookingVariantDto) {
    await Promise.all([
      this.findOne(id),
      this.checkApartment(data.apartment_id),
    ]);
    return await this.prisma.bookingVariant.update({
      where: { id },
      data,
      include: { apartment: true },
    });
  }

  async remove(id: string): Promise<BookingVariant> {
    return !(await this.findOne(id)).is_excluded
      ? await this.update(id, { is_excluded: true })
      : await this.prisma.bookingVariant.delete({ where: { id } });
  }
}
