import { BookingEvent, Event, EventImage, Prisma } from "../../database";
import { UserWithoutPassword } from "../users-section";
export type ExtendedBookingEvent = BookingEvent & {
    event: Event;
};
export declare const EXTENDED_BOOKING_EVENT_INCLUDE: {
    readonly event: true;
};
export interface ExtendedEvent extends Event {
    guide?: UserWithoutPassword;
    images: EventImage[];
}
export declare const EXTENDED_EVENT_INCLUDE: {
    readonly images: true;
    readonly guide: {
        readonly select: Prisma.UserSelect<import("src/database/runtime/library").DefaultArgs>;
    };
};
