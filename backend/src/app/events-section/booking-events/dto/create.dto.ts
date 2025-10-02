import { CreateBookingEvent } from "@shared/src/types/events-section/dto.types";
import { ToInt, ToUUID } from "src/lib/common";

export class CreateBookingEventDto implements CreateBookingEvent {
  @ToInt({ required: true, min: 1, description: "Number of people", example: 1 })
  number_of_people!: number;

  @ToUUID({ required: true, description: "Booking ID", example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  booking_id!: string;

  @ToUUID({ required: true, description: "Event ID", example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  event_id!: string;

  @ToUUID({ required: true, description: "Transaction ID", example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  transaction_id!: string;
}
