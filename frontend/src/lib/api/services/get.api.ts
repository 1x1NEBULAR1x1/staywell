import type { GettableTypes, GETTABLE_PATHS, GETTABLE_NAMES, BaseListResult } from "@shared/src";
import { AxiosResponse } from "axios";
import { api } from "@/lib/api/axios";
import { GETTABLE_DATA } from "@shared/src";
import { getImageUrl } from "@/lib/api/utils/image-url";
/**
 * Интерфейс для работы с моделью из API
 * @param M - имя модели из GETTABLE_NAMES
 * @returns экземпляр IGetApi
 */
export interface IGetApi<M extends GETTABLE_NAMES> {
  endpoint: `${string}/${GETTABLE_PATHS}`
  get: (filters: GettableTypes<M>['filters']) => Promise<AxiosResponse<BaseListResult<GettableTypes<M>['model']>>>
  find: (id: string) => Promise<AxiosResponse<GettableTypes<M>['model']>>
}
/**
 * Класс для работы с моделью из API
 * @param model - имя модели из GETTABLE_NAMES
 * @returns экземпляр GetApi
 */
export class GetApi<M extends GETTABLE_NAMES> implements IGetApi<M> {
  constructor(
    protected model: M,
  ) { }
  public endpoint: `${string}/${GETTABLE_PATHS}` = `${process.env.NEXT_PUBLIC_API_URL}/${GETTABLE_DATA[this.model]}`
  /**
   * Получает записи от API по фильтрам
   * @param filters - фильтры для запроса
   * @returns Promise с данными
   */
  get = async (filters: GettableTypes<M>['filters']) => {
    const response = await api.get<BaseListResult<GettableTypes<M>['model']>>(this.endpoint, { params: filters })
    return {
      ...response, data: {
        ...response.data, items: response.data.items.map((item) => {
          const formatted_item = { ...item, created: new Date(item.created), updated: new Date(item.updated) }
          return 'image' in formatted_item ? { ...formatted_item, image: getImageUrl(formatted_item.image) } : formatted_item
        })
      }
    };
  }
  /**
   * Получает запись от API по id
   * @param id - id записи
   * @returns Promise с данными
   */
  find = async (id: string) => {
    const response = await api.get<GettableTypes<M>['model']>(`${this.endpoint}/${id}`)
    const formatted_item = { ...response.data, created: new Date(response.data.created), updated: new Date(response.data.updated) }
    return {
      ...response,
      data: 'image' in formatted_item ? { ...formatted_item, image: getImageUrl(formatted_item.image) } : formatted_item
    };
  }
}