import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { Apartment, Prisma, Role, User } from '@shared/src/database';
import { CreateApartmentDto, UpdateApartmentDto } from '../dto';
import { FilesService } from 'src/lib/files';
import { CheckService } from './check.service';
import { AvailabilityService } from './availability.service';
import { EXTENDED_APARTMENT_AMENITY_INCLUDE, EXTENDED_APARTMENT_BED_INCLUDE, EXTENDED_REVIEW_INCLUDE, ExtendedApartment, ExtendedReview } from '@shared/src/types/apartments-section';
import { buildApartmentInclude } from './utils';
import { EXTENDED_BOOKING_INCLUDE, EXTENDED_RESERVATION_INCLUDE } from '@shared/src/types/bookings-section';

@Injectable()
export class CrudService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
    private readonly checkService: CheckService,
    private readonly availabilityService: AvailabilityService,
  ) { }
  /**
   * Creates a new apartment
   * @param createApartmentDto Apartment creation data
   * @returns Created apartment entity
   */
  async create({
    data,
    file,
  }: {
    data: CreateApartmentDto;
    file?: Express.Multer.File;
  }): Promise<Apartment> {
    await this.checkService.checkConflict(data.number);
    const image = file
      ? this.filesService.saveImage({ file, dir_name: 'APARTMENTS' })
      : data.image;
    const apartment = await this.prisma.apartment.create({
      data: { ...data, image },
    });
    return await this.findOne({ where: { id: apartment.id } });
  }
  /**
   * Retrieves a apartment by its ID with detailed information
   * @param id Apartment ID
   * @returns Extended apartment information with related data
   */
  async findOne({ where, user }: {
    where: Prisma.ApartmentWhereUniqueInput,
    user?: User,
  }): Promise<ExtendedApartment> {
    const apartment = await this.prisma.apartment.findUnique({
      where,
      include: {
        images: true,
        apartment_beds: { include: EXTENDED_APARTMENT_BED_INCLUDE },
        apartment_amenities: { include: EXTENDED_APARTMENT_AMENITY_INCLUDE },
      }
    });
    if (!apartment) throw new NotFoundException('Apartment not found');
    // Find the minimum price from booking variants
    const booking_variants = await this.prisma.bookingVariant.findMany({
      where: { apartment_id: apartment.id },
    });
    const price =
      booking_variants.length > 0
        ? Math.min(
          ...booking_variants.map((v) =>
            v.is_available ? v.price : Infinity,
          ),
        )
        : 0;
    // Find the maximum capacity from booking variants
    const capacity_from_variants =
      booking_variants.length > 0
        ? Math.max(...booking_variants.map((v) => v.capacity))
        : 0;
    // Use either capacity from variants or max_capacity from apartment
    const capacity = Math.max(
      capacity_from_variants,
      apartment.max_capacity || 0,
    );
    // Find reservations and bookings for the apartment if the user is an admin
    const reservations = user?.role === Role.ADMIN ? await this.prisma.reservation.findMany({
      where: { apartment_id: apartment.id },
      include: EXTENDED_RESERVATION_INCLUDE,
    }) : [];
    const bookings = user?.role === Role.ADMIN ? await this.prisma.booking.findMany({
      where: { booking_variant: { apartment_id: apartment.id } },
      include: EXTENDED_BOOKING_INCLUDE,
    }) : [];

    // Calculate average rating
    const reviews = await this.prisma.review.findMany({
      where: { apartment_id: apartment.id },
      include: EXTENDED_REVIEW_INCLUDE,
    });
    const rating =
      reviews.length > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) /
        reviews.length
        : 0;
    const availability =
      await this.availabilityService.checkApartmentAvailability({
        id: apartment.id,
        start_date: new Date(Date.now()),
        end_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
    return {
      ...apartment,
      apartment_beds: apartment.apartment_beds,
      images: apartment.images,
      apartment_amenities: apartment.apartment_amenities,
      availability,
      price,
      capacity,
      rating,
      booking_variants,
      reviews: reviews.map(review => ({ ...review, apartment: undefined })),
      reservations,
      bookings,
      cheapest_variant:
        booking_variants.length > 0
          ? booking_variants.reduce(
            (min, variant) => (variant.price < min.price ? variant : min),
            booking_variants[0],
          )
          : null,
    };
  }
  /**
   * Updates a apartment by its ID
   * @param id Apartment ID
   * @param updateApartmentDto Apartment update data
   * @returns Updated apartment entity
   */
  async update({
    where,
    data,
    file,
  }: {
    where: Prisma.ApartmentWhereUniqueInput;
    data: UpdateApartmentDto;
    file?: Express.Multer.File;
  }) {
    const [apartment] = await Promise.all([
      this.checkService.checkNotFound(where),
      this.checkService.checkConflict(data.number),
    ]);
    const image = file
      ? this.filesService.saveImage({ file, dir_name: 'APARTMENTS' })
      : data.image;
    await this.prisma.apartment.update({ where, data: { ...data, image } });
    return await this.findOne({ where: { id: apartment.id } });
  }
  /**
   * Deletes a apartment by its ID
   * @param id Apartment ID
   * @returns Success message
   */
  async remove(where: Prisma.ApartmentWhereUniqueInput) {
    return !(await this.checkService.checkNotFound(where)).is_excluded
      ? await this.update({
        where,
        data: { is_available: false, is_excluded: false },
      })
      : await this.prisma.apartment.delete({ where });
  }
}
