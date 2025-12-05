import { Module } from '@nestjs/common';
import { CheckoutsService } from './services';
import { CheckoutsController } from './checkouts.controller';
import { ConfigModule } from '@nestjs/config';
import { StripeModule } from '../../lib/providers/stripe/stripe.module';
import { BookingsCheckoutService } from './services/bookings.checkout.service';
import { EventsCheckoutService } from './services/events.checkout.service';

@Module({
  imports: [ConfigModule, StripeModule],
  controllers: [CheckoutsController],
  providers: [CheckoutsService, BookingsCheckoutService, EventsCheckoutService],
  exports: [CheckoutsService],
})
export class CheckoutsModule {}
