import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { ListService, CrudService } from './services';
import {
  example_amenities_list_result,
  example_amenity_with_relations,
  example_amenity,
} from '@shared/src/types/apartments-section';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminOnly, ImageUploadInterceptor } from 'src/lib/common';
import { CreateAmenityDto, UpdateAmenityDto, AmenitiesFiltersDto } from './dto';

@Controller('amenities')
@ApiTags('Amenities')
export class AmenitiesController {
  constructor(
    private readonly crudService: CrudService,
    private readonly listService: ListService,
  ) {}

  @Post()
  @AdminOnly()
  @UseInterceptors(ImageUploadInterceptor)
  @ApiOperation({ summary: 'Create a new amenity' })
  @ApiResponse({
    status: 201,
    description: 'The amenity has been successfully created.',
    example: example_amenity_with_relations,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 409, description: 'Amenity already exists.' })
  create(
    @Body() data: CreateAmenityDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.crudService.create({ data, file });
  }

  @Get()
  @ApiOperation({ summary: 'Get all amenities' })
  @ApiResponse({
    status: 200,
    description: 'The amenities have been successfully retrieved.',
    example: example_amenities_list_result,
  })
  findAll(@Query() filters: AmenitiesFiltersDto) {
    return this.listService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get amenity by ID' })
  @ApiResponse({
    status: 200,
    description: 'The amenity has been successfully retrieved.',
    example: example_amenity_with_relations,
  })
  @ApiResponse({ status: 404, description: 'Amenity not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.crudService.findOne(id);
  }

  @Put(':id')
  @AdminOnly()
  @UseInterceptors(ImageUploadInterceptor)
  @ApiOperation({ summary: 'Update amenity by ID' })
  @ApiResponse({
    status: 200,
    description: 'The amenity has been successfully updated.',
    example: example_amenity_with_relations,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Amenity not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateAmenityDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.crudService.update({ id, data, file });
  }

  @Delete(':id')
  @AdminOnly()
  @ApiOperation({ summary: 'Delete amenity by ID' })
  @ApiResponse({
    status: 200,
    description: 'The amenity has been successfully deleted.',
    example: example_amenity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Amenity not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.crudService.remove(id);
  }
}
