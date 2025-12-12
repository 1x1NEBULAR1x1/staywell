import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { BaseFiltersOptions, SortDirection } from '@shared/src/common';
import { PrismaClient } from '@shared/src/database';

/**
 * Service for interacting with the database through Prisma ORM
 * Provides methods for building queries based on filter options
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
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
   * Filters an object to include only properties that exist on the model type T
   * @param obj Object to filter
   * @param valid_keys Array of valid property keys for type T
   * @returns Filtered object containing only valid properties
   */
  private filterValidFields<T extends Record<string, unknown>>(
    obj: Record<string, unknown>,
    valid_keys: string[],
  ): Partial<T> {
    const result: Partial<T> = {};

    for (const key of valid_keys) {
      if (
        key in obj &&
        obj[key] !== undefined &&
        obj[key] !== null &&
        obj[key] !== ''
      ) {
        result[key as keyof T] = obj[key] as T[keyof T];
      }
    }

    return result;
  }

  /**
   * Builds a Prisma query based on filter options
   * @param options Base filter options including pagination and sorting
   * @param default_sort Default field to sort by if not specified in options
   * @param date_field Field name to use for date filtering (default: 'created')
   * @param custom_filters Additional custom filter transformations
   * @returns Object with skip, take, where and orderBy parameters for Prisma queries
   */
  buildQuery<T extends { id: string; created: Date }>({
    filters,
    default_sort_field = 'created',
    date_field = 'created',
    customFilters,
  }: {
    filters: BaseFiltersOptions<T>;
    default_sort_field?: keyof T;
    date_field?: keyof T;
    customFilters?: (query: BaseFiltersOptions<T>) => Record<string, unknown>;
  }): {
    skip: number;
    take: number;
    where: Partial<T>;
    order_by: { [key: string]: SortDirection };
  } {
    const {
      skip: skip_value = 0,
      take: take_value = 10,
      sort_field = default_sort_field,
      sort_direction = SortDirection.desc,
      start_date,
      end_date,
      ...query
    } = filters;

    const skip = Number(skip_value);
    const take = Number(take_value);

    // Clean empty strings and undefined values and filter only valid model fields
    const cleanFilters = Object.fromEntries(
      Object.entries(query).filter(([, value]: [string, unknown]) => {
        // Exclude empty strings, undefined, null
        if (value === undefined || value === null || value === '') return false;
        // Also check for empty strings after trim()
        if (typeof value === 'string' && value.trim() === '') return false;
        return true;
      }),
    );

    // Filter out only fields that exist on the model T
    const validModelFields = Object.keys({} as T);
    let where: Partial<T> = this.filterValidFields(
      cleanFilters,
      validModelFields,
    );

    if (customFilters)
      where = { ...where, ...customFilters({ skip, take, ...query }) };

    if (start_date || end_date) {
      const dateFilters: Record<string, unknown> = {};

      if (start_date && end_date) {
        dateFilters[String(date_field)] = { gte: start_date, lte: end_date };
      } else if (start_date) {
        dateFilters[String(date_field)] = { gte: start_date };
      } else if (end_date) {
        dateFilters[String(date_field)] = { lte: end_date };
      }
      where = { ...where, ...dateFilters };
    }

    if ('skip' in where) delete where.skip;
    if ('take' in where) delete where.take;
    if ('search' in where) delete where.search;

    return {
      skip,
      take,
      where,
      order_by: { [sort_field ?? default_sort_field]: sort_direction },
    };
  }

  /**
   * Getting data with pagination and total count
   * @param model Prisma model (e.g., 'user', 'transaction')
   * @param query_options Query parameters including skip, take, where, orderBy
   * @param include Relationships to include in the results
   * @returns Object with items and total count
   */
  async findWithPagination<T>({
    model,
    query_options,
    include = {},
  }: {
    model: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      findMany: Function;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      count: Function;
    };
    query_options: {
      skip: number;
      take: number;
      where: unknown;
      order_by: { [key: string]: SortDirection };
    };
    include?: Record<string, unknown>;
  }): Promise<{ items: T[]; total: number }> {
    const { skip, take, where, order_by } = query_options;

    if (where && typeof where === 'object') {
      if ('skip' in where) delete where.skip;
      if ('take' in where) delete where.take;
      if ('search' in where) delete where.search;
    }

    const [items, count] = (await Promise.all([
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      model.findMany({
        skip,
        take,
        where,
        orderBy: order_by,
        include,
      }),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      model.count({ where }),
    ])) as [T[], number];

    return {
      items,
      total: count,
    };
  }
}
