import { query_client } from "@/lib/api";
import { CRUDDABLE_NAMES } from "@shared/src";
import { QUERY_KEYS } from "./query-keys";
import { CachedItem, CachedList, MutationContext } from "./types";
import { useToast } from "@/hooks/common/useToast";
/**
 * Prepares context for optimistic updates
 */
export async function prepareOptimisticUpdate<M extends CRUDDABLE_NAMES, T>({ model, id }: { model: M; id: string }): Promise<MutationContext<T>> {
  // Cancel in-flight queries to prevent race conditions
  await query_client.cancelQueries({ queryKey: QUERY_KEYS(model).find(id) });
  // Save current cache state
  return { previous_data: query_client.getQueryData<CachedItem<T>>(QUERY_KEYS(model).find(id)) };
}
/**
 * Updates cache with optimistic data
 */
export function optimisticUpdateCache<M extends CRUDDABLE_NAMES, T>({ model, id, updateFn }: { model: M; id: string; updateFn: (oldData: CachedItem<T> | undefined) => CachedItem<T> | undefined }) {
  query_client.setQueryData<CachedItem<T>>(QUERY_KEYS(model).find(id), updateFn);
}
/**
 * Updates list cache by removing an item
 */
export function optimisticRemoveFromList<M extends CRUDDABLE_NAMES, T extends { id: string }>({ model, id }: { model: M; id: string; }) {
  // Type-safe update function for the list
  const updateListData = (old: CachedList<T> | undefined): CachedList<T> | undefined =>
    !old?.data.items
      ? old
      : { ...old, data: { ...old.data, items: old.data.items.filter(item => item.id !== id) } };

  query_client.setQueriesData<CachedList<T>>({ queryKey: QUERY_KEYS(model).get() }, updateListData);
}

interface HandleMutationExecutionProps<T> {
  error?: Error;
  context?: MutationContext<T>;
  model: CRUDDABLE_NAMES;
  id?: string;
  status?: number;
  operation: 'update' | 'delete' | 'create' | 'restore';
}
/**
 * Handles error in mutation with rollback
 */
export function handleMutationError<T>({ error, context, model, id, operation, status }: HandleMutationExecutionProps<T>) {
  const toast = useToast()

  // Rollback on error if previous data exists
  if (id && context?.previous_data)
    query_client.setQueryData(QUERY_KEYS(model).find(id), context.previous_data);
  toast.error(error
    ? `Error ${status}`
    : 'Success'
  )
}

export const getUpdateOperation = (data: object) => ("is_excluded" in data && !data.is_excluded) ? 'update' : "restore"