import { AvailableEvent } from '@/lib/api/services';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type BookingDateRange = {
  start?: Date;
  end?: Date;
};


type SelectedEvent = {
  event: AvailableEvent;
  number_of_people: number;
}

type Values = {
  guests: number;
  selected_dates: BookingDateRange;
  selected_booking_variant_id: string | null;
  selected_events: SelectedEvent[];
}

type Actions = {
  setGuests: (guests: number) => void;
  setSelectedDates: (dates: BookingDateRange) => void;
  setSelectedBookingVariantId: (booking_variant_id: string | null) => void;
  setSelectedEvents: (events: SelectedEvent[]) => void;
}

export const useBookingStore = create<Values & Actions>()(
  persist((set) => ({
    guests: 1,
    selected_dates: {
      start: undefined,
      end: undefined,
    },
    selected_booking_variant_id: null,
    selected_events: [],
    setGuests: (guests) => set({ guests }),
    setSelectedDates: (dates) => set({ selected_dates: dates }),
    setSelectedBookingVariantId: (booking_variant_id) => set({ selected_booking_variant_id: booking_variant_id }),
    setSelectedEvents: (events) => set({ selected_events: events }),
  }), {
    name: 'booking-store',
    partialize: (state) => (state),
    onRehydrateStorage: () => (state) => {
      if (state?.selected_dates) {
        state.selected_dates = {
          start: state.selected_dates.start ? new Date(state.selected_dates.start) : undefined,
          end: state.selected_dates.end ? new Date(state.selected_dates.end) : undefined,
        };
      }
    },
  })
);