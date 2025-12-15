import type {
  BaseListResult,
  GETTABLE_NAMES,
  GETTABLE_PATHS,
  GettableTypes,
} from "@shared/src";
import { GETTABLE_DATA } from "@shared/src";
import type { AxiosHeaders, AxiosResponse } from "axios";
import { api } from "@/lib/api/axios";
import { getImageUrl } from "@/lib/api/utils/image-url";

/**
 * Interface for working with model from API
 * @param M - model name from GETTABLE_NAMES
 * @returns IGetApi instance
 */
export interface IGetApi<M extends GETTABLE_NAMES> {
  endpoint: `${string}/${GETTABLE_PATHS}`;
  get: (
    filters: GettableTypes<M>["filters"],
  ) => Promise<AxiosResponse<BaseListResult<GettableTypes<M>["model"]>>>;
  find: (id: string) => Promise<AxiosResponse<GettableTypes<M>["model"]>>;
}
/**
 * Class for working with model from API
 * @param model - model name from GETTABLE_NAMES
 * @returns GetApi instance
 */
export class GetApi<M extends GETTABLE_NAMES> implements IGetApi<M> {
  constructor(protected model: M) {}

  private processApiData = <T>(data: T): T => {
    if (data === null || data === undefined) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(this.processApiData) as T;
    }

    if (typeof data === "object") {
      const processed = { ...data };

      if ("image" in processed && typeof processed.image === "string") {
        processed.image = getImageUrl(processed.image);
      }

      for (const key in processed) {
        if (Object.hasOwn(processed, key)) {
          processed[key] = this.processApiData(processed[key]);
        }
      }

      return processed;
    }

    return data;
  };
  public endpoint: `${string}/${GETTABLE_PATHS}` =
    `${process.env.NEXT_PUBLIC_API_URL}/${GETTABLE_DATA[this.model]}`;
  /**
   * Gets records from API by filters
   * @param filters - request filters
   * @returns Promise with data
   */
  get = async (
    filters: GettableTypes<M>["filters"],
    headers?: AxiosHeaders,
  ) => {
    const response = await api.get<BaseListResult<GettableTypes<M>["model"]>>(
      this.endpoint,
      { params: filters, headers },
    );
    return {
      ...response,
      data: {
        ...response.data,
        items: response.data.items.map(this.processApiData),
      },
    };
  };
  /**
   * Gets record from API by id
   * @param id - record id
   * @param headers - request headers
   * @returns Promise with data
   */
  find = async (id: string, headers?: AxiosHeaders) => {
    const response = await api.get<GettableTypes<M>["model"]>(
      `${this.endpoint}/${id}`,
      { headers },
    );
    return {
      ...response,
      data: this.processApiData(response.data),
    };
  };
}
