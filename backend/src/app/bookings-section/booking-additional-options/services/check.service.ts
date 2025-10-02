import { PrismaService } from "src/lib/prisma";
import { Role, User } from "@shared/src/database";
import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from "@nestjs/common";

@Injectable()
export class CheckService {
  constructor(private readonly prisma: PrismaService) { }

  public async checkBooking({ id, user_id }: { id?: string; user_id: string }) {
    if (!(await this.prisma.booking.findFirst({ where: { id, user_id } })))
      throw new NotFoundException("Booking not found");
  }

  public async checkAdditionalOption(id?: string) {
    if (!(await this.prisma.additionalOption.findUnique({ where: { id } })))
      throw new NotFoundException("Additional option not found");
  }

  public async checkBookingAdditionalOption({
    booking_id,
    option_id,
  }: {
    booking_id?: string;
    option_id?: string;
  }) {
    if (booking_id && option_id &&
      !(await this.prisma.bookingAdditionalOption.findUnique({
        where: { booking_id_option_id: { booking_id, option_id } },
      }))
    )
      throw new ConflictException(
        "This option is already added to the booking",
      );
  }

  public async checkOwnerOrAdmin({
    booking_id,
    user,
  }: {
    booking_id: string;
    user: User;
  }) {
    if (user.role === Role.ADMIN) return;
    const booking = await this.prisma.booking.findUnique({
      where: { id: booking_id },
    });
    if (!booking || booking.user_id !== user.id)
      throw new ForbiddenException("Access denied");
  }
}
