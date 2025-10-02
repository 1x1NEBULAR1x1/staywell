import { GETTABLE_DATA, GETTABLE_NAMES, GettableTypes } from "@shared/src";

interface QUERY_KEYS_RETURN<M extends GETTABLE_NAMES> {
  get: (filters?: Partial<GettableTypes<M>['filters']>) => [string, Partial<GettableTypes<M>['filters']> | undefined];
  find: (id: string) => [string];
}
/**
 * Creates query keys for specified model
 * @param model Model name from ModelName enum
 * @returns Object with get and find methods for creating query keys
 */
export const QUERY_KEYS = <M extends GETTABLE_NAMES>(model: M): QUERY_KEYS_RETURN<M> => ({
  /**
   * Creates query key for getting a list of items with filters
   * @param filters Filter object
   * @returns Tuple of [apiPath, filters]
   */
  get: (filters?: Partial<GettableTypes<M>['filters']>) => [GETTABLE_DATA[model], filters],
  /**
   * Creates query key for finding a single item by ID
   * @param id Item identifier
   * @returns Array with item path
   */
  find: (id: string) => [`${GETTABLE_DATA[model]}/${id}`],
});