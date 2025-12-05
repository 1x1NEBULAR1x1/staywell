import type { GETTABLE_NAMES, GettableTypes } from "@shared/src";
import {
  type UseFiltersOptions,
  type UseFiltersReturn,
  useFilters,
} from "./lib/useFilters";
import { getDebounceableFields } from "./lib/utils";

export interface ModelFiltersOptions<M extends GETTABLE_NAMES>
  extends UseFiltersOptions<GettableTypes<M>["filters"]> {
  model: M;
}

/**
 * Hook for managing model filters with debounce support
 * @param model Model name
 * @param options Filter and debounce configuration options
 */
export const useModelFilters = <M extends GETTABLE_NAMES>({
  debounce_settings = { delay: 500, fields: [] },
  model,
  ...props
}: ModelFiltersOptions<M>): UseFiltersReturn<GettableTypes<M>["filters"]> =>
  useFilters<GettableTypes<M>["filters"]>({
    ...props,
    debounce_settings: {
      delay: debounce_settings.delay,
      fields: getDebounceableFields(model),
    },
  });
