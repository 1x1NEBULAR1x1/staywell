import { PrismaService } from "src/lib/prisma";
import { Injectable } from "@nestjs/common";
import { UsersFiltersDto } from "../dto";
import { User, Prisma } from "@shared/src/database";
import { BaseListResult } from "@shared/src/common/base-types";
import { UserWithoutPassword } from "@shared/src/types/users-section";

@Injectable()
export class ListService {
  constructor(private readonly prisma: PrismaService) { }

  customFilters = (options: UsersFiltersDto) => {
    const {
      role,
      is_active,
      email,
      search,
      phone_number,
      phone_verified,
      email_verified,
    } = options;
    const filters: Prisma.UserWhereInput = {};
    if (role) filters.role = role;
    if (email_verified !== undefined) filters.email_verified = email_verified;
    if (phone_verified !== undefined) filters.phone_verified = phone_verified;
    if (is_active !== undefined && is_active !== null)
      filters.is_active = is_active;
    if (email && email.trim().length > 0)
      filters.email = { contains: email.trim(), mode: "insensitive" };
    if (search && search.trim().length > 0) {
      filters.OR = [
        { first_name: { contains: search.trim(), mode: "insensitive" } },
        { last_name: { contains: search.trim(), mode: "insensitive" } },
        { email: { contains: search.trim(), mode: "insensitive" } },
        { phone_number: { contains: search.trim(), mode: "insensitive" } },
      ];
    }
    if (phone_number && phone_number.trim().length > 0)
      filters.phone_number = phone_number;
    return filters;
  };
  async findAll({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    is_excluded,
    ...filters
  }: UsersFiltersDto): Promise<BaseListResult<UserWithoutPassword>> {
    const query_options = this.prisma.buildQuery<UserWithoutPassword>(
      filters,
      "created",
      "created",
      this.customFilters,
    );
    const { items, total } = await this.prisma.findWithPagination<User>(
      this.prisma.user,
      query_options,
    );
    return {
      items: items.map((item: User) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password_hash, ...user } = item;
        return user;
      }) as UserWithoutPassword[],
      total,
      skip: filters.skip,
      take: filters.take,
    };
  }
}
