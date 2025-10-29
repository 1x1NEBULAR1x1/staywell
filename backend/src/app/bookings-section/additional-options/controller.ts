import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CrudService, ListService } from './services';
import {
  example_additional_option,
  example_additional_options_list_result,
} from '@shared/src/types/bookings-section';
import {
  CreateAdditionalOptionDto,
  UpdateAdditionalOptionDto,
  AdditionalOptionsFiltersDto,
} from './dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ImageUploadInterceptor, AdminOnly } from 'src/lib/common';

@ApiTags('Additional Options')
@Controller('additional-options')
export class AdditionalOptionsController {
  constructor(
    private readonly crudService: CrudService,
    private readonly listService: ListService,
  ) {}

  @Post()
  @AdminOnly()
  @UseInterceptors(ImageUploadInterceptor)
  @ApiOperation({ summary: 'Create new additional option' })
  @ApiResponse({
    status: 201,
    description: 'Additional option has been successfully created',
    example: example_additional_option,
  })
  @ApiQuery({
    description: 'Data to create an Additional Option',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        image: { type: 'string' },
        file: { type: 'string', format: 'binary' },
        price: { type: 'string' },
      },
      required: ['name', 'description', 'price'],
    },
  })
  create(
    @Body() data: CreateAdditionalOptionDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.crudService.create({ data, file });
  }

  @Get()
  @ApiOperation({ summary: 'Get all additional options with filters' })
  @ApiResponse({
    status: 200,
    description: 'List of additional options',
    example: example_additional_options_list_result,
  })
  findAll(@Query() filters: AdditionalOptionsFiltersDto) {
    return this.listService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get additional option by ID' })
  @ApiParam({ name: 'id', description: 'Additional option ID' })
  @ApiResponse({
    status: 200,
    description: 'Additional option found',
    example: example_additional_option,
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.crudService.findOne({ id });
  }

  @Put(':id')
  @AdminOnly()
  @UseInterceptors(ImageUploadInterceptor)
  @ApiOperation({ summary: 'Update additional option' })
  @ApiParam({ name: 'id', description: 'Additional option ID' })
  @ApiResponse({
    status: 200,
    description: 'Additional option has been successfully updated',
    example: example_additional_option,
  })
  @ApiQuery({
    description: 'Data to create an Additional Option',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        image: { type: 'string' },
        file: { type: 'string', format: 'binary' },
        price: { type: 'string' },
      },
    },
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateAdditionalOptionDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.crudService.update({ id, data, file });
  }

  @Delete(':id')
  @AdminOnly()
  @ApiOperation({ summary: 'Delete additional option' })
  @ApiParam({ name: 'id', description: 'Additional option ID' })
  @ApiResponse({
    status: 204,
    description: 'Additional option has been successfully deleted',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.crudService.remove(id);
  }
}
