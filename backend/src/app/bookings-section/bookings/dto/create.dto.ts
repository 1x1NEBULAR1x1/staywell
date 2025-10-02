import { CreateBooking } from "@shared/src/types/bookings-section";
import { ToDate, ToUUID } from "src/lib/common";

export class CreateBookingDto implements CreateBooking {
  @ToUUID({ required: true, description: "User ID", example: "123e4567-e89b-12d3-a456-426614174000" })
  user_id!: string;

  @ToUUID({ required: true, description: "Booking variant ID", example: "123e4567-e89b-12d3-a456-426614174001" })
  booking_variant_id!: string;

  @ToUUID({ required: true, description: "Transaction ID", example: "123e4567-e89b-12d3-a456-426614174002" })
  transaction_id!: string;

  @ToDate({ required: true, min_date: new Date(Date.now()), description: "Check-in date", example: "2025-01-01" })
  start!: Date;

  @ToDate({ required: true, min_date: new Date(Date.now() + 24 * 60 * 60 * 1000), description: "Check-out date", example: "2025-01-01" })
  end!: Date;
}
