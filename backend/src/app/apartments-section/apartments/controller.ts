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
} from "@nestjs/common";
import {
  CrudService,
  ListService,
  AvailabilityService,
  AvailableListService,
} from "./services";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  example_apartment,
  example_extended_apartment,
  example_apartment_availability_result,
  example_apartments_list_result,
  example_available_apartments_list_result,
} from "@shared/src/types/apartments-section";
import { CreateApartmentDto, UpdateApartmentDto, ApartmentsFiltersDto, DateRangeDto } from "./dto";
import { AdminOnly, ImageUploadInterceptor } from "src/lib/common";

@ApiTags("Apartments")
@Controller("apartments")
export class ApartmentsController {
  constructor(
    private readonly availabilityService: AvailabilityService,
    private readonly availableListService: AvailableListService,
    private readonly crudService: CrudService,
    private readonly listService: ListService,
  ) { }

  @Post()
  @AdminOnly()
  @UseInterceptors(ImageUploadInterceptor)
  @ApiOperation({
    summary: "Create a new apartment",
    description:
      "Creates a new hotel apartment with the provided details. Requires admin privileges.",
  })
  @ApiResponse({
    status: 201,
    description: "Apartment created successfully",
    example: example_apartment,
  })
  @ApiResponse({
    status: 409,
    description: "Apartment already exists with the same number.",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - valid authentication credentials required.",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - user does not have admin role.",
  })
  create(
    @Body() data: CreateApartmentDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.crudService.create({ data, file });
  }

  @Get()
  @ApiOperation({
    summary: "Get all apartments",
    description:
      "Retrieves all hotel apartments with optional filtering and sorting. Supports pagination and detailed filtering options.",
  })
  @ApiResponse({
    status: 200,
    description: "List of apartments retrieved successfully",
    example: example_apartments_list_result,
  })
  findAll(@Query() filters: ApartmentsFiltersDto) {
    return this.listService.findAll(filters);
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get apartment by ID",
    description:
      "Retrieves detailed information about a specific apartment including amenities, images, beds and pricing information.",
  })
  @ApiParam({ name: "id", description: "Apartment ID (UUID)" })
  @ApiResponse({
    status: 200,
    description: "Apartment found",
    example: example_extended_apartment,
  })
  @ApiResponse({
    status: 404,
    description:
      "Apartment not found - no apartment with the specified ID exists.",
  })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.crudService.findOne({ id });
  }

  @Put(":id")
  @AdminOnly()
  @UseInterceptors(ImageUploadInterceptor)
  @ApiOperation({
    summary: "Update apartment by ID",
    description:
      "Updates specific properties of a apartment. Only fields included in the request will be modified. Requires admin privileges.",
  })
  @ApiParam({ name: "id", description: "Apartment ID (UUID)" })
  @ApiResponse({
    status: 200,
    description: "Apartment updated successfully",
    example: example_extended_apartment,
  })
  @ApiResponse({
    status: 404,
    description:
      "Apartment not found - no apartment with the specified ID exists.",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - valid authentication credentials required.",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - user does not have admin role.",
  })
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() data: UpdateApartmentDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.crudService.update({ where: { id }, data, file });
  }

  @Delete(":id")
  @AdminOnly()
  @ApiOperation({
    summary: "Delete apartment by ID",
    description:
      "Permanently deletes a apartment and all associated data. This action cannot be undone. Requires admin privileges.",
  })
  @ApiParam({ name: "id", description: "Apartment ID (UUID)" })
  @ApiResponse({ status: 200, description: "Apartment deleted successfully" })
  @ApiResponse({
    status: 404,
    description:
      "Apartment not found - no apartment with the specified ID exists.",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - valid authentication credentials required.",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - user does not have admin role.",
  })
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.crudService.remove({ id });
  }

  @Get("available/:id")
  @ApiOperation({
    summary: "Check apartment availability for a specific period",
    description:
      "Verifies if a apartment is available for booking during the specified date range by checking active status and existing reservations/bookings.",
  })
  @ApiParam({ name: "id", description: "Apartment ID (UUID)" })
  @ApiResponse({
    status: 200,
    description: "Apartment availability information",
    example: example_apartment_availability_result,
  })
  @ApiResponse({
    status: 404,
    description:
      "Apartment not found - no apartment with the specified ID exists.",
  })
  checkAvailability(
    @Param("id", ParseUUIDPipe) id: string,
    @Query() date_range: DateRangeDto,
  ) {
    return this.availabilityService.checkApartmentAvailability({
      id,
      ...date_range,
    });
  }

  @Get("available")
  @ApiOperation({
    summary: "Find available apartments for a specific period",
    description:
      "Searches for all available apartments during the specified date range that match the filtering criteria. Returns apartments with pricing and capacity information.",
  })
  @ApiResponse({
    status: 200,
    description: "List of available apartments",
    example: example_available_apartments_list_result,
  })
  findAvailable(@Query() filters: ApartmentsFiltersDto) {
    return this.availableListService.findAvailableApartments(filters);
  }
}
