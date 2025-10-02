import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from "@nestjs/common";
import { CrudService, ListService } from "./services";
import {
  example_booking_event,
  example_booking_events_list_result,
} from "@shared/src/types/events-section";
import { User } from "@shared/src/database";
import { CreateBookingEventDto, UpdateBookingEventDto, BookingEventsFiltersDto } from "./dto";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AdminOnly, Auth, JwtAuthGuard } from "src/lib/common";

@ApiTags("Booking Events")
@Controller("booking-events")
export class BookingEventsController {
  constructor(
    private readonly listService: ListService,
    private readonly crudService: CrudService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Create a new booking event" })
  @ApiResponse({
    status: 201,
    description: "Booking event created successfully",
    example: example_booking_event,
  })
  async create(@Auth() user: User, @Body() data: CreateBookingEventDto) {
    return this.crudService.create({ data, user });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get all booking events" })
  @ApiResponse({
    status: 200,
    description: "Returns a list of booking events",
    example: example_booking_events_list_result,
  })
  async findAll(@Auth() user: User, @Query() filters: BookingEventsFiltersDto) {
    return this.listService.findAll({ filters, user });
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get a booking event by ID" })
  @ApiResponse({
    status: 200,
    description: "Returns a booking event",
    example: example_booking_event,
  })
  @ApiResponse({ status: 404, description: "Booking event not found" })
  async findOne(@Auth() user: User, @Param("id", ParseUUIDPipe) id: string) {
    return this.crudService.findOne({ where: { id }, user });
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Update a booking event" })
  @ApiResponse({
    status: 200,
    description: "Booking event updated successfully",
    example: example_booking_event,
  })
  @ApiResponse({ status: 404, description: "Booking event not found" })
  async update(
    @Auth() user: User,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() data: UpdateBookingEventDto,
  ) {
    return this.crudService.update({ id, data, user });
  }

  @Delete(":id")
  @AdminOnly()
  @ApiOperation({ summary: "Delete a booking event" })
  @ApiResponse({
    status: 200,
    description: "Booking event deleted successfully",
    example: example_booking_event,
  })
  @ApiResponse({ status: 404, description: "Booking event not found" })
  async remove(@Auth() user: User, @Param("id", ParseUUIDPipe) id: string) {
    return this.crudService.remove({ id, user });
  }
}
