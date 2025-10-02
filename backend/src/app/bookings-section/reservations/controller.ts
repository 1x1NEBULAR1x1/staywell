import { CrudService, ListService } from "./services";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtAuthGuard, Auth, AdminOnly } from "src/lib/common";
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseUUIDPipe,
} from "@nestjs/common";
import { User } from "@shared/src/database";
import { CreateReservationDto, UpdateReservationDto, ReservationsFiltersDto } from "./dto";
import { ApiTags } from "@nestjs/swagger";
import { example_extended_reservation, example_extended_reservations_list_result } from "@shared/src/types/bookings-section";

@ApiTags("Reservations")
@Controller("reservations")
export class ReservationsController {
  constructor(
    private readonly crudService: CrudService,
    private readonly listService: ListService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Create a new reservation" })
  @ApiResponse({
    status: 201,
    description: "The reservation has been successfully created.",
    example: example_extended_reservation,
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 409, description: "Reservation already exists." })
  create(@Auth() user: User, @Body() data: CreateReservationDto) {
    return this.crudService.create({ data, user });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get all reservations" })
  @ApiResponse({
    status: 200,
    description: "The reservations have been successfully retrieved.",
    example: example_extended_reservations_list_result,
  })
  findAll(@Auth() user: User, @Query() filters: ReservationsFiltersDto) {
    return this.listService.findAll({ filters, user });
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get reservation by ID" })
  @ApiResponse({
    status: 200,
    description: "The reservation has been successfully retrieved.",
    example: example_extended_reservation,
  })
  findOne(@Auth() user: User, @Param("id", ParseUUIDPipe) id: string) {
    return this.crudService.findOne({ id, user });
  }

  @Put(":id")
  @AdminOnly()
  @ApiOperation({ summary: "Update reservation by ID" })
  @ApiResponse({
    status: 200,
    description: "The reservation has been successfully updated.",
    example: example_extended_reservation,
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Reservation not found." })
  update(
    @Auth() user: User,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() data: UpdateReservationDto,
  ) {
    return this.crudService.update({ id, data, user });
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Delete reservation by ID" })
  @ApiResponse({
    status: 204,
    description: "The reservation has been successfully deleted.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Reservation not found." })
  remove(@Auth() user: User, @Param("id", ParseUUIDPipe) id: string) {
    return this.crudService.remove({ id, user });
  }
}
