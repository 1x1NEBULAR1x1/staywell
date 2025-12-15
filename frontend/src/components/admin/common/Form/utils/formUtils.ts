/**
 * Merges default values with initial data and required fields
 */
export const mergeDefaultValues = <T, K extends keyof T>(
  defaultValues: Partial<T>,
  initialData?: Partial<T>,
  requiredFields?: Record<K, T[K]>,
): T => {
  return {
    ...defaultValues,
    ...(requiredFields || {}),
    ...(initialData || {}),
  } as T;
};
