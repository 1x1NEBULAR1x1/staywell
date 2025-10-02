import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/lib/prisma";
import {
  TransferDetail,
  Prisma,
  User,
  Role,
  SAFE_USER_SELECT
} from "@shared/src";
import { TransferDetailsFiltersDto } from "../dto";

/**
 * Service for retrieving lists of bank transfer details with filtering and pagination
 */
@Injectable()
export class ListService {
  constructor(private readonly prisma: PrismaService) { }

  customFilters(
    options: TransferDetailsFiltersDto,
  ): Prisma.TransferDetailWhereInput {
    const { user_id, bank_name, account_number, swift, payer_name } = options;
    const filters: Prisma.TransferDetailWhereInput = {};
    if (user_id) filters.user_id = user_id;
    if (bank_name)
      filters.bank_name = { contains: bank_name, mode: "insensitive" };
    if (account_number)
      filters.account_number = {
        contains: account_number,
        mode: "insensitive",
      } as Prisma.StringFilter;
    if (swift) filters.swift = { contains: swift, mode: "insensitive" };
    if (payer_name)
      filters.payer_name = { contains: payer_name, mode: "insensitive" };
    return filters;
  }
  /**
   * Find all transfer details with filtering and pagination
   * @param filters - Query parameters for filtering and pagination
   * @returns Paginated list of transfer details with total count
   */
  async findAll({
    user,
    filters,
  }: {
    filters: TransferDetailsFiltersDto;
    user: User;
  }) {
    const final_filters =
      user.role === Role.ADMIN ? filters : { ...filters, user_id: user.id };
    const query_options = this.prisma.buildQuery<TransferDetail>(
      final_filters,
      "created",
      "created",
      this.customFilters,
    );
    const { items, total } =
      await this.prisma.findWithPagination<TransferDetail>(
        this.prisma.transferDetail,
        query_options,
        { user: { select: SAFE_USER_SELECT } },
      );
    return {
      items,
      total,
      skip: query_options.skip,
      take: query_options.take,
    };
  }
}
