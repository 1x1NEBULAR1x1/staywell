import type { CRUDDABLE_NAMES, CruddableTypes } from "@shared/src";
import { AxiosResponse } from "axios";
import { api } from "@/lib/api/axios";
import { IGetApi, GetApi } from "./get.api";
/** 
 * Интерфейс для работы с моделью из API
 * @param M - имя модели из CRUDDABLE_NAMES
 * @returns экземпляр ICrudApi
 */
interface ICrudApi<M extends CRUDDABLE_NAMES> extends IGetApi<M> {
  create: (data: CruddableTypes<M>['create']) => Promise<AxiosResponse<CruddableTypes<M>['model']>>
  update: (id: string, data: CruddableTypes<M>['update']) => Promise<AxiosResponse<CruddableTypes<M>['model']>>
  delete: (id: string) => Promise<AxiosResponse<CruddableTypes<M>['model']>>
}
/**
 * Класс для работы с моделью из API
 * @param model - имя модели из CRUDDABLE_NAMES
 * @returns экземпляр CrudApi
 */
export class CrudApi<M extends CRUDDABLE_NAMES> extends GetApi<M> implements ICrudApi<M> {
  constructor(protected model: M) { super(model); }
  /**
   * Создает запись в API
   * @param data - данные для создания
   * @returns Promise с данными
   */
  create = (data: CruddableTypes<M>['create']) => api.post<CruddableTypes<M>['model']>(this.endpoint, data);
  /**
   * Обновляет запись в API
   * @param id - id записи
   * @param data - данные для обновления
   * @returns Promise с данными
   */
  update = (id: string, data: CruddableTypes<M>['update']) => api.put<CruddableTypes<M>['model']>(`${this.endpoint}/${id}`, data);
  /**
   * Удаляет запись в API
   * @param id - id записи
   * @returns Promise с данными
   */
  delete = (id: string) => api.delete<CruddableTypes<M>['model']>(`${this.endpoint}/${id}`);
}