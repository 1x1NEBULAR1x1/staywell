import type {
  AdminUpdateUser,
  BaseListResult,
  UpdateUser,
  UsersFilters,
  UserWithoutPassword,
} from "@shared/src";
import type { Prisma } from "@shared/src/database";
import type { AxiosHeaders } from "axios";
import {
  type AxiosResponse,
  api,
  createFormData,
  formatQueryPath,
} from "@/lib/api";

/**
 * API для работы с пользователями
 */
export class UsersApi {
  endpoint = `${process.env.NEXT_PUBLIC_API_URL}/users`;

  async me(
    headers?: AxiosHeaders,
  ): Promise<AxiosResponse<UserWithoutPassword>> {
    return await api.get<UserWithoutPassword>(`${this.endpoint}/me`, {
      headers,
    });
  }

  async find(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<AxiosResponse<UserWithoutPassword | null>> {
    return await api.get<UserWithoutPassword>(
      formatQueryPath(`${this.endpoint}/find`, where),
    );
  }

  async get(
    filters: UsersFilters,
  ): Promise<AxiosResponse<BaseListResult<UserWithoutPassword>>> {
    return await api.get<BaseListResult<UserWithoutPassword>>(
      formatQueryPath(this.endpoint, filters),
    );
  }

  /**
   * Обновление пользователя
   * @param where - Условие для обновления пользователя
   * @param user - Данные для обновления пользователя
   * @returns Результат обновления пользователя, загрузка и ошибка
   */
  async update(
    where: Prisma.UserWhereUniqueInput,
    user: UpdateUser | AdminUpdateUser,
  ): Promise<AxiosResponse<UserWithoutPassword | null>> {
    return await api.put<UserWithoutPassword | null>(
      formatQueryPath(this.endpoint, where),
      ...createFormData(user),
    );
  }
}
