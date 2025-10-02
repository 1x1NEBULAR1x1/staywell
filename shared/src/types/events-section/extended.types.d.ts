import { BookingEvent, Event, EventImage } from "../../database";
import { UserWithoutPassword } from "../users-section";
export type ExtendedBookingEvent = BookingEvent & {
    event: Event;
};
export interface ExtendedEvent extends Event {
    guide?: UserWithoutPassword;
    images: EventImage[];
}
