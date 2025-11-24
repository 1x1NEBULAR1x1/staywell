"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXTENDED_RESERVATION_INCLUDE = exports.EXTENDED_BOOKING_INCLUDE = exports.EXTENDED_BOOKING_VARIANT_INCLUDE = exports.EXTENDED_BOOKING_ADDITIONAL_OPTION_INCLUDE = void 0;
const users_section_1 = require("../users-section");
exports.EXTENDED_BOOKING_ADDITIONAL_OPTION_INCLUDE = {
    additional_option: true,
};
exports.EXTENDED_BOOKING_VARIANT_INCLUDE = {
    apartment: true,
};
exports.EXTENDED_BOOKING_INCLUDE = {
    user: { select: users_section_1.USER_WITHOUT_PASSWORD_SELECT },
    transaction: true,
    booking_additional_options: { include: exports.EXTENDED_BOOKING_ADDITIONAL_OPTION_INCLUDE },
    booking_variant: { include: { apartment: true } },
};
exports.EXTENDED_RESERVATION_INCLUDE = {
    apartment: true,
    user: { select: users_section_1.USER_WITHOUT_PASSWORD_SELECT }
};
