import { CreateBookingDto } from "./create.dto";
import { UpdateBooking } from "@shared/src/types/bookings-section";
import { PartialType } from "@nestjs/swagger";


export class UpdateBookingDto extends PartialType(CreateBookingDto) implements UpdateBooking { }