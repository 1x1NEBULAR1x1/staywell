import type { AxiosResponse } from "axios";
import { api } from "@/lib/api/axios";
import { CrudApi } from "./crud.api";

export interface DatesConfigParams {
  year: number;
  month: number;
}

export interface DatesConfigResult {
  occupied_dates: string[];
}

/**
 * API for working with apartments
 */
export class ApartmentsApi extends CrudApi<"APARTMENT"> {
  constructor() {
    super("APARTMENT");
  }

  /**
   * Gets config of occupied dates for apartment
   * @param id - Apartment ID
   * @param params - request parameters (year, month)
   * @returns Promise with dates config
   */
  getDatesConfig = (
    id: string,
    params: DatesConfigParams,
  ): Promise<AxiosResponse<DatesConfigResult>> =>
    api.get<DatesConfigResult>(`${this.endpoint}/dates-config/${id}`, {
      params,
    });

  /**
   * Checks apartment availability for given period
   * @param id - Apartment ID
   * @param start_date - start date
   * @param end_date - end date
   * @returns Promise with check result
   */
  checkAvailability = (id: string, start_date: Date, end_date: Date) =>
    api.get(`${this.endpoint}/available/${id}`, {
      params: {
        start_date: start_date.toISOString(),
        end_date: end_date.toISOString(),
      },
    });
}

export const apartmentsApi = new ApartmentsApi();
