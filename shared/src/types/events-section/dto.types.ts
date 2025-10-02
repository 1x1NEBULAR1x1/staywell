import { BaseFiltersOptions, CreativeOmit } from "../../common";
import { BookingEvent, Event, EventImage } from "../../database";

export type EventsFilters = BaseFiltersOptions<Event> & {
  name?: string;
  description?: string;
  guide_id?: string;
  min_capacity?: number;
  max_capacity?: number;
  min_start?: Date;
  max_start?: Date;
  min_end?: Date;
  max_end?: Date;
  min_price?: number;
  max_price?: number;
}
export type CreateEvent = Omit<CreativeOmit<Event>, 'guide_id'> & { image?: string }
export type UpdateEvent = Partial<CreateEvent> & { is_excluded?: boolean }

export type EventImagesFilters = BaseFiltersOptions<EventImage> & {
  name?: string;
  description?: string;
  event_id?: string;
}
export type CreateEventImage = Omit<CreativeOmit<EventImage>, "description"> & { image?: string; description?: string }
export type UpdateEventImage = Partial<CreateEventImage> & { is_excluded?: boolean }

export type BookingEventsFilters = BaseFiltersOptions<BookingEvent> & {
  event_id?: string;
  booking_id?: string;
  transaction_id?: string;
  user_id?: string;
  min_number_of_people?: number;
  max_number_of_people?: number;
  min_start?: Date;
  max_start?: Date;
  min_end?: Date;
  max_end?: Date;
}
export type CreateBookingEvent = CreativeOmit<BookingEvent>
export type UpdateBookingEvent = Partial<CreateBookingEvent>