"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXTENDED_BOOKING_INCLUDE = exports.EXTENDED_BOOKING_VARIANT_INCLUDE = exports.EXTENDED_BOOKING_ADDITIONAL_OPTION_INCLUDE = void 0;
exports.EXTENDED_BOOKING_ADDITIONAL_OPTION_INCLUDE = {
    additional_option: true,
};
exports.EXTENDED_BOOKING_VARIANT_INCLUDE = {
    apartment: true,
};
exports.EXTENDED_BOOKING_INCLUDE = {
    user: true,
    booking_variant: { include: exports.EXTENDED_BOOKING_VARIANT_INCLUDE },
    transaction: true,
    booking_additional_options: { include: exports.EXTENDED_BOOKING_ADDITIONAL_OPTION_INCLUDE },
};
