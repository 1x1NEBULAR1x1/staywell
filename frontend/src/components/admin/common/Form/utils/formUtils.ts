/**
 * Объединяет значения по умолчанию с начальными данными и обязательными полями
 */
export const mergeDefaultValues = <T, K extends keyof T>(
  defaultValues: Partial<T>,
  initialData?: Partial<T>,
  requiredFields?: Record<K, T[K]>
): T => {
  return {
    ...defaultValues,
    ...(requiredFields || {}),
    ...(initialData || {})
  } as T;
};