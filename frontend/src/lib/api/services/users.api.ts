import { api, createFormData, AxiosResponse, formatQueryPath } from '@/lib/api';
import type { Prisma, UpdateUser, AdminUpdateUser, UserWithoutPassword } from '@shared/src';
import { IGetApi, GetApi } from './get.api';

/**
 * API для работы с пользователями
 */
export class UsersApi extends GetApi<'USER'> implements IGetApi<'USER'> {
  constructor() { super('USER') }
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