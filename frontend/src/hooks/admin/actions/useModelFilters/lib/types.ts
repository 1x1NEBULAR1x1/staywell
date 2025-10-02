import { GETTABLE_NAMES, GettableTypes } from '@shared/src';
import type { BaseFiltersOptions } from '@shared/src';

type IsDebounceableField<FieldName extends string> =
  FieldName extends `${string}_id`
  ? false
  : FieldName extends keyof BaseFiltersOptions<{ id: string }>
  ? false
  : true;

// Извлекаем только строковые поля из TypeScript типов фильтров
type ExtractStringFilterKeys<T> = T extends Record<string, any>
  ? {
    [K in keyof T]: K extends string
    ? T[K] extends string | undefined
    ? IsDebounceableField<K> extends true
    ? K
    : never
    : never
    : never
  }[keyof T]
  : never;

/**
 * Автоматически сгенерированные поля для debounce функциональности
 * На основе типов фильтров из GettableTypes
 * Включает только строковые поля из всех типов фильтров, исключая:
 * - ID поля (заканчивающиеся на _id)
 * - Базовые поля фильтрации (skip, take, sort, etc.)
 * - Enum поля (union строковых литералов)
 * 
 * Тип автоматически анализирует TypeScript типы и извлекает только поля типа string | undefined
 */
export type DebounceableField<M extends GETTABLE_NAMES> = ExtractStringFilterKeys<GettableTypes<M>['filters']>

/**
 * Field type for automatic filter rendering
 */
export type FilterFieldType =
  | 'text'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'select'
  | 'date'
  | 'daterange'
  | 'checkbox';

/**
 * Configuration for a single filter field
 */
export interface FilterFieldConfig {
  /** Field type for rendering */
  type: FilterFieldType;
  /** Options for select fields */
  options?: Array<{ value: string | number | undefined; label: string }>;
  /** Whether field should be debounced */
  debounce?: boolean;
  /** Default value */
  defaultValue?: unknown;
  /** Whether field is required */
  required?: boolean;
  /** Custom validation/transformation */
  transform?: (value: unknown) => unknown;
  /** Whether to exclude from automatic rendering */
  exclude?: boolean;
  /** Step value for number inputs */
  step?: string | number;
  /** Minimum value for number inputs */
  min?: number;
  /** Maximum value for number inputs */
  max?: number;
  /** Minimum date for date inputs */
  minDate?: string;
  /** Maximum date for date inputs */
  maxDate?: string;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Additional CSS class */
  className?: string;
}

/**
 * Configuration for all filter fields in a form
 */
export interface FilterFieldsConfig {
  [fieldName: string]: FilterFieldConfig;
}

export interface DebounceableSettings {
  fields: string[];
  delay?: number;
}

/**
 * Auto-filter configuration interface
 */
export interface AutoFilterConfig<T extends BaseFiltersOptions<{ id: string }>> {
  /** Field configurations */
  fields: FilterFieldsConfig;
  /** Default filters */
  default_filters: T;
  /** Fields to exclude from rendering */
  exclude_fields?: string[];
  /** Custom debounce settings */
  debounce_settings?: DebounceableSettings;
}
