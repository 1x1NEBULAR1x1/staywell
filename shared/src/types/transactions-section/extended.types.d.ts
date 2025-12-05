import { Prisma, Transaction } from "../../database";
import { UserWithoutPassword } from "../users-section";
import { ExtendedBooking } from "../bookings-section";
import { ExtendedBookingEvent } from "../events-section";
export type ExtendedTransaction = Transaction & {
    user: UserWithoutPassword;
    booking?: ExtendedBooking;
    booking_event?: ExtendedBookingEvent;
};
export declare const EXTENDED_TRANSACTION_INCLUDE: {
    readonly user: {
        readonly select: Prisma.UserSelect<import("src/database/runtime/library").DefaultArgs>;
    };
    readonly booking: {
        readonly include: {
            readonly booking_events: {
                readonly include: {
                    readonly event: true;
                };
            };
            readonly user: {
                readonly select: Prisma.UserSelect<import("src/database/runtime/library").DefaultArgs>;
            };
            readonly transaction: true;
            readonly booking_additional_options: {
                readonly include: {
                    readonly additional_option: true;
                };
            };
            readonly booking_variant: {
                readonly include: {
                    readonly apartment: {
                        readonly include: {
                            readonly images: true;
                            readonly apartment_amenities: {
                                readonly include: {
                                    readonly amenity: true;
                                };
                            };
                            readonly apartment_beds: {
                                readonly include: {
                                    readonly bed_type: true;
                                };
                            };
                            readonly reviews: true;
                        };
                    };
                };
            };
        };
    };
    readonly booking_event: {
        readonly include: {
            readonly event: true;
        };
    };
};
