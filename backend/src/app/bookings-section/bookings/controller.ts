import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
  Put,
} from '@nestjs/common';
import { CrudService, ListService, StatusService } from './services';
import { User } from '@shared/src/database';
import { UpdateBookingDto, BookingsFiltersDto } from './dto';
import { JwtAuthGuard, Auth, AdminOnly } from 'src/lib/common';

@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly listService: ListService,
    private readonly crudService: CrudService,
    private readonly statusService: StatusService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  list(@Auth() user: User, @Query() filters: BookingsFiltersDto) {
    return this.listService.findAll({ filters, user });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  find(@Auth() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.crudService.find({ where: { id }, user });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Auth() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateBookingDto,
  ) {
    return this.crudService.update({ id, data, user });
  }

  @Patch(':id/confirm')
  @AdminOnly()
  confirmBooking(@Param('id', ParseUUIDPipe) id: string) {
    return this.statusService.confirmBooking(id);
  }

  @Patch(':id/complete')
  @AdminOnly()
  completeBooking(@Param('id', ParseUUIDPipe) id: string) {
    return this.statusService.completeBooking(id);
  }

  @Patch(':id/cancel')
  @AdminOnly()
  cancelBooking(@Param('id', ParseUUIDPipe) id: string) {
    return this.statusService.cancelBooking(id);
  }
}
