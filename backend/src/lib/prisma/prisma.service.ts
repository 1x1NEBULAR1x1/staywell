import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { BaseFiltersOptions, SortDirection } from "@shared/src/common";
import { PrismaClient } from "@shared/src/database";

/**
 * Service for interacting with the database through Prisma ORM
 * Provides methods for building queries based on filter options
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Builds a Prisma query based on filter options
   * @param options Base filter options including pagination and sorting
   * @param default_sort Default field to sort by if not specified in options
   * @param date_field Field name to use for date filtering (default: 'created')
   * @param custom_filters Additional custom filter transformations
   * @returns Object with skip, take, where and orderBy parameters for Prisma queries
   */
  buildQuery<T extends { id: string }>(
    options: BaseFiltersOptions<T>,
    default_sort_field: keyof T = "created" as keyof T,
    date_field: keyof T = "created" as keyof T,
    customFilters?: (options: BaseFiltersOptions<T>) => Record<string, unknown>,
  ): {
    skip: number;
    take: number;
    where: Partial<T>;
    order_by: Record<string, string>;
  } {
    const {
      skip: skip_value = 0,
      take: take_value = 10,
      sort_field = default_sort_field,
      sort_direction = SortDirection.desc,
      start_date,
      end_date,
      ...filters
    } = options;

    const skip = Number(skip_value);
    const take = Number(take_value);

    if ("skip" in filters) delete filters.skip;
    if ("take" in filters) delete filters.take;

    // Фильтруем пустые строки и undefined значения
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([, value]: [string, unknown]) => {
        // Исключаем пустые строки, undefined, null
        if (value === undefined || value === null || value === "") return false;
        // Для строк также проверяем после trim()
        if (typeof value === "string" && value.trim() === "") return false;
        return true;
      }),
    );

    let where: Partial<T> = cleanFilters as Partial<T>;

    if (customFilters) where = { ...where, ...customFilters(options) };

    if (start_date || end_date) {
      const dateFilters: Record<string, unknown> = {};

      if (start_date && end_date) {
        dateFilters[date_field as string] = { gte: start_date, lte: end_date };
      } else if (start_date) {
        dateFilters[date_field as string] = { gte: start_date };
      } else if (end_date) {
        dateFilters[date_field as string] = { lte: end_date };
      }
      where = { ...where, ...dateFilters };
    }

    return {
      skip,
      take,
      where,
      order_by: sort_field ? { [sort_field]: sort_direction } : { [default_sort_field]: sort_direction }
    };
  }

  /**
   * Getting data with pagination and total count
   * @param model Prisma model (e.g., 'user', 'transaction')
   * @param query_options Query parameters including skip, take, where, orderBy
   * @param include Relationships to include in the results
   * @returns Object with items and total count
   */
  async findWithPagination<T = any>(
    model: {
      findMany: (options: any) => Promise<T[]>;
      count: (options: any) => Promise<number>;
    },
    query_options: {
      skip: number;
      take: number;
      where: unknown;
      order_by: unknown;
    },
    include: Record<string, unknown> = {},
  ): Promise<{ items: T[]; total: number }> {
    const { skip, take, where, order_by } = query_options;

    if (where && typeof where === "object") {
      if ("skip" in where) delete where.skip;
      if ("take" in where) delete where.take;
      if ("search" in where) delete where.search;
    }

    const [items, count] = await Promise.all([
      model.findMany({
        skip,
        take,
        where,
        orderBy: order_by,
        include,
      }),
      model.count({ where }),
    ]);

    return {
      items: items,
      total: count,
    };
  }
}
