"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXTENDED_RESERVATION_INCLUDE = exports.EXTENDED_BOOKING_INCLUDE = exports.EXTENDED_BOOKING_VARIANT_INCLUDE = exports.EXTENDED_BOOKING_ADDITIONAL_OPTION_INCLUDE = void 0;
const extended_types_1 = require("../events-section/extended.types");
const users_section_1 = require("../users-section");
exports.EXTENDED_BOOKING_ADDITIONAL_OPTION_INCLUDE = {
    additional_option: true,
};
exports.EXTENDED_BOOKING_VARIANT_INCLUDE = {
    apartment: {
        include: {
            images: true,
            apartment_amenities: { include: { amenity: true } },
            apartment_beds: { include: { bed_type: true } },
            reviews: true,
        },
    },
};
exports.EXTENDED_BOOKING_INCLUDE = {
    booking_events: {
        include: extended_types_1.EXTENDED_BOOKING_EVENT_INCLUDE
    },
    user: { select: users_section_1.USER_WITHOUT_PASSWORD_SELECT },
    transaction: true,
    booking_additional_options: { include: exports.EXTENDED_BOOKING_ADDITIONAL_OPTION_INCLUDE },
    booking_variant: { include: exports.EXTENDED_BOOKING_VARIANT_INCLUDE },
};
exports.EXTENDED_RESERVATION_INCLUDE = {
    apartment: true,
    user: { select: users_section_1.USER_WITHOUT_PASSWORD_SELECT }
};
