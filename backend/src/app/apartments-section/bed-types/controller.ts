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
import { CrudService, ListService } from './services';
import {
  example_bed_type,
  example_bed_types_list_result,
} from '@shared/src/types/apartments-section';
import { CreateBedTypeDto, UpdateBedTypeDto, BedTypesFiltersDto } from './dto';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminOnly, ImageUploadInterceptor } from 'src/lib/common';

@ApiTags('Bed Types')
@Controller('bed-types')
export class BedTypesController {
  constructor(
    private readonly crudService: CrudService,
    private readonly listService: ListService,
  ) {}

  @Post()
  @AdminOnly()
  @UseInterceptors(ImageUploadInterceptor)
  @ApiOperation({ summary: 'Create a new bed type' })
  @ApiResponse({
    status: 201,
    description: 'The bed type has been successfully created.',
    example: example_bed_type,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 409, description: 'Bed type already exists.' })
  create(
    @Body() data: CreateBedTypeDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.crudService.create({ data, file });
  }

  @Get()
  @ApiOperation({ summary: 'Get all bed types' })
  @ApiResponse({
    status: 200,
    description: 'The bed types have been successfully retrieved.',
    example: example_bed_types_list_result,
  })
  findAll(@Query() filters: BedTypesFiltersDto) {
    return this.listService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get bed type by ID' })
  @ApiResponse({
    status: 200,
    description: 'The bed type has been successfully retrieved.',
    example: example_bed_type,
  })
  @ApiResponse({ status: 404, description: 'Bed type not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.crudService.findOne(id);
  }

  @Put(':id')
  @AdminOnly()
  @UseInterceptors(ImageUploadInterceptor)
  @ApiOperation({ summary: 'Update bed type by ID' })
  @ApiResponse({
    status: 200,
    description: 'The bed type has been successfully updated.',
    example: example_bed_type,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Bed type not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateBedTypeDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.crudService.update({ id, data, file });
  }

  @Delete(':id')
  @AdminOnly()
  @ApiOperation({ summary: 'Delete bed type by ID' })
  @ApiResponse({
    status: 200,
    description: 'The bed type has been successfully deleted.',
    example: example_bed_type,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Bed type not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.crudService.remove(id);
  }
}
