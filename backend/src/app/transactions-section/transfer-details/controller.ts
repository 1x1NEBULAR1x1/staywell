import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from "@nestjs/common";
import { CrudService, ListService } from "./services";
import {
  example_transfer_detail,
  example_transfer_details_list_result,
} from "@shared/src/types/transactions-section/example.data";
import { User } from "@shared/src/database";
import { CreateTransferDetailDto, TransferDetailsFiltersDto, UpdateTransferDetailDto } from "./dto";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtAuthGuard, Auth } from "src/lib/common";

@ApiTags("Transfer Details")
@Controller("transfer-details")
export class TransferDetailsController {
  constructor(
    private readonly crudService: CrudService,
    private readonly listService: ListService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Create new transfer details" })
  @ApiResponse({
    status: 201,
    description: "Transfer details successfully created",
    example: example_transfer_detail,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 409, description: "Transfer details already exists" })
  async create(@Auth() user: User, @Body() data: CreateTransferDetailDto) {
    return this.crudService.create({ data, user });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get list of all transfer details" })
  @ApiResponse({
    status: 200,
    description: "Returns list of transfer details",
    example: example_transfer_details_list_result,
  })
  async findAll(
    @Auth() user: User,
    @Query() filters: TransferDetailsFiltersDto,
  ) {
    return await this.listService.findAll({ user, filters });
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get transfer details by ID" })
  @ApiResponse({
    status: 200,
    description: "Returns transfer details",
    example: example_transfer_detail,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Transfer details not found" })
  async findOne(@Auth() user: User, @Param("id", ParseUUIDPipe) id: string) {
    return this.crudService.findOne({ id, user });
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Update transfer details" })
  @ApiResponse({
    status: 200,
    description: "Transfer details successfully updated",
    example: example_transfer_detail,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Transfer details not found" })
  async update(
    @Auth() user: User,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() data: UpdateTransferDetailDto,
  ) {
    return this.crudService.update({ data, user, id });
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Delete transfer details" })
  @ApiResponse({
    status: 204,
    description: "Transfer details successfully deleted",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Transfer details not found" })
  async remove(@Auth() user: User, @Param("id", ParseUUIDPipe) id: string) {
    return this.crudService.remove({ id, user });
  }
}
