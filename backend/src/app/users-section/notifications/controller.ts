import {
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Body,
  Param,
  Put,
  Delete,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { CrudService, ListService } from './services';
import { AdminOnly, Auth, JwtAuthGuard } from 'src/lib/common';
import { User } from '@shared/src/database';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
  NotificationsFiltersDto,
} from './dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly crudService: CrudService, private readonly listService: ListService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(@Auth() user: User, @Query() filters: NotificationsFiltersDto) {
    return await this.listService.list({ user, filters });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async find(@Auth() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return await this.crudService.find({ id, user });
  }

  @Post()
  @AdminOnly()
  async create(@Body() data: CreateNotificationDto) {
    return await this.crudService.create({ data });
  }

  @Put(':id')
  @AdminOnly()
  async update(
    @Auth() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateNotificationDto,
  ) {
    return await this.crudService.update({ id, data, user });
  }

  @Patch('/mark-as-read')
  @UseGuards(JwtAuthGuard)
  async markAsRead(@Auth() user: User, @Body() { ids }: { ids: string[] }): Promise<{ count: number }> {
    return await this.crudService.markAsRead({ ids, user });
  }

  @Delete(':id')
  @AdminOnly()
  async delete(@Auth() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return await this.crudService.delete({ id, user });
  }
}
