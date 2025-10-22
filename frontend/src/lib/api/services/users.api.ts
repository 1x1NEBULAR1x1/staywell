import { api, createFormData, AxiosResponse, formatQueryPath } from '@/lib/api';
import type { UpdateUser, AdminUpdateUser, UserWithoutPassword, UsersFilters, BaseListResult } from '@shared/src';
import { Prisma } from '@shared/src/database';

/**
 * API для работы с пользователями
 */
export class UsersApi {
  endpoint = `${process.env.NEXT_PUBLIC_API_URL}/users`;

  async find(where: Prisma.UserWhereUniqueInput): Promise<AxiosResponse<UserWithoutPassword | null>> {
    return await api.get<UserWithoutPassword>(formatQueryPath(`${this.endpoint}/find`, where));
  }

  async get(filters: UsersFilters): Promise<AxiosResponse<BaseListResult<UserWithoutPassword>>> {
    return await api.get<BaseListResult<UserWithoutPassword>>(formatQueryPath(this.endpoint, filters));
  }

  /**
   * Обновление пользователя
   * @param where - Условие для обновления пользователя
   * @param user - Данные для обновления пользователя
   * @returns Результат обновления пользователя, загрузка и ошибка
   */
  async update(where: Prisma.UserWhereUniqueInput, user: UpdateUser | AdminUpdateUser): Promise<AxiosResponse<UserWithoutPassword | null>> {
    return await api.put<UserWithoutPassword | null>(formatQueryPath(this.endpoint, where), ...createFormData(user));
  }
}