import type {
  BaseFiltersOptions,
  GETTABLE_NAMES,
  GettableTypes,
} from "@shared/src";

type IsDebounceableField<FieldName extends string> =
  FieldName extends `${string}_id`
    ? false
    : FieldName extends keyof BaseFiltersOptions<{ id: string }>
      ? false
      : true;

// Extract only string fields from TypeScript filter types
type ExtractStringFilterKeys<T> = T extends Record<string, unknown>
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends string | undefined
          ? IsDebounceableField<K> extends true
            ? K
            : never
          : never
        : never;
    }[keyof T]
  : never;

/**
 * Automatically generated fields for debounce functionality
 * Based on filter types from GettableTypes
 * Includes only string fields from all filter types, excluding:
 * - ID fields (ending with _id)
 * - Base filtering fields (skip, take, sort, etc.)
 * - Enum fields (union of string literals)
 *
 * Type automatically analyzes TypeScript types and extracts only string | undefined fields
 */
export type DebounceableField<M extends GETTABLE_NAMES> =
  ExtractStringFilterKeys<GettableTypes<M>["filters"]>;

/**
 * Field type for automatic filter rendering
 */
export type FilterFieldType =
  | "text"
  | "number"
  | "integer"
  | "boolean"
  | "select"
  | "date"
  | "daterange"
  | "checkbox";

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
