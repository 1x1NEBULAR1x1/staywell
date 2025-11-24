import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { Prisma, Role, User } from '@shared/src/database';
import { AdminUpdateUserDto, UpdateUserDto } from '../dto';
import * as argon2 from 'argon2';
import { USER_WITHOUT_PASSWORD_SELECT } from '@shared/src';
import { FilesService } from 'src/lib/files';

@Injectable()
export class CrudService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService
  ) { }

  async findOne(
    where: Prisma.UserWhereUniqueInput,
    check_only: boolean = false,
  ) {
    const user = await this.prisma.user.findUnique({
      where,
      select: USER_WITHOUT_PASSWORD_SELECT,
    });

    if (!user && !check_only)
      throw new NotFoundException('User not found');

    return user;
  }

  async update({ auth, data, where, file }: {
    where: Prisma.UserWhereUniqueInput,
    data: UpdateUserDto | AdminUpdateUserDto,
    auth: User,
    file?: Express.Multer.File | null
  }) {
    if ('file' in data && data.file) delete data.file;
    if (!where || Object.keys(where).length === 0)
      throw new BadRequestException('No parameters provided for user search for update');

    // Check if user exists
    await this.findOne(where);

    if (auth.role !== Role.ADMIN && auth.id !== where.id)
      throw new ForbiddenException('You are not allowed to make this operation');

    const image = file ? this.filesService.saveImage({ file, dir_name: 'USERS' }) : data.image;
    // If password is provided, hash it
    const update_data: (UpdateUserDto | AdminUpdateUserDto) & {
      hashed_password?: string;
    } = { ...data };
    if (update_data.hashed_password) {
      update_data.hashed_password = await this.hashPassword(update_data.hashed_password);
      delete update_data.hashed_password;
    }

    // Check if email is already taken
    if ('email' in update_data && update_data.email) {
      const existing_user = await this.prisma.user.findUnique({
        where: { email: update_data.email },
      });

      if (existing_user && existing_user.id !== where.id)
        throw new BadRequestException('This email is already taken');
    }

    // Update user
    const updated_user = await this.prisma.user.update({
      where,
      data: { ...data, date_of_birth: data.date_of_birth ? new Date(data.date_of_birth) : undefined, image },
      select: USER_WITHOUT_PASSWORD_SELECT,
    });

    return updated_user;
  }

  private async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }
}
