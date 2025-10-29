import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CrudService, ListService } from './services';
import {
  example_extended_apartment_amenities_list_result,
  example_extended_apartment_amenity,
} from '@shared/src/types/apartments-section';
import { CreateApartmentAmenityDto, ApartmentAmenitiesFiltersDto } from './dto';

import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AdminOnly } from 'src/lib/common';

@ApiTags('Apartment Amenities')
@Controller('apartment-amenities')
export class ApartmentAmenitiesController {
  constructor(
    private readonly crudService: CrudService,
    private readonly listService: ListService,
  ) {}

  @Post()
  @AdminOnly()
  @ApiOperation({ summary: 'Add amenity to apartment' })
  @ApiResponse({
    status: 201,
    description: 'Amenity added to apartment successfully',
    example: example_extended_apartment_amenity,
  })
  @ApiResponse({ status: 404, description: 'Apartment or amenity not found' })
  @ApiResponse({
    status: 409,
    description: 'Amenity already exists in apartment',
  })
  create(@Body() data: CreateApartmentAmenityDto) {
    return this.crudService.create(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ApartmentAmenity by ID' })
  @ApiParam({ name: 'id', description: 'Apartment amenity ID' })
  @ApiResponse({
    status: 200,
    description: 'ApartmentAmenity found',
    example: example_extended_apartment_amenity,
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.crudService.findOne({ id });
  }

  @Get()
  @ApiOperation({ summary: 'Get all amenities for a Apartment' })
  @ApiResponse({
    status: 200,
    description: 'List of Apartment amenities',
    example: example_extended_apartment_amenities_list_result,
  })
  findAll(@Query() filters: ApartmentAmenitiesFiltersDto) {
    return this.listService.findAll(filters);
  }

  @Delete(':id')
  @AdminOnly()
  @ApiOperation({ summary: 'Remove Apartment amenity by ID' })
  @ApiParam({ name: 'id', description: 'Apartment amenity ID' })
  @ApiResponse({ status: 204, description: 'Apartment amenity removed' })
  @ApiResponse({ status: 404, description: 'Apartment amenity not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.crudService.remove({ id });
  }
}
