import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, Auth } from 'src/lib/common';
import { User } from '@shared/src/database';
import { CheckoutsService } from './services';
import { CreateBookingDto } from '../bookings-section/bookings/dto';
import { CreateBookingEventDto } from '../events-section/booking-events/dto';

@Controller('checkouts')
export class CheckoutsController {
  constructor(private readonly checkoutsService: CheckoutsService) {}

  @Post('booking')
  @UseGuards(JwtAuthGuard)
  async booking(@Auth() user: User, @Body() data: CreateBookingDto) {
    return await this.checkoutsService.booking({
      user,
      create_booking_dto: data,
    });
  }

  @Post('event')
  @UseGuards(JwtAuthGuard)
  async event(@Auth() user: User, @Body() data: CreateBookingEventDto[]) {
    return await this.checkoutsService.event({
      user,
      create_booking_event_dtos: data,
    });
  }
}
