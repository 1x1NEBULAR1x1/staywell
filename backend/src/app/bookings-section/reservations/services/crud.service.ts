import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "src/lib/prisma";
import {
  Prisma,
  Reservation,
  Role,
  User,
  SAFE_USER_SELECT
} from "@shared/src";
import { CreateReservationDto, UpdateReservationDto } from "../dto";

@Injectable()
export class CrudService {
  constructor(private prisma: PrismaService) { }

  private async checkUser(id: string) {
    if (!(await this.prisma.user.findFirst({ where: { id } })))
      throw new NotFoundException("User not found");
  }

  private async checkApartment(id: string) {
    if (!(await this.prisma.apartment.findUnique({ where: { id } }))) {
      throw new NotFoundException("Apartment not found");
    }
  }

  private async checkOverlappingReservations({
    apartment_id,
    start,
    end,
  }: {
    apartment_id: string;
    start: Date;
    end: Date;
  }) {
    const overlapping_reservations = await this.prisma.reservation.findMany({
      where: {
        apartment_id: apartment_id,
        OR: [
          {
            start: { lte: end },
            end: { gte: start },
          },
        ],
      },
    });

    if (overlapping_reservations.length > 0)
      throw new ConflictException(
        "Apartment is already reserved for these dates",
      );
  }
  /**
   * Create a new reservation
   * @param createReservationDto - The reservation to create
   * @returns The created reservation
   */
  async create({
    data,
    user,
  }: {
    data: CreateReservationDto;
    user: User;
  }): Promise<Reservation> {
    const user_id = user.role === Role.ADMIN ? data.user_id : user.id;
    await Promise.all([
      this.checkApartment(data.apartment_id),
      this.checkUser(user_id),
      this.checkOverlappingReservations(data),
    ]);
    return await this.prisma.reservation.create({
      data: { ...data, user_id },
      include: {
        user: { select: SAFE_USER_SELECT },
        apartment: true,
      },
    });
  }
  /**
   * Find a reservation by ID
   * @param id - The ID of the reservation
   * @returns The reservation
   */
  async findOne({
    id,
    user,
  }: {
    id: string;
    user: User;
  }): Promise<Reservation> {
    const where: Prisma.ReservationWhereInput =
      user.role === Role.ADMIN ? { id } : { id, user_id: user.id };
    const reservation = await this.prisma.reservation.findFirst({
      where,
      include: {
        user: { select: SAFE_USER_SELECT },
        apartment: true,
      },
    });
    if (!reservation) throw new NotFoundException("Reservation not found");
    return reservation;
  }
  /**
   * Update a reservation
   * @param id - The ID of the reservation
   * @param updateReservationDto - The reservation to update
   * @returns The updated reservation
   */
  async update({
    user,
    id,
    data,
  }: {
    id: string;
    data: UpdateReservationDto;
    user: User;
  }): Promise<Reservation> {
    const user_id = user.role === Role.ADMIN ? data.user_id : user.id;
    const reservation = await this.findOne({ id, user });
    // If dates have changed, check for overlapping reservations
    if (data.start || data.end) {
      const start = data.start || reservation.start;
      const end = data.end || reservation.end;
      await this.checkOverlappingReservations({
        start,
        end,
        apartment_id: reservation.apartment_id,
      });
    }
    return await this.prisma.reservation.update({
      where: { id },
      data: { ...data, user_id },
      include: {
        user: { select: SAFE_USER_SELECT },
        apartment: true,
      },
    });
  }
  /**
   * Remove a reservation
   * @param id - The ID of the reservation
   * @returns The removed reservation
   */
  async remove({ id, user }: { id: string; user: User }) {
    await this.findOne({ id, user });
    return await this.prisma.reservation.delete({ where: { id } });
  }
}
