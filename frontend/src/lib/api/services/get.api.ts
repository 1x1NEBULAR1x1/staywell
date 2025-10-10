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

  private processApiData = <T>(data: T): T => {
    if (data === null || data === undefined) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(this.processApiData) as T;
    }

    if (typeof data === 'object') {
      const processed = { ...data };

      if ('image' in processed && typeof processed.image === 'string') {
        processed.image = getImageUrl(processed.image);
      }

      for (const key in processed) {
        if (processed.hasOwnProperty(key)) {
          (processed)[key] = this.processApiData((processed)[key]);
        }
      }

      return processed;
    }

    return data;
  };
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
        ...response.data, items: response.data.items.map(this.processApiData)
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
    return {
      ...response,
      data: this.processApiData(response.data)
    };
  }
}