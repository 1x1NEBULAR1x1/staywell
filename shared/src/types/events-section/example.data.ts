import { BaseListResult } from "../../common";
import { BookingEvent, Event, EventImage } from "../../database";
import { example_user } from "../users-section";
import { ExtendedBookingEvent, ExtendedEvent } from "./extended.types";



export const example_event_image: EventImage = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  event_id: "123e4567-e89b-12d3-a456-426614174001",
  image: "https://example.com/event1.jpg",
  created: new Date(),
  updated: new Date(),
  name: "Event 1",
  description: "Event 1 description",
  is_excluded: false,
};

export const example_event_images_list_result: BaseListResult<EventImage> = {
  items: [example_event_image],
  total: 1,
  skip: 0,
  take: 10,
};

export const example_event: Event = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  name: "Event 1",
  description: "Event 1 description",
  image: "https://example.com/event1.jpg",
  price: 100,
  created: new Date(),
  updated: new Date(),
  guide_id: "123e4567-e89b-12d3-a456-426614174001",
  capacity: 10,
  start: new Date(),
  end: new Date(),
  is_excluded: false,
};


export const example_extended_event: ExtendedEvent = {
  ...example_event,
  images: [example_event_image],
  guide: example_user,
};

export const example_events_list_result: BaseListResult<Event> = {
  items: [example_event],
  total: 1,
  skip: 0,
  take: 10,
};

export const example_booking_event: BookingEvent = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  booking_id: "UUID",
  event_id: "UUID",
  created: new Date(),
  updated: new Date(),
  number_of_people: 10,
  transaction_id: "UUID",
  is_excluded: false
};

export const example_extended_booking_event: ExtendedBookingEvent = {
  ...example_booking_event,
  event: example_event,
};

export const example_booking_events_list_result: BaseListResult<ExtendedBookingEvent> =
{
  items: [example_extended_booking_event],
  total: 1,
  skip: 0,
  take: 10,
};