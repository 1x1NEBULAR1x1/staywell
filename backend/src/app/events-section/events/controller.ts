import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CrudService, ListService } from './services';
import {
  example_extended_event,
  example_events_list_result,
} from '@shared/src/types/events-section';
import { CreateEventDto, UpdateEventDto, EventsFiltersDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminOnly, ImageUploadInterceptor } from 'src/lib/common';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(
    private readonly crudService: CrudService,
    private readonly listService: ListService,
  ) { }

  @Post()
  @AdminOnly()
  @UseInterceptors(ImageUploadInterceptor)
  @ApiOperation({ summary: 'Create new event' })
  @ApiResponse({
    status: 201,
    description: 'Event successfully created',
    example: example_extended_event,
  })
  async create(
    @Body() data: CreateEventDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.crudService.create({ data, file });
  }

  @Get()
  @ApiOperation({ summary: 'Get list of all events' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of events',
    example: example_events_list_result,
  })
  async findAll(@Query() filters: EventsFiltersDto) {
    return this.listService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns event',
    example: example_extended_event,
  })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.crudService.findOne(id);
  }

  @Put(':id')
  @AdminOnly()
  @UseInterceptors(ImageUploadInterceptor)
  @ApiOperation({ summary: 'Update event' })
  @ApiResponse({
    status: 200,
    description: 'Event successfully updated',
    example: example_extended_event,
  })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateEventDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.crudService.update({ id, data, file });
  }

  @Delete(':id')
  @AdminOnly()
  @ApiOperation({ summary: 'Delete event' })
  @ApiResponse({ status: 204, description: 'Event successfully deleted' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.crudService.remove(id);
  }
}
