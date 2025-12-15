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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  example_extended_bookings_list_result,
  example_extended_booking,
} from '@shared/src/types/bookings-section';

@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly listService: ListService,
    private readonly crudService: CrudService,
    private readonly statusService: StatusService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiResponse({
    status: 200,
    description: 'The bookings have been successfully retrieved.',
    example: example_extended_bookings_list_result,
  })
  list(@Auth() user: User, @Query() filters: BookingsFiltersDto) {
    return this.listService.findAll({ filters, user });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a booking by ID' })
  @ApiResponse({
    status: 200,
    description: 'The booking has been successfully retrieved.',
    example: example_extended_booking,
  })
  find(@Auth() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.crudService.find({ where: { id }, user });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a booking' })
  @ApiResponse({
    status: 200,
    description: 'The booking has been successfully updated.',
    example: example_extended_booking,
  })
  update(
    @Auth() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateBookingDto,
  ) {
    return this.crudService.update({ id, data, user });
  }

  @Patch(':id/confirm')
  @AdminOnly()
  @ApiOperation({ summary: 'Confirm a booking' })
  @ApiResponse({
    status: 200,
    description: 'The booking has been successfully confirmed.',
    example: example_extended_booking,
  })
  confirmBooking(@Param('id', ParseUUIDPipe) id: string) {
    return this.statusService.confirmBooking(id);
  }

  @Patch(':id/complete')
  @AdminOnly()
  @ApiOperation({ summary: 'Complete a booking' })
  @ApiResponse({
    status: 200,
    description: 'The booking has been successfully completed.',
    example: example_extended_booking,
  })
  completeBooking(@Param('id', ParseUUIDPipe) id: string) {
    return this.statusService.completeBooking(id);
  }

  @Patch(':id/cancel')
  @AdminOnly()
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiResponse({
    status: 200,
    description: 'The booking has been successfully canceled.',
    example: example_extended_booking,
  })
  cancelBooking(@Param('id', ParseUUIDPipe) id: string) {
    return this.statusService.cancelBooking(id);
  }
}
