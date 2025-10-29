import {
  Controller,
  Get,
  UseGuards,
  Patch,
  Body,
  Query,
  Put,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminOnly, JwtAuthGuard, Roles, RolesGuard } from 'src/lib/common';
import { Role, Prisma } from '@shared/src/database';
import { UsersFiltersDto, UpdateUserDto, AdminUpdateUserDto } from './dto';
import { ListService, CrudService } from './services';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly listService: ListService,
    private readonly crudService: CrudService,
  ) {}

  @Get('find')
  @AdminOnly()
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiResponse({ status: 200, description: 'Данные пользователя' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async findOne(@Query() where: Prisma.UserWhereUniqueInput) {
    return this.crudService.findOne(where);
  }

  @Get()
  @AdminOnly()
  @ApiOperation({
    summary: 'Получить всех пользователей (только для администраторов)',
  })
  @ApiResponse({ status: 200, description: 'Список пользователей' })
  async findAll(@Query() filters: UsersFiltersDto) {
    return this.listService.findAll(filters);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить данные текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Данные пользователя' })
  async me(@Req() req: Request & { user: { id: string } }) {
    return this.crudService.findOne({ id: req.user.id });
  }

  @Patch('')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить данные пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь обновлен' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async update(
    @Query() where: Prisma.UserWhereUniqueInput,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.crudService.update(where, updateUserDto);
  }

  @Put('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить данные пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь обновлен' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async adminUpdate(
    @Query() where: Prisma.UserWhereUniqueInput,
    @Body() updateUserDto: AdminUpdateUserDto,
  ) {
    return this.crudService.update(where, updateUserDto);
  }
}
