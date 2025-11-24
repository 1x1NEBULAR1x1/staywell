import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import {
  CrudService,
  ListService,
  AvailabilityService,
  AvailableListService,
  DatesConfigService,
  EventsConfigService,
} from './services';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  example_extended_apartment,
  example_apartment_availability_result,
  example_available_apartments_list_result,
} from '@shared/src/types/apartments-section';
import {
  CreateApartmentDto,
  UpdateApartmentDto,
  ApartmentsFiltersDto,
  DateRangeDto,
  DatesConfigDto,
  EventsConfigDto,
} from './dto';
import { AdminOnly, Auth, ImageUploadInterceptor } from 'src/lib/common';
import { User } from '@shared/src/database';

@Controller('apartments')
export class ApartmentsController {
  constructor(
    private readonly availabilityService: AvailabilityService,
    private readonly availableListService: AvailableListService,
    private readonly datesConfigService: DatesConfigService,
    private readonly eventsConfigService: EventsConfigService,
    private readonly crudService: CrudService,
    private readonly listService: ListService,
  ) { }

  @Post()
  @AdminOnly()
  @UseInterceptors(ImageUploadInterceptor)
  create(
    @Body() data: CreateApartmentDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.crudService.create({ data, file });
  }

  @Get()
  findAll(@Query() filters: ApartmentsFiltersDto, @Auth() user?: User) {
    return this.listService.list({ filters, user });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Auth() user: User) {
    return this.crudService.findOne({ where: { id }, user });
  }

  @Put(':id')
  @AdminOnly()
  @UseInterceptors(ImageUploadInterceptor)
  @ApiOperation({
    summary: 'Update apartment by ID',
    description:
      'Updates specific properties of a apartment. Only fields included in the request will be modified. Requires admin privileges.',
  })
  @ApiParam({ name: 'id', description: 'Apartment ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Apartment updated successfully',
    example: example_extended_apartment,
  })
  @ApiResponse({
    status: 404,
    description:
      'Apartment not found - no apartment with the specified ID exists.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - valid authentication credentials required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - user does not have admin role.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateApartmentDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.crudService.update({ where: { id }, data, file });
  }

  @Delete(':id')
  @AdminOnly()
  @ApiOperation({
    summary: 'Delete apartment by ID',
    description:
      'Permanently deletes a apartment and all associated data. This action cannot be undone. Requires admin privileges.',
  })
  @ApiParam({ name: 'id', description: 'Apartment ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Apartment deleted successfully' })
  @ApiResponse({
    status: 404,
    description:
      'Apartment not found - no apartment with the specified ID exists.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - valid authentication credentials required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - user does not have admin role.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.crudService.remove({ id });
  }

  @Get('available/:id')
  @ApiOperation({
    summary: 'Check apartment availability for a specific period',
    description:
      'Verifies if a apartment is available for booking during the specified date range by checking active status and existing reservations/bookings.',
  })
  @ApiParam({ name: 'id', description: 'Apartment ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Apartment availability information',
    example: example_apartment_availability_result,
  })
  @ApiResponse({
    status: 404,
    description:
      'Apartment not found - no apartment with the specified ID exists.',
  })
  checkAvailability(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() date_range: DateRangeDto,
  ) {
    return this.availabilityService.checkApartmentAvailability({
      id,
      ...date_range,
    });
  }

  @Get('available')
  @ApiOperation({
    summary: 'Find available apartments for a specific period',
    description:
      'Searches for all available apartments during the specified date range that match the filtering criteria. Returns apartments with pricing and capacity information.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of available apartments',
    example: example_available_apartments_list_result,
  })
  findAvailable(@Query() filters: ApartmentsFiltersDto) {
    return this.availableListService.findAvailableApartments(filters);
  }

  @Get('dates-config/:id')
  @ApiOperation({
    summary: 'Get dates configuration for apartment booking',
    description:
      'Returns occupied dates for a specific apartment in the given month to help with date selection for booking.',
  })
  @ApiParam({ name: 'id', description: 'Apartment ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Dates configuration with occupied dates',
    schema: {
      type: 'object',
      properties: {
        occupied_dates: {
          type: 'array',
          items: { type: 'string', format: 'date' },
          description: 'Array of occupied date strings in YYYY-MM-DD format',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description:
      'Apartment not found - no apartment with the specified ID exists.',
  })
  getDatesConfig(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() datesConfig: DatesConfigDto,
  ) {
    return this.datesConfigService.getDatesConfig({
      id,
      ...datesConfig,
    });
  }

  @Get('available-events')
  @ApiOperation({
    summary: 'Get available events for booking dates',
    description:
      'Returns events that are available during the specified booking date range, considering capacity and existing bookings.',
  })
  @ApiResponse({
    status: 200,
    description: 'Available events configuration',
    schema: {
      type: 'object',
      properties: {
        available_events: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              image: { type: 'string' },
              description: { type: 'string' },
              price: { type: 'number' },
              capacity: { type: 'number' },
              available_spots: { type: 'number' },
              start: { type: 'string', format: 'date-time' },
              end: { type: 'string', format: 'date-time' },
              guide: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  first_name: { type: 'string' },
                  last_name: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  })
  getAvailableEvents(@Query() eventsConfig: EventsConfigDto) {
    return this.eventsConfigService.getAvailableEvents(eventsConfig);
  }
}
