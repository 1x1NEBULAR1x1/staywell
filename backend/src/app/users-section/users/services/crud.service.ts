import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "src/lib/prisma";
import { Prisma } from "@shared/src/database";
import { AdminUpdateUserDto, UpdateUserDto } from "../dto";
import * as argon2 from "argon2";
import { USER_WITHOUT_PASSWORD_SELECT, UserWithoutPassword } from "@shared/src";

@Injectable()
export class CrudService {
  constructor(private readonly prisma: PrismaService) { }

  async findOne(
    where: Prisma.UserWhereUniqueInput,
    check_only: boolean = false,
  ) {
    const user = await this.prisma.user.findUnique({
      where,
      select: USER_WITHOUT_PASSWORD_SELECT,
    });

    if (!user && !check_only)
      throw new NotFoundException("Пользователь не найден");

    return user;
  }

  async update(
    where: Prisma.UserWhereUniqueInput,
    updateUserDto: UpdateUserDto | AdminUpdateUserDto,
  ) {
    if (!where || Object.keys(where).length === 0)
      throw new BadRequestException(
        "Не указаны параметры поиска пользователя для обновления",
      );

    // Проверяем существование пользователя
    await this.findOne(where);

    // Если в запросе есть пароль, хешируем его
    const data: (UpdateUserDto | AdminUpdateUserDto) & {
      hashed_password?: string;
    } = { ...updateUserDto };
    if (data.hashed_password) {
      data.hashed_password = await this.hashPassword(data.hashed_password);
      delete data.hashed_password;
    }

    // Проверяем, не занят ли email, если пользователь его меняет

    if ("email" in data && data.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser && existingUser.id !== where.id)
        throw new BadRequestException("Этот email уже занят");
    }

    // Обновляем пользователя
    const updatedUser = await this.prisma.user.update({
      where,
      data,
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        phone_number: true,
        image: true,
        created: true,
        updated: true,
        role: true,
        is_active: true,
        email_verified: true,
        phone_verified: true,
      },
    });

    return updatedUser;
  }

  private async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }
}
