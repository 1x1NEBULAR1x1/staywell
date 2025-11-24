import { useCallback } from 'react';
import { AvailableEvent } from '@/lib/api/services';
import { useModel } from '@/hooks/admin/queries';
import { useBookingStore } from '@/stores/public/pages/booking/useBookingStore';


export const useBookingEvents = () => {
  const { selected_events, setSelectedEvents, selected_dates, guests } = useBookingStore();
  const { data, isLoading } = useModel('EVENT').get({ take: 1000, skip: 0, min_start: selected_dates.start, max_end: selected_dates.end, max_capacity: guests })

  const isEventSelected = useCallback((event_id: string) => {
    return selected_events.some(selected => selected.event.id === event_id);
  }, [selected_events]);

  const getSelectedEvent = useCallback((event_id: string) => {
    return selected_events.find(selected => selected.event.id === event_id);
  }, [selected_events]);

  const addEvent = useCallback((event: AvailableEvent) => {
    if (isEventSelected(event.id)) return;
    setSelectedEvents([...selected_events, { event, number_of_people: guests }]);
  }, [selected_events, setSelectedEvents, isEventSelected]);

  const removeEvent = useCallback((event_id: string) => {
    setSelectedEvents(selected_events.filter(selected => selected.event.id !== event_id));
  }, [selected_events, setSelectedEvents]);

  const clearSelectedEvents = useCallback(() => {
    setSelectedEvents([]);
  }, []);

  const total_price = selected_events.reduce(
    (total, event) => total + (event.event.price * event.number_of_people),
    0
  );

  return {
    events: data?.items,
    isLoading,
    total_price,
    isEventSelected,
    getSelectedEvent,
    clearSelectedEvents,
    addEvent,
    removeEvent,
  };
};


