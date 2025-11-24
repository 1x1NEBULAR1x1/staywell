import {
  Controller,
  Get,
  UseGuards,
  Body,
  Query,
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminOnly, Auth, ImageUploadInterceptor, JwtAuthGuard } from 'src/lib/common';
import { Prisma, User } from '@shared/src/database';
import { UsersFiltersDto, AdminUpdateUserDto, UpdateUserDto } from './dto';
import { ListService, CrudService } from './services';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly listService: ListService,
    private readonly crudService: CrudService,
  ) { }

  @Get('find')
  @AdminOnly()
  async findOne(@Query() where: Prisma.UserWhereUniqueInput) {
    return this.crudService.findOne(where);
  }

  @Get()
  @AdminOnly()
  async findAll(@Query() filters: UsersFiltersDto) {
    return this.listService.findAll(filters);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async me(@Auth() auth: User) {
    return this.crudService.findOne({ id: auth.id });
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ImageUploadInterceptor)
  @ApiBearerAuth()
  async update(
    @Auth() auth: User,
    @Query() where: Prisma.UserWhereUniqueInput,
    @Body() data: UpdateUserDto | AdminUpdateUserDto,
    @UploadedFile() file?: Express.Multer.File | null
  ) {
    return this.crudService.update({ auth, data, where, file });
  }
}
