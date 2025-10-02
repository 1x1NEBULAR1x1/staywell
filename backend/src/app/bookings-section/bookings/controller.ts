import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  ParseEnumPipe,
  UseGuards,
  Put,
} from "@nestjs/common";
import { CrudService, ListService, StatusService } from "./services";
import { BookingStatus, Role, User } from "@shared/src/database";
import { CreateBookingDto, UpdateBookingDto, BookingsFiltersDto } from "./dto";
import { example_extended_booking, example_extended_bookings_list_result } from "@shared/src/types/bookings-section";
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { JwtAuthGuard, Auth, AdminOnly } from "src/lib/common";

@ApiTags("Bookings")
@Controller("bookings")
export class BookingsController {
  constructor(
    private readonly listService: ListService,
    private readonly crudService: CrudService,
    private readonly statusService: StatusService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Create a new booking" })
  @ApiResponse({
    status: 201,
    description: "Booking created successfully",
    example: example_extended_booking,
  })
  create(@Auth() user: User, @Body() data: CreateBookingDto) {
    return this.crudService.create({ user, data });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get all bookings" })
  @ApiResponse({
    status: 200,
    description: "Return all bookings",
    example: example_extended_bookings_list_result,
  })
  findAll(@Auth() user: User, @Query() filters: BookingsFiltersDto) {
    return this.listService.findAll({ filters, user });
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get a booking by ID" })
  @ApiResponse({
    status: 200,
    description: "Return the booking",
    example: example_extended_booking,
  })
  @ApiResponse({ status: 404, description: "Booking not found" })
  findOne(@Auth() user: User, @Param("id", ParseUUIDPipe) id: string) {
    return this.crudService.findOne({
      id,
      user_id: user.role !== Role.ADMIN ? user.id : undefined,
    });
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Update a booking" })
  @ApiResponse({
    status: 200,
    description: "Booking updated successfully",
    example: example_extended_booking,
  })
  @ApiResponse({ status: 404, description: "Booking not found" })
  update(
    @Auth() user: User,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.crudService.update(id, updateBookingDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a booking" })
  @ApiResponse({ status: 204, description: "Booking deleted successfully" })
  @ApiResponse({ status: 404, description: "Booking not found" })
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.crudService.remove(id);
  }

  @Patch(":id/confirm")
  @AdminOnly()
  @ApiOperation({ summary: "Confirm booking" })
  @ApiParam({ name: "id", description: "Booking ID" })
  @ApiResponse({
    status: 200,
    description: "Booking has been confirmed",
    example: example_extended_booking,
  })
  confirmBooking(@Param("id", ParseUUIDPipe) id: string) {
    return this.statusService.confirmBooking(id);
  }

  @Patch(":id/complete")
  @AdminOnly()
  @ApiOperation({ summary: "Complete booking" })
  @ApiParam({ name: "id", description: "Booking ID" })
  @ApiResponse({
    status: 200,
    description: "Booking has been completed",
    example: example_extended_booking,
  })
  completeBooking(@Param("id", ParseUUIDPipe) id: string) {
    return this.statusService.completeBooking(id);
  }

  @Patch(":id/cancel")
  @AdminOnly()
  @ApiOperation({ summary: "Cancel booking" })
  @ApiParam({ name: "id", description: "Booking ID" })
  @ApiResponse({
    status: 200,
    description: "Booking has been cancelled",
    example: example_extended_booking,
  })
  cancelBooking(@Param("id", ParseUUIDPipe) id: string) {
    return this.statusService.cancelBooking(id);
  }

  @Patch(":id/status/:status")
  @AdminOnly()
  @ApiOperation({ summary: "Update booking status" })
  @ApiParam({ name: "id", description: "Booking ID" })
  @ApiParam({
    name: "status",
    enum: BookingStatus,
    description: "New booking status",
  })
  @ApiResponse({
    status: 200,
    description: "Booking status has been updated",
    example: example_extended_booking,
  })
  updateStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @Param("status", new ParseEnumPipe(BookingStatus)) status: BookingStatus,
  ) {
    return this.statusService.updateStatus(id, status);
  }
}
