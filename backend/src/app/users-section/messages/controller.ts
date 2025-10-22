import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
  Put,
} from "@nestjs/common";
import { CrudService, ListService } from "./services";
import { CreateMessageDto, UpdateMessageDto, MessagesFiltersDto } from "./dto";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtAuthGuard, Auth } from "src/lib/common";
import { User } from "@shared/src/database";

@ApiTags("Messages")
@Controller("messages")
export class MessagesController {
  constructor(
    private readonly listService: ListService,
    private readonly crudService: CrudService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Create a new message" })
  @ApiResponse({ status: 201, description: "Message created successfully" })
  create(@Auth() user: User, @Body() data: CreateMessageDto) {
    return this.crudService.create({ user, data });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get all messages" })
  @ApiResponse({ status: 200, description: "Return all messages" })
  findAll(@Auth() user: User, @Query() filters: MessagesFiltersDto) {
    return this.listService.findAll({ filters, user });
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get a message by ID" })
  @ApiResponse({ status: 200, description: "Return the message" })
  @ApiResponse({ status: 404, description: "Message not found" })
  findOne(@Auth() user: User, @Param("id", ParseUUIDPipe) id: string) {
    return this.crudService.findOne({ id, user });
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Update a message" })
  @ApiResponse({ status: 200, description: "Message updated successfully" })
  @ApiResponse({ status: 404, description: "Message not found" })
  update(
    @Auth() user: User,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() data: UpdateMessageDto,
  ) {
    return this.crudService.update({ id, user, data });
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Delete a message" })
  @ApiResponse({ status: 200, description: "Message deleted successfully" })
  @ApiResponse({ status: 404, description: "Message not found" })
  remove(@Auth() user: User, @Param("id", ParseUUIDPipe) id: string) {
    return this.crudService.remove({ id, user });
  }
}

