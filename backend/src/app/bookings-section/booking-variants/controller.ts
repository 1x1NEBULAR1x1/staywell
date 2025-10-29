import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CrudService, ListService } from './services';
import {
  example_extended_booking_variants_list_result,
  example_extended_booking_variant,
} from '@shared/src/types/bookings-section';
import { AdminOnly } from 'src/lib/common';
import {
  CreateBookingVariantDto,
  UpdateBookingVariantDto,
  BookingVariantsFiltersDto,
} from './dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Booking Variants')
@Controller('booking-variants')
export class BookingVariantsController {
  constructor(
    private readonly crudService: CrudService,
    private readonly listService: ListService,
  ) {}

  @Post()
  @AdminOnly()
  @ApiOperation({ summary: 'Create a new booking variant' })
  @ApiResponse({
    status: 201,
    description: 'Booking variant created successfully',
    example: example_extended_booking_variant,
  })
  create(@Body() data: CreateBookingVariantDto) {
    return this.crudService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all booking variants' })
  @ApiResponse({
    status: 200,
    description: 'List of booking variants',
    example: example_extended_booking_variants_list_result,
  })
  findAll(@Query() filterDto: BookingVariantsFiltersDto) {
    return this.listService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking variant by ID' })
  @ApiParam({ name: 'id', description: 'Booking variant ID' })
  @ApiResponse({
    status: 200,
    description: 'Booking variant found',
    example: example_extended_booking_variant,
  })
  @ApiResponse({ status: 404, description: 'Booking variant not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.crudService.findOne(id);
  }

  @Put(':id')
  @AdminOnly()
  @ApiOperation({ summary: 'Update booking variant by ID' })
  @ApiParam({ name: 'id', description: 'Booking variant ID' })
  @ApiResponse({
    status: 200,
    description: 'Booking variant updated successfully',
    example: example_extended_booking_variant,
  })
  @ApiResponse({ status: 404, description: 'Booking variant not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookingVariantDto: UpdateBookingVariantDto,
  ) {
    return this.crudService.update(id, updateBookingVariantDto);
  }

  @Delete(':id')
  @AdminOnly()
  @ApiOperation({ summary: 'Delete booking variant by ID' })
  @ApiParam({ name: 'id', description: 'Booking variant ID' })
  @ApiResponse({
    status: 204,
    description: 'Booking variant deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Booking variant not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.crudService.remove(id);
  }
}
