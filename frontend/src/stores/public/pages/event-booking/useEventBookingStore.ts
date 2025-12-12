import { create } from "zustand";
import { persist } from "zustand/middleware";

type Values = {
  selected_participants_count: number;
};

type Actions = {
  setSelectedParticipantsCount: (count: number) => void;
};

export const useEventBookingStore = create<Values & Actions>()(
  persist(
    (set) => ({
      selected_participants_count: 0,
      setSelectedParticipantsCount: (count) =>
        set({ selected_participants_count: count }),
    }),
    {
      name: "event-booking-store",
    },
  ),
);
