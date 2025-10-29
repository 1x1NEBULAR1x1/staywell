import { UpdateReservation } from '@shared/src/types/bookings-section';
import { PartialType } from '@nestjs/swagger';
import { CreateReservationDto } from './create.dto';

export class UpdateReservationDto
  extends PartialType(CreateReservationDto)
  implements UpdateReservation {}
