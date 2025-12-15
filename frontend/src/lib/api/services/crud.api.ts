import type { CRUDDABLE_NAMES, CruddableTypes } from "@shared/src";
import type { AxiosResponse } from "axios";
import { api, createFormData } from "@/lib/api/axios";
import { GetApi, type IGetApi } from "./get.api";

/**
 * Interface for working with model from API
 * @param M - model name from CRUDDABLE_NAMES
 * @returns ICrudApi instance
 */
export interface ICrudApi<M extends CRUDDABLE_NAMES> extends IGetApi<M> {
  create: (
    data: CruddableTypes<M>["create"],
  ) => Promise<AxiosResponse<CruddableTypes<M>["model"]>>;
  update: (
    id: string,
    data: CruddableTypes<M>["update"],
  ) => Promise<AxiosResponse<CruddableTypes<M>["model"]>>;
  delete: (id: string) => Promise<AxiosResponse<CruddableTypes<M>["model"]>>;
}
/**
 * Class for working with model from API
 * @param model - model name from CRUDDABLE_NAMES
 * @returns CrudApi instance
 */
export class CrudApi<M extends CRUDDABLE_NAMES>
  extends GetApi<M>
  implements ICrudApi<M>
{
  constructor(protected model: M) {
    super(model);
  }
  /**
   * Creates record in API
   * @param data - data for creation
   * @returns Promise with data
   */
  create = (data: CruddableTypes<M>["create"]) =>
    api.post<CruddableTypes<M>["model"]>(
      this.endpoint,
      ...("file" in data ? createFormData(data) : [data]),
    );

  /**
   * Updates record in API
   * @param id - record id
   * @param data - data for update
   * @returns Promise with data
   */
  update = (id: string, data: CruddableTypes<M>["update"]) =>
    api.put<CruddableTypes<M>["model"]>(
      `${this.endpoint}/${id}`,
      ...("file" in data ? createFormData(data) : [data]),
    );
  /**
   * Deletes record in API
   * @param id - record id
   * @returns Promise with data
   */
  delete = (id: string) =>
    api.delete<CruddableTypes<M>["model"]>(`${this.endpoint}/${id}`);
}
