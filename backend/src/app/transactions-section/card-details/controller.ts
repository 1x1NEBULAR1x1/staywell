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
import { User } from "@shared/src/database";
import { CardDetailsFiltersDto, CreateCardDetailDto, UpdateCardDetailDto } from "./dto";
import { example_card_detail, example_card_details_list_result } from "@shared/src/types/transactions-section/example.data";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Auth, JwtAuthGuard } from "src/lib/common";

@ApiTags("Card Details")
@Controller("card-details")
export class CardDetailsController {
  constructor(
    private readonly crudService: CrudService,
    private readonly listService: ListService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Create new card details" })
  @ApiResponse({
    status: 201,
    description: "Card details successfully created",
    example: example_card_detail,
  })
  async create(@Auth() user: User, @Body() data: CreateCardDetailDto) {
    return this.crudService.create({ data, user });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get list of all card details" })
  @ApiResponse({
    status: 200,
    description: "Returns list of card details",
    example: example_card_details_list_result,
  })
  async findAll(@Auth() user: User, @Query() filters: CardDetailsFiltersDto) {
    return this.listService.findAll({ user, filters });
  }

  @Get(":id")
  @ApiOperation({ summary: "Get card details by ID" })
  @ApiResponse({
    status: 200,
    description: "Returns card details",
    example: example_card_detail,
  })
  @ApiResponse({ status: 404, description: "Card details not found" })
  async findOne(@Auth() user: User, @Param("id", ParseUUIDPipe) id: string) {
    return this.crudService.findOne({ where: { id }, user });
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Update card details" })
  @ApiResponse({
    status: 200,
    description: "Card details successfully updated",
    example: example_card_detail,
  })
  @ApiResponse({ status: 404, description: "Card details not found" })
  async update(
    @Auth() user: User,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() data: UpdateCardDetailDto,
  ) {
    return this.crudService.update({ id, data, user });
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Delete card details" })
  @ApiResponse({
    status: 200,
    description: "Card details successfully deleted",
  })
  @ApiResponse({ status: 404, description: "Card details not found" })
  async remove(@Auth() user: User, @Param("id", ParseUUIDPipe) id: string) {
    return this.crudService.remove({ id, user });
  }
}
