import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { AdditionalOptionsModule } from 'src/app/bookings-section/additional-options/module';
import { BookingVariantsModule } from 'src/app/bookings-section/booking-variants/module';
import { EventsModule } from 'src/app/events-section/events/module';

@Module({
  imports: [AdditionalOptionsModule, BookingVariantsModule, EventsModule],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
