import { GETTABLE_NAMES } from "@shared/src";
import { DebounceableField } from "./types";

/**
 * Type guard to check if field exists in object
 * @param obj Object to check 
 * @param field Field name
 * @returns Narrowed type with the field
 */
export function hasField<T extends object, K extends string>(
  obj: T,
  field: K
): obj is T & Record<K, unknown> {
  return field in obj;
}
/**
 * Safely get string value from an object field
 * @param obj Source object
 * @param field Field name
 * @returns String value or empty string
 */
export function getStringValue<T extends object>(obj: T, field: string): string {
  if (hasField(obj, field)) {
    const value = obj[field];
    return typeof value === 'string' ? value : '';
  }
  return '';
}

export function getDebounceableFields<M extends GETTABLE_NAMES>(model_name: M): DebounceableField<M>[] {
  return [];
}