import { Module } from "@nestjs/common";
import { BookingsModule } from "./bookings/module";
import { AdditionalOptionsModule } from "./additional-options/module";
import { BookingAdditionalOptionsModule } from "./booking-additional-options/module";
import { BookingVariantsModule } from "./booking-variants/module";
import { ReservationsModule } from "./reservations/module";

@Module({
  imports: [
    AdditionalOptionsModule,
    BookingAdditionalOptionsModule,
    BookingsModule,
    BookingVariantsModule,
    ReservationsModule,
  ],
  exports: [
    AdditionalOptionsModule,
    BookingAdditionalOptionsModule,
    BookingsModule,
    BookingVariantsModule,
    ReservationsModule,
  ],
})
export class BookingsSectionModule { }
