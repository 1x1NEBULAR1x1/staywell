import {
  type CRUDDABLE_NAMES,
  type GETTABLE_NAMES,
  type GettableTypes,
  isCruddableName,
} from "@shared/src";
import { useQuery } from "@tanstack/react-query";
import { CrudApi, GetApi } from "@/lib/api";
import {
  type FindQueryOptions,
  type GetQueryOptions,
  initCreateMutation,
  initDeleteMutation,
  initUpdateMutation,
  QUERY_KEYS,
  type UseModel,
  type UseModelCruddable,
  type UseModelGettableOnly,
} from "./lib";

/**
 * Хук для работы с моделями через API (полный CRUD)
 * @param model Имя модели из CRUDDABLE_NAMES
 * @returns Методы для работы с моделями
 */
export function useModel<M extends CRUDDABLE_NAMES>(
  model: M,
): UseModelCruddable<M>;

/**
 * Хук для работы с моделями через API (только для чтения)
 * @param model Имя модели из GETTABLE_NAMES (исключая CRUDDABLE_NAMES)
 * @returns Методы для работы с моделями
 */
export function useModel<M extends GETTABLE_NAMES>(
  model: M,
): UseModelGettableOnly<M>;

/**
 * Хук для работы с моделями через API
 * @param model Имя модели
 * @returns Методы для работы с моделями
 */
export function useModel<M extends GETTABLE_NAMES>(model: M): UseModel<M> {
  const crudApi = isCruddableName(model) ? new CrudApi(model) : undefined;
  const getApi = new GetApi(model);

  const get = (
    filters: GettableTypes<M>["filters"] = { take: 1000, skip: 0 },
    options?: GetQueryOptions<M>,
  ) => {
    return useQuery({
      queryKey: QUERY_KEYS(model).get(filters),
      queryFn: () => getApi.get(filters),
      select: (data) => data.data,
      enabled: options?.enabled === undefined ? true : options.enabled,
      initialData: options?.initial_data,
    });
  };

  const find = (id: string, options?: FindQueryOptions<M>) => {
    return useQuery({
      queryKey: QUERY_KEYS(model).find(id),
      queryFn: () => getApi.find(id),
      select: (data) => data.data,
      enabled: options?.enabled === undefined ? true : options.enabled,
      initialData: options?.initial_data,
    });
  };

  return isCruddableName(model)
    ? ({
        get,
        find,
        /**
         * Создает запись в API
         * @returns Мутация для создания записи
         */
        create: crudApi
          ? () => initCreateMutation({ api: crudApi, model })
          : undefined,
        /**
         * Обновляет запись в API
         * @param id -  Id записи
         * @returns Мутация для обновления записи
         */
        update: crudApi
          ? (id: string) => initUpdateMutation({ api: crudApi, model, id })
          : undefined,
        /**
         * Удаляет запись в API
         * @param id - Id записи
         * @returns Мутация для удаления записи
         */
        remove: crudApi
          ? (id: string) => initDeleteMutation({ api: crudApi, model, id })
          : undefined,
      } as unknown as UseModel<M>)
    : ({
        get,
        find,
      } as UseModel<M>);
}
