"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXTENDED_EVENT_INCLUDE = exports.EXTENDED_BOOKING_EVENT_INCLUDE = void 0;
const users_section_1 = require("../users-section");
exports.EXTENDED_BOOKING_EVENT_INCLUDE = {
    event: true,
};
exports.EXTENDED_EVENT_INCLUDE = {
    images: true,
    guide: { select: users_section_1.SAFE_USER_SELECT },
};
