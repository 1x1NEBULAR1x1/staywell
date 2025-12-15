import {
  type CRUDDABLE_NAMES,
  type GETTABLE_NAMES,
  type GettableTypes,
  isCruddableName,
} from "@shared/src";
import { useQuery } from "@tanstack/react-query";
import { CrudApi, GetApi } from "@/lib/api";
import {
  type FindQueryOptions,
  type GetQueryOptions,
  initCreateMutation,
  initDeleteMutation,
  initUpdateMutation,
  QUERY_KEYS,
  type UseModel,
  type UseModelCruddable,
  type UseModelGettableOnly,
} from "./lib";

/**
 * Hook for working with models through API (full CRUD)
 * @param model Model name from CRUDDABLE_NAMES
 * @returns Methods for working with models
 */
export function useModel<M extends CRUDDABLE_NAMES>(
  model: M,
): UseModelCruddable<M>;

/**
 * Hook for working with models through API (read-only)
 * @param model Model name from GETTABLE_NAMES (excluding CRUDDABLE_NAMES)
 * @returns Methods for working with models
 */
export function useModel<M extends GETTABLE_NAMES>(
  model: M,
): UseModelGettableOnly<M>;

/**
 * Hook for working with models through API
 * @param model Model name
 * @returns Methods for working with models
 */
export function useModel<M extends GETTABLE_NAMES>(model: M): UseModel<M> {
  const crudApi = isCruddableName(model) ? new CrudApi(model) : undefined;
  const getApi = new GetApi(model);

  const get = (
    filters: GettableTypes<M>["filters"] = { take: 1000, skip: 0 },
    options?: GetQueryOptions<M>,
  ) => {
    return useQuery({
      queryKey: QUERY_KEYS(model).get(filters),
      queryFn: () => getApi.get(filters),
      select: (data) => data.data,
      enabled: options?.enabled === undefined ? true : options.enabled,
      initialData: options?.initial_data,
    });
  };

  const find = (id: string, options?: FindQueryOptions<M>) => {
    return useQuery({
      queryKey: QUERY_KEYS(model).find(id),
      queryFn: () => getApi.find(id),
      select: (data) => data.data,
      enabled: options?.enabled === undefined ? true : options.enabled,
      initialData: options?.initial_data,
    });
  };

  return isCruddableName(model)
    ? ({
        get,
        find,
        /**
         * Creates record in API
         * @returns Mutation for creating record
         */
        create: crudApi
          ? () => initCreateMutation({ api: crudApi, model })
          : undefined,
        /**
         * Updates record in API
         * @param id - Record ID
         * @returns Mutation for updating record
         */
        update: crudApi
          ? (id: string) => initUpdateMutation({ api: crudApi, model, id })
          : undefined,
        /**
         * Deletes record in API
         * @param id - Record ID
         * @returns Mutation for deleting record
         */
        remove: crudApi
          ? (id: string) => initDeleteMutation({ api: crudApi, model, id })
          : undefined,
      } as unknown as UseModel<M>)
    : ({
        get,
        find,
      } as UseModel<M>);
}
