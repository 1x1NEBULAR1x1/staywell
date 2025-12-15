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
 * API for working with users
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
   * Update user
   * @param where - Condition for user update
   * @param user - Data for user update
   * @returns User update result, loading and error
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
