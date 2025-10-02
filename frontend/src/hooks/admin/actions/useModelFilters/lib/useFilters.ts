import { useState, useMemo, useEffect, useRef } from 'react';
import { hasField, getStringValue } from './utils';
import type { BaseFiltersOptions } from '@shared/src';
import { DebounceableSettings } from './types';

/**
 * Options for useFilters hook
 */
export interface UseFiltersOptions<B extends BaseFiltersOptions<{ id: string, [key: string]: unknown }>> {
  default_filters?: B;
  debounce_settings?: DebounceableSettings;
  permanent_fields?: Partial<{ [key in keyof B]: unknown; }>;
}

/**
 * Return type for useFilters hook
 */
export interface UseFiltersReturn<B extends BaseFiltersOptions<{ id: string, [key: string]: unknown }>> {
  /** Current filter values */
  filters: B;
  /** Debounced filter values (use for API calls) */
  debounced_filters: B;
  /** Current page number (1-based) */
  current_page: number;
  /** Update filters with new values */
  updateFilters: (new_filters: Partial<B>) => void;
  /** Reset filters to default values */
  resetFilters: () => void;
  /** Set current page */
  setPage: (page: number) => void;
}

/**
 * Simple debounce function that returns a debounced version of a setter
 */
function useDebouncedState<T>(initialValue: T, delay: number = 500): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setDebouncedValue = (newValue: T) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setValue(newValue);
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [delay]);

  return [value, setDebouncedValue];
}

/**
 * Universal hook for managing filters with debounce support
 */
export function useFilters<B extends BaseFiltersOptions<{ id: string, [key: string]: unknown }>>({
  default_filters,
  permanent_fields,
  debounce_settings = { fields: [], delay: 1000 },
}: UseFiltersOptions<B>): UseFiltersReturn<B> {
  // Мемоизируем permanent_fields чтобы избежать бесконечного рендеринга
  const memoized_permanent_fields = useMemo(() => permanent_fields || {}, [permanent_fields]);

  // Create initial filters by merging defaults with permanent fields
  // Filter state
  const [filters, setFilters] = useState<B>(Object.assign({ skip: 0, take: 10 }, default_filters, memoized_permanent_fields));

  // Create debounced values for each field
  const debounced_values = useMemo(() => {
    const result: Record<string, string> = {};
    debounce_settings.fields.forEach((field) => {
      if (hasField(filters, field)) {
        result[field] = getStringValue(filters, field);
      }
    });
    return result;
  }, [filters, debounce_settings.fields]);

  // Use debounced state for each field
  const [final_debounced_values, setFinalDebouncedValues] = useDebouncedState(debounced_values, debounce_settings.delay || 1000);

  // Update debounced values when source values change
  // useEffect(() => { // TODO: fix rerender
  //   setFinalDebouncedValues(debounced_values);
  // }, [debounced_values]);

  // Create filters with debounced values
  const debounced_filters = useMemo(() => {
    // Start with a fresh copy of filters
    const result = Object.assign({}, filters);
    // Apply permanent fields
    Object.entries(memoized_permanent_fields).forEach(([key, value]) =>
      Object.assign(result, { [key]: value }));
    // Apply debounced values to result
    Object.entries(final_debounced_values).forEach(([field, value]) =>
      hasField(result, field) && Object.assign(result, { [field]: value }));
    return result;

  }, [filters, final_debounced_values, memoized_permanent_fields]);

  /**
   * Update filters with partial new values
   * @param new_filters New filter values to apply
   */
  const updateFilters = (new_filters: Partial<B>): void => {
    setFilters(prev => {
      // If page size changes, recalculate skip for proper pagination
      let updated_filters = { ...new_filters };
      if (new_filters.take !== undefined && new_filters.take !== prev.take) {
        const current_page = Math.floor((prev.skip || 0) / (prev.take || 10)) + 1;
        updated_filters.skip = (current_page - 1) * new_filters.take;
      } else if (new_filters.skip === undefined) {
        // Check if any non-pagination filter has changed
        const has_filter_changed = Object.keys(new_filters).some(key =>
          key !== 'take' &&
          key !== 'skip' &&
          key in prev &&
          (new_filters as any)[key] !== (prev as any)[key]
        );
        if (has_filter_changed) updated_filters.skip = 0;
      }
      return Object.assign({}, prev, updated_filters, memoized_permanent_fields);
    });
  };
  /**
   * Reset filters to defaults
   */
  const resetFilters = (): void => setFilters(Object.assign({ skip: 0, take: 10 }, default_filters, memoized_permanent_fields));
  /**
   * Set current page
   * @param page Page number (1-based)
   */
  const setPage = (page: number): void => {
    const new_skip = (page - 1) * (filters.take);
    setFilters(prev => Object.assign({}, prev, { skip: new_skip }));
  };
  return {
    filters,
    debounced_filters,
    current_page: Math.floor((filters.skip || 0) / (filters.take || 10)) + 1,
    updateFilters,
    resetFilters,
    setPage,
  };
} 