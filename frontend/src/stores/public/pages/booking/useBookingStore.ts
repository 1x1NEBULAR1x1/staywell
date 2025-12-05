import { create } from "zustand";
import { persist } from "zustand/middleware";

type BookingDateRange = {
  start?: Date;
  end?: Date;
};

export type SelectedEvent = {
  event_id: string;
  number_of_people: number;
};

export type SelectedAdditionalOption = {
  additional_option_id: string;
  amount: number;
};

type Values = {
  guests: number;
  selected_dates: BookingDateRange;
  selected_booking_variant_id: string | null;
  selected_events: SelectedEvent[];
  selected_additional_options: SelectedAdditionalOption[];
};

type Actions = {
  setGuests: (guests: number) => void;
  setSelectedDates: (dates: BookingDateRange) => void;
  setSelectedBookingVariantId: (booking_variant_id: string | null) => void;
  setSelectedEvents: (events: SelectedEvent[]) => void;
  setSelectedAdditionalOptions: (
    additional_options: SelectedAdditionalOption[],
  ) => void;
};

export const useBookingStore = create<Values & Actions>()(
  persist(
    (set) => ({
      guests: 1,
      selected_dates: {
        start: undefined,
        end: undefined,
      },
      selected_booking_variant_id: null,
      selected_events: [],
      selected_additional_options: [],
      setGuests: (guests) => set({ guests }),
      setSelectedDates: (dates) => set({ selected_dates: dates }),
      setSelectedBookingVariantId: (booking_variant_id) =>
        set({ selected_booking_variant_id: booking_variant_id }),
      setSelectedEvents: (events) => set({ selected_events: events }),
      setSelectedAdditionalOptions: (additional_options) =>
        set({ selected_additional_options: additional_options }),
    }),
    {
      name: "booking-store",
      onRehydrateStorage: () => (state) => {
        if (state?.selected_dates) {
          state.selected_dates = {
            start: state.selected_dates.start
              ? new Date(state.selected_dates.start)
              : undefined,
            end: state.selected_dates.end
              ? new Date(state.selected_dates.end)
              : undefined,
          };
        }
      },
    },
  ),
);
