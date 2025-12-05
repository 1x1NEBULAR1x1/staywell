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
 * API для работы с апартаментами
 */
export class ApartmentsApi extends CrudApi<"APARTMENT"> {
  constructor() {
    super("APARTMENT");
  }

  /**
   * Получает конфиг занятых дат для апартамента
   * @param id - ID апартамента
   * @param params - параметры запроса (год, месяц)
   * @returns Promise с конфигом дат
   */
  getDatesConfig = (
    id: string,
    params: DatesConfigParams,
  ): Promise<AxiosResponse<DatesConfigResult>> =>
    api.get<DatesConfigResult>(`${this.endpoint}/dates-config/${id}`, {
      params,
    });

  /**
   * Проверяет доступность апартамента на заданный период
   * @param id - ID апартамента
   * @param start_date - дата начала
   * @param end_date - дата окончания
   * @returns Promise с результатом проверки
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
