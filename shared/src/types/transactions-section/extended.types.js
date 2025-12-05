"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXTENDED_TRANSACTION_INCLUDE = void 0;
const users_section_1 = require("../users-section");
const bookings_section_1 = require("../bookings-section");
const events_section_1 = require("../events-section");
exports.EXTENDED_TRANSACTION_INCLUDE = {
    user: { select: users_section_1.USER_WITHOUT_PASSWORD_SELECT },
    booking: { include: bookings_section_1.EXTENDED_BOOKING_INCLUDE },
    booking_event: { include: events_section_1.EXTENDED_BOOKING_EVENT_INCLUDE },
};
