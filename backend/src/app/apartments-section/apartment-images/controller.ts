import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import {
  example_apartment_image,
  example_apartment_images_list_result,
} from '@shared/src/types/apartments-section';
import {
  CreateApartmentImageDto,
  UpdateApartmentImageDto,
  ApartmentImagesFiltersDto,
} from './dto';
import { ApiOperation, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListService, CrudService } from './services';
import { AdminOnly, ImageUploadInterceptor } from 'src/lib/common';

@ApiTags('Apartment Images')
@Controller('apartment-images')
export class ApartmentImagesController {
  constructor(
    private readonly crudService: CrudService,
    private readonly listService: ListService,
  ) {}

  @Post()
  @AdminOnly()
  @UseInterceptors(ImageUploadInterceptor)
  @ApiOperation({ summary: 'Create a new apartment image' })
  @ApiBody({ type: CreateApartmentImageDto })
  @ApiResponse({
    status: 201,
    description: 'The apartment image has been successfully created.',
    example: example_apartment_image,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 409, description: 'Apartment image already exists.' })
  create(
    @Body() data: CreateApartmentImageDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.crudService.create({ data, file });
  }

  @Get()
  @ApiOperation({ summary: 'Get all apartment images' })
  @ApiResponse({
    status: 200,
    description: 'The apartment images have been successfully retrieved.',
    example: example_apartment_images_list_result,
  })
  findAll(@Query() filters: ApartmentImagesFiltersDto) {
    return this.listService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a apartment image by ID' })
  @ApiResponse({
    status: 200,
    description: 'The apartment image has been successfully retrieved.',
    example: example_apartment_image,
  })
  @ApiResponse({ status: 404, description: 'Apartment image not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.crudService.findOne(id);
  }

  @Put(':id')
  @AdminOnly()
  @UseInterceptors(ImageUploadInterceptor)
  @ApiOperation({ summary: 'Update a apartment image by ID' })
  @ApiResponse({
    status: 200,
    description: 'The apartment image has been successfully updated.',
    example: example_apartment_image,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Apartment image not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateApartmentImageDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.crudService.update({ id, data, file });
  }

  @Delete(':id')
  @AdminOnly()
  @ApiOperation({ summary: 'Delete a apartment image by ID' })
  @ApiResponse({
    status: 200,
    description: 'The apartment image has been successfully deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Apartment image not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.crudService.remove(id);
  }
}
