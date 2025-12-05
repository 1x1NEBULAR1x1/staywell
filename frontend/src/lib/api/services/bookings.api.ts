import type { ExtendedBooking } from "@shared/src";
import { api } from "@/lib/api/axios";
import type { ICrudApi } from "./crud.api";
import { CrudApi } from "./crud.api";

export interface IBookingsApi extends ICrudApi<"BOOKING"> {
  confirm(id: string): Promise<{ data: ExtendedBooking }>;
  complete(id: string): Promise<{ data: ExtendedBooking }>;
  cancel(id: string): Promise<{ data: ExtendedBooking }>;
}

export class BookingsApi extends CrudApi<"BOOKING"> implements IBookingsApi {
  constructor() {
    super("BOOKING");
  }

  confirm = (id: string) =>
    api.patch<ExtendedBooking>(`${this.endpoint}/${id}/confirm`);

  complete = (id: string) =>
    api.patch<ExtendedBooking>(`${this.endpoint}/${id}/complete`);

  cancel = (id: string) =>
    api.patch<ExtendedBooking>(`${this.endpoint}/${id}/cancel`);
}
