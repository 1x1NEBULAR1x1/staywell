import { CrudApi, GetApi } from "@/lib/api";
import { GETTABLE_NAMES, CRUDDABLE_NAMES, isCruddableName, GettableTypes } from "@shared/src";
import { useQuery } from "@tanstack/react-query";
import { GetQueryOptions, FindQueryOptions, QUERY_KEYS, createDeleteMutation, createCreateMutation, createUpdateMutation, UseModel, UseModelGettableOnly, UseModelCruddable } from "./lib";

/**
 * Хук для работы с моделями через API (полный CRUD)
 * @param model Имя модели из CRUDDABLE_NAMES
 * @returns Методы для работы с моделями
 */
export function useModel<M extends CRUDDABLE_NAMES>(model: M): UseModelCruddable<M>;

/**
 * Хук для работы с моделями через API (только для чтения)
 * @param model Имя модели из GETTABLE_NAMES (исключая CRUDDABLE_NAMES)
 * @returns Методы для работы с моделями
 */
export function useModel<M extends GETTABLE_NAMES>(model: M): UseModelGettableOnly<M>;


/**
 * Хук для работы с моделями через API
 * @param model Имя модели
 * @returns Методы для работы с моделями
 */
export function useModel<M extends GETTABLE_NAMES>(model: M): UseModel<M> {
  const crudApi = isCruddableName(model) ? new CrudApi(model) : undefined;
  const getApi = new GetApi(model);

  const get = (filters: GettableTypes<M>['filters'], options?: GetQueryOptions<M>) => useQuery({
    queryKey: QUERY_KEYS(model).get(filters),
    queryFn: () => getApi.get(filters),
    select: (data) => data.data,
    enabled: options?.enabled === undefined ? true : options.enabled
  });

  const find = (id: string, options?: FindQueryOptions<M>) => useQuery({
    queryKey: QUERY_KEYS(model).find(id),
    queryFn: () => getApi.find(id),
    select: (data) => data.data,
    enabled: options?.enabled === undefined ? true : options.enabled
  });

  return isCruddableName(model) ? {
    get,
    find,
    /**
     * Создает запись в API
     * @returns Мутация для создания записи
     */
    create: crudApi ? () => createCreateMutation({ api: crudApi, model: model as CRUDDABLE_NAMES }) : undefined,
    /**
     * Обновляет запись в API
     * @param id -  Id записи
     * @returns Мутация для обновления записи
     */
    update: crudApi ? (id: string) => createUpdateMutation({ api: crudApi, model: model as CRUDDABLE_NAMES, id }) : undefined,
    /**
     * Удаляет запись в API
     * @param id - Id записи
     * @returns Мутация для удаления записи
     */
    delete: crudApi ? (id: string) => createDeleteMutation({ api: crudApi, model: model as CRUDDABLE_NAMES, id }) : undefined,
  } as UseModel<M> : {
    get,
    find,
  } as UseModel<M>;
}