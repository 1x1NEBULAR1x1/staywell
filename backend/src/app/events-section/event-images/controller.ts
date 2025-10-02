import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
} from "@nestjs/common";
import { CrudService, ListService } from "./services";
import {
  example_event_image,
  example_event_images_list_result,
} from "@shared/src/types/events-section";
import { CreateEventImageDto, UpdateEventImageDto, EventImagesFiltersDto } from "./dto";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AdminOnly, ImageUploadInterceptor } from "src/lib/common";

@ApiTags("Event Images")
@Controller("event-images")
export class EventImagesController {
  constructor(
    private readonly crudService: CrudService,
    private readonly listService: ListService,
  ) { }

  @Post()
  @AdminOnly()
  @UseInterceptors(ImageUploadInterceptor)
  @ApiOperation({ summary: "Create a new event image" })
  @ApiResponse({
    status: 201,
    description: "Event image created successfully",
    example: example_event_image,
  })
  async create(
    @Body() data: CreateEventImageDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.crudService.create({ data, file });
  }

  @Get()
  @ApiOperation({ summary: "Get all event images" })
  @ApiResponse({
    status: 200,
    description: "Returns a list of event images",
    example: example_event_images_list_result,
  })
  async findAll(@Query() filters: EventImagesFiltersDto) {
    return this.listService.findAll(filters);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get event image by ID" })
  @ApiResponse({
    status: 200,
    description: "Returns the event image",
    example: example_event_image,
  })
  @ApiResponse({ status: 404, description: "Event image not found" })
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.crudService.findOne(id);
  }

  @Put(":id")
  @AdminOnly()
  @UseInterceptors(ImageUploadInterceptor)
  @ApiOperation({ summary: "Update event image" })
  @ApiResponse({
    status: 200,
    description: "Event image updated successfully",
    example: example_event_image,
  })
  @ApiResponse({ status: 404, description: "Event image not found" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() data: UpdateEventImageDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.crudService.update({ id, data, file });
  }

  @Delete(":id")
  @AdminOnly()
  @ApiOperation({ summary: "Delete event image" })
  @ApiResponse({
    status: 202,
    description: "Event image deleted successfully",
    example: example_event_image,
  })
  @ApiResponse({ status: 404, description: "Event image not found" })
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.crudService.remove(id);
  }
}
