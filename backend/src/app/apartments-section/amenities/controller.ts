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
import { ListService, CrudService } from './services';
import { AdminOnly, ImageUploadInterceptor } from 'src/lib/common';
import { CreateAmenityDto, UpdateAmenityDto, AmenitiesFiltersDto } from './dto';

@Controller('amenities')
export class AmenitiesController {
  constructor(
    private readonly crudService: CrudService,
    private readonly listService: ListService,
  ) { }

  @Post()
  @AdminOnly()
  @UseInterceptors(ImageUploadInterceptor)
  create(
    @Body() data: CreateAmenityDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.crudService.create({ data, file });
  }

  @Get()
  findAll(@Query() filters: AmenitiesFiltersDto) {
    return this.listService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.crudService.findOne(id);
  }

  @Put(':id')
  @AdminOnly()
  @UseInterceptors(ImageUploadInterceptor)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateAmenityDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.crudService.update({ id, data, file });
  }

  @Delete(':id')
  @AdminOnly()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.crudService.remove(id);
  }
}
