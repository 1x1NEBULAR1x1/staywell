import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/lib/prisma";
import { User } from "@shared/src/database";
import { ExtendedBookingAdditionalOption } from "@shared/src/types/bookings-section";
import { CheckService } from "./check.service";
import { CreateBookingAdditionalOptionDto, UpdateBookingAdditionalOptionDto } from "../dto";

@Injectable()
export class CrudService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly checkService: CheckService,
  ) { }
  /**
   * Creates a new booking-option relationship
   * @param createBookingOptionDto Booking option creation data
   * @returns Created booking option with relations
   */
  async create({
    data,
    user,
  }: {
    user: User;
    data: CreateBookingAdditionalOptionDto;
  }): Promise<ExtendedBookingAdditionalOption> {
    await Promise.all([
      this.checkService.checkAdditionalOption(data.option_id),
      this.checkService.checkBooking({ id: data.booking_id, user_id: user.id }),
      this.checkService.checkBookingAdditionalOption(data),
    ]);
    return await this.prisma.bookingAdditionalOption.create({
      data: data,
      include: { additional_option: true },
    });
  }
  /**
   * Finds a booking-option relationship by ID
   * @param id Booking option ID
   * @returns Booking option with relations
   */
  async findOne(
    id: string,
    user: User,
  ): Promise<ExtendedBookingAdditionalOption> {
    const booking_option = await this.prisma.bookingAdditionalOption.findUnique(
      {
        where: { id },
        include: { additional_option: true },
      },
    );
    if (!booking_option)
      throw new NotFoundException("Booking option not found");
    await this.checkService.checkOwnerOrAdmin({
      booking_id: booking_option.booking_id,
      user,
    });
    return booking_option;
  }
  /**
   * Updates a booking-option relationship
   * @param id Booking option ID
   * @param updateBookingOptionDto Update booking option data
   * @returns Updated booking option with relations
   */
  async update({
    id,
    user,
    data,
  }: {
    user: User;
    id: string;
    data: UpdateBookingAdditionalOptionDto;
  }): Promise<ExtendedBookingAdditionalOption> {
    await Promise.all([
      this.findOne(id, user),
      this.checkService.checkBooking({ id: data.booking_id, user_id: user.id }),
      this.checkService.checkAdditionalOption(data.option_id),
      this.checkService.checkBookingAdditionalOption(data),
    ]);
    return await this.prisma.bookingAdditionalOption.update({
      where: { id },
      data,
      include: { additional_option: true },
    });
  }
  /**
   * Deletes a booking-option relationship
   * @param id Booking option ID
   * @returns Success message
   */
  async remove(id: string, user: User): Promise<{ message: string }> {
    const booking_option = await this.findOne(id, user);
    if (!booking_option)
      throw new NotFoundException("Booking option not found");
    await this.prisma.bookingAdditionalOption.delete({ where: { id } });
    return { message: "Booking option has been removed successfully" };
  }
}
