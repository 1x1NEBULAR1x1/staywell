import { CrudApi, query_client } from "@/lib/api";
import { AxiosResponse, isAxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { CachedList, MutationContext } from "./types";
import { optimisticUpdateCache, prepareOptimisticUpdate, handleMutationError, optimisticRemoveFromList, getUpdateOperation } from "./utils";
import { QUERY_KEYS } from "./query-keys";
import { CruddableTypes, CRUDDABLE_NAMES } from "@shared/src";
/**
 * Create mutation factory for updating items
 */
export function createUpdateMutation<M extends CRUDDABLE_NAMES>({ api, model, id }: { api: CrudApi<M>, model: M, id: string }) {
  return useMutation<
    AxiosResponse<CruddableTypes<M>["model"], unknown>,
    Error,
    CruddableTypes<M>["update"],
    MutationContext<CruddableTypes<M>["model"]>
  >({
    mutationFn: (data: CruddableTypes<M>['update']) => api.update(id, data),
    onMutate: async (new_data) => {
      const context = await prepareOptimisticUpdate<M, CruddableTypes<M>["model"]>({ model, id });
      // Optimistically update cache
      optimisticUpdateCache<M, CruddableTypes<M>["model"]>({
        model,
        id,
        updateFn: (old) => !old ? old : { ...old, data: { ...old.data, ...new_data } }
      });

      return context;
    },
    onError: (error, data, context) => handleMutationError({ error, context, model, id, operation: getUpdateOperation(data), status: isAxiosError(error) ? error.status : undefined })
  });
}
/**
 * Create mutation factory for creating items
 */
export function createCreateMutation<M extends CRUDDABLE_NAMES>({ api, model }: { api: CrudApi<M>, model: M }) {
  return useMutation<
    AxiosResponse<CruddableTypes<M>["model"], unknown>,
    Error,
    CruddableTypes<M>["create"],
    MutationContext<CruddableTypes<M>["model"]>
  >({
    mutationFn: (data: CruddableTypes<M>['create']) => api.create(data),
    onSuccess: (response) => {
      const new_item = response.data;
      // Update the cache with the new item
      query_client.setQueryData(QUERY_KEYS(model).find(new_item.id), { data: new_item });
      // Update lists that might contain this item
      query_client.setQueriesData(
        { queryKey: QUERY_KEYS(model).get() },
        (old: CachedList<CruddableTypes<M>["model"]>) =>
          !old?.data?.items
            ? old
            : { ...old, data: { ...old.data, items: [new_item, ...old.data.items] } }
      );
    },
    onError: (error, _, context) => handleMutationError({ error, context, model, id: '', operation: 'create', status: isAxiosError(error) ? error.status : undefined })
  });
}
/**
 * Create mutation factory for deleting items
 */
export function createDeleteMutation<M extends CRUDDABLE_NAMES>({ api, model, id }: { api: CrudApi<M>, model: M, id: string }) {
  return useMutation<
    AxiosResponse<CruddableTypes<M>["model"], unknown>,
    Error,
    void,
    MutationContext<CruddableTypes<M>["model"]>
  >({
    mutationFn: () => api.delete(id),
    onMutate: async () => {
      const context = await prepareOptimisticUpdate<M, CruddableTypes<M>["model"]>({ model, id });
      // Optimistically remove from cache
      query_client.setQueryData(QUERY_KEYS(model).find(id), null);
      // Update list cache by removing the item
      optimisticRemoveFromList<M, CruddableTypes<M>["model"]>({ model, id });
      return context;
    },
    onError: (error, _, context) => handleMutationError({ error, context, model, id, operation: 'delete', status: isAxiosError(error) ? error.status : undefined })
  });
}