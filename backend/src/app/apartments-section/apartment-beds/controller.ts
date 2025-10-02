import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Query,
  Put,
  ParseUUIDPipe,
} from "@nestjs/common";
import { ListService, CrudService } from "./services";
import {
  example_extended_apartment_bed,
  example_extended_apartment_beds_list_result,
} from "@shared/src/types/apartments-section";
import { CreateApartmentBedDto, UpdateApartmentBedDto, ApartmentBedsFiltersDto } from "./dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AdminOnly } from "src/lib/common";

/**
 * Apartment beds controller
 * @description This controller is responsible for handling the apartment beds API requests
 */
@ApiTags("Apartment Beds")
@Controller("apartment-beds")
export class ApartmentBedsController {
  constructor(
    private readonly crudService: CrudService,
    private readonly listService: ListService,
  ) { }

  @Post()
  @AdminOnly()
  @ApiOperation({ summary: "Create a new apartment bed" })
  @ApiResponse({
    status: 201,
    description: "The apartment bed has been successfully created.",
    example: example_extended_apartment_bed,
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 409, description: "Apartment bed already exists." })
  create(@Body() data: CreateApartmentBedDto) {
    return this.crudService.create(data);
  }

  @Get()
  @ApiOperation({ summary: "Get all apartment beds" })
  @ApiResponse({
    status: 200,
    description: "The apartment beds have been successfully retrieved.",
    example: example_extended_apartment_beds_list_result,
  })
  findAll(@Query() filters: ApartmentBedsFiltersDto) {
    return this.listService.findAll(filters);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get all apartment beds" })
  @ApiResponse({
    status: 200,
    description: "The apartment beds have been successfully retrieved.",
    example: example_extended_apartment_bed,
  })
  findOne(@Query("id", ParseUUIDPipe) id: string) {
    return this.crudService.findOne(id);
  }

  @Put(":id")
  @AdminOnly()
  @ApiOperation({ summary: "Update a apartment bed" })
  @ApiResponse({
    status: 200,
    description: "The apartment bed has been successfully updated.",
    example: example_extended_apartment_bed,
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Apartment bed not found." })
  update(
    @Param("bed_id", ParseUUIDPipe) id: string,
    @Body() data: UpdateApartmentBedDto,
  ) {
    return this.crudService.update({ id, data });
  }

  @Delete(":id")
  @AdminOnly()
  @ApiOperation({ summary: "Delete a apartment bed" })
  @ApiResponse({
    status: 204,
    description: "The apartment bed has been successfully deleted.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Apartment bed not found." })
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.crudService.remove(id);
  }
}
