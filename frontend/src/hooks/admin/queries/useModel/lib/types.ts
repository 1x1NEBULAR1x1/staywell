import { UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { BaseListResult } from '@shared/src';
import { CRUDDABLE_NAMES, CruddableTypes, GETTABLE_NAMES, GettableTypes } from '@shared/src';
import { AxiosResponse } from '@/lib/api';

/**
 * Options for get query operations
 */
export type GetQueryOptions<M extends GETTABLE_NAMES> = {
  enabled?: boolean;
  initial_data?: { data: BaseListResult<GettableTypes<M>['model']> };
};

/**
 * Options for find query operations
 */
export type FindQueryOptions<M extends GETTABLE_NAMES> = {
  enabled?: boolean;
  initial_data?: { data: GettableTypes<M>['model'] }
};

/**
 * Generic cached data structure for a single item
 */
export interface CachedItem<T> {
  data: T;
}

/**
 * Generic cached data structure for a list of items
 */
export interface CachedList<T> {
  data: {
    items: T[];
    total: number;
    take: number;
    skip: number;
  };
}

/**
 * Type of query context for optimistic updates
 */
export type MutationContext<T> = {
  previous_data?: CachedItem<T>;
};

/**
 * Generic mutation types for operations
 */
export type Mutation<M extends CRUDDABLE_NAMES, T extends 'create' | 'update' | 'delete'> = UseMutationResult<
  AxiosResponse<CruddableTypes<M>["model"], unknown>,
  Error,
  T extends 'delete' ? void : CruddableTypes<M>[T extends keyof CruddableTypes<M> ? T : never],
  MutationContext<CruddableTypes<M>["model"]>
>;

/**
 * UseModel hook interface for gettable-only models
 */
export type UseModelGettableOnly<M extends GETTABLE_NAMES> = {
  get: (filters: GettableTypes<M>['filters'], options?: GetQueryOptions<M>) => UseQueryResult<BaseListResult<GettableTypes<M>['model']>, Error>;
  find: (id: string, options?: FindQueryOptions<M>) => UseQueryResult<GettableTypes<M>['model'], Error>;
};

/**
 * UseModel hook interface for cruddable models
 */
export type UseModelCruddable<M extends CRUDDABLE_NAMES> = UseModelGettableOnly<M> & {
  create: () => Mutation<M, 'create'>;
  update: (id: string) => Mutation<M, 'update'>;
  delete: (id: string) => Mutation<M, 'delete'>;
};

/**
 * Union type for all UseModel interfaces
 */
export type UseModel<M extends GETTABLE_NAMES> = M extends CRUDDABLE_NAMES
  ? UseModelCruddable<M>
  : UseModelGettableOnly<M>;