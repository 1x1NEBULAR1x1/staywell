import { useCallback } from "react";
import { useModel } from "@/hooks/admin/queries";
import { useBookingStore } from "@/stores/public/pages/booking/useBookingStore";

export const useBookingEvents = () => {
  const { selected_events, setSelectedEvents, selected_dates, guests } =
    useBookingStore();
  // Get all events for the selected dates and guests
  const { data, isLoading, error } = useModel("EVENT").get({
    take: 1000,
    skip: 0,
    min_start: selected_dates.start,
    min_end: selected_dates.end,
    min_capacity: guests,
  });

  // Check if an event is selected
  const isEventSelected = useCallback(
    (event_id: string) => {
      return selected_events.some((selected) => selected.event_id === event_id);
    },
    [selected_events],
  );

  // Get a selected event
  const getSelectedEvent = useCallback(
    (event_id: string) => {
      return selected_events.find((selected) => selected.event_id === event_id);
    },
    [selected_events],
  );

  // Add an event to the selected events
  const addEvent = useCallback(
    (event_id: string) => {
      if (isEventSelected(event_id)) return;
      setSelectedEvents([
        ...selected_events,
        { event_id, number_of_people: guests },
      ]);
    },
    [selected_events, setSelectedEvents, isEventSelected, guests],
  );

  // Update number of people for a selected event
  const updateEventPeople = useCallback(
    (event_id: string, number_of_people: number) => {
      const updatedEvents = selected_events.map((selected) =>
        selected.event_id === event_id
          ? { ...selected, number_of_people }
          : selected,
      );
      setSelectedEvents(updatedEvents);
    },
    [selected_events, setSelectedEvents],
  );

  // Remove an event from selected events
  const removeEvent = useCallback(
    (event_id: string) => {
      const updatedEvents = selected_events.filter(
        (selected) => selected.event_id !== event_id,
      );
      setSelectedEvents(updatedEvents);
    },
    [selected_events, setSelectedEvents],
  );

  // Clear all selected events
  const clearSelectedEvents = useCallback(() => {
    setSelectedEvents([]);
  }, [setSelectedEvents]);

  return {
    events: data?.items ?? [],
    isLoading,
    error,
    selected_events,
    isEventSelected,
    getSelectedEvent,
    addEvent,
    updateEventPeople,
    removeEvent,
    clearSelectedEvents,
  };
};
