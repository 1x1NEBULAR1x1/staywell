import type { Transaction } from "@shared/src/database";
import type { CreateBooking } from "@shared/src/types/bookings-section";
import type { CreateBookingEvent } from "@shared/src/types/events-section/dto.types";
import { api } from "../axios";

export type CheckoutResponse = {
  session_url: string;
  transaction: Transaction;
};

export class CheckoutsApi {
  readonly ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/checkouts`;

  async booking(data: CreateBooking) {
    return await api.post<CheckoutResponse>(`${this.ENDPOINT}/booking`, data);
  }

  async event(data: CreateBookingEvent[]) {
    return await api.post<CheckoutResponse>(`${this.ENDPOINT}/event`, data);
  }
}
