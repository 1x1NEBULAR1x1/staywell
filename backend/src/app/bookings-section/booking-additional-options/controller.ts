import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  Put,
  UseGuards,
} from "@nestjs/common";
import { CrudService, ListService } from "./services";
import {
  example_extended_booking_additional_option,
  example_extended_booking_additional_options_list_result,
  example_total_price,
} from "@shared/src/types/bookings-section";
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { JwtAuthGuard, Auth, AdminOnly } from "src/lib/common";
import { CreateBookingAdditionalOptionDto, UpdateBookingAdditionalOptionDto, BookingAdditionalOptionsFiltersDto } from "./dto";
import { User } from "@shared/src/database";


@ApiTags("Booking Additional Options")
@Controller("booking-additional-options")
export class BookingAdditionalOptionsController {
  constructor(
    private readonly crudService: CrudService,
    private readonly listService: ListService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Add additional option to booking" })
  @ApiResponse({
    status: 201,
    description: "Additional option has been successfully added to booking",
    example: example_extended_booking_additional_option,
  })
  create(@Auth() user: User, @Body() data: CreateBookingAdditionalOptionDto) {
    return this.crudService.create({ user, data });
  }

  @Get()
  @ApiOperation({
    summary: "Get booking-additional option relationships with filters",
  })
  @ApiResponse({
    status: 200,
    description: "List of booking-additional option relationships",
    example: example_extended_booking_additional_options_list_result,
  })
  findAll(@Query() filters: BookingAdditionalOptionsFiltersDto) {
    return this.listService.findAll(filters);
  }

  @Get("total-price/:booking_id")
  @ApiOperation({
    summary: "Calculate total price of additional options for a booking",
  })
  @ApiParam({ name: "booking_id", description: "Booking ID" })
  @ApiResponse({
    status: 200,
    description: "Total price of additional options for the booking",
    example: example_total_price,
  })
  calculateTotalPrice(
    @Auth() user: User,
    @Param("booking_id", ParseUUIDPipe) booking_id: string,
  ) {
    return this.listService.calculateTotalPrice({ booking_id, user });
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get booking-option relationship by ID" })
  @ApiParam({ name: "id", description: "Booking option ID" })
  @ApiResponse({
    status: 200,
    description: "Booking-option relationship found",
    example: example_extended_booking_additional_option,
  })
  findOne(@Auth() user: User, @Param("id", ParseUUIDPipe) id: string) {
    return this.crudService.findOne(id, user);
  }

  @Put(":id")
  @AdminOnly()
  @ApiOperation({ summary: "Update booking-option relationship" })
  @ApiParam({ name: "id", description: "Booking option ID" })
  @ApiResponse({
    status: 200,
    description: "Booking-option relationship has been successfully updated",
    example: example_extended_booking_additional_option,
  })
  update(
    @Auth() user: User,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() data: UpdateBookingAdditionalOptionDto,
  ) {
    return this.crudService.update({ id, data, user });
  }

  @Delete(":id")
  @AdminOnly()
  @ApiOperation({ summary: "Remove additional option from booking" })
  @ApiParam({ name: "id", description: "Booking option ID" })
  @ApiResponse({
    status: 204,
    description: "Additional option has been successfully removed from booking",
  })
  remove(@Auth() user: User, @Param("id", ParseUUIDPipe) id: string) {
    return this.crudService.remove(id, user);
  }
}
