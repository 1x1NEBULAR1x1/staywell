import { GETTABLE_NAMES, GettableTypes } from '@shared/src';
import { getDebounceableFields } from './lib/utils';
import { useFilters, UseFiltersOptions, UseFiltersReturn } from './lib/useFilters';

export interface ModelFiltersOptions<M extends GETTABLE_NAMES> extends UseFiltersOptions<GettableTypes<M>['filters']> {
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
}: ModelFiltersOptions<M>): UseFiltersReturn<GettableTypes<M>['filters']> => useFilters<GettableTypes<M>['filters']>({
  ...props,
  debounce_settings: {
    delay: debounce_settings.delay,
    fields: getDebounceableFields(model)
  },
});