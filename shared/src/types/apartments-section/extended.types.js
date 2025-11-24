"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXTENDED_REVIEW_INCLUDE = exports.EXTENDED_APARTMENT_BED_INCLUDE = exports.EXTENDED_APARTMENT_AMENITY_INCLUDE = exports.EXTENDED_APARTMENT_INCLUDE = void 0;
const users_section_1 = require("../users-section");
exports.EXTENDED_APARTMENT_INCLUDE = {
    apartment_amenities: true,
};
exports.EXTENDED_APARTMENT_AMENITY_INCLUDE = {
    amenity: true,
};
exports.EXTENDED_APARTMENT_BED_INCLUDE = {
    bed_type: true,
};
exports.EXTENDED_REVIEW_INCLUDE = {
    user: { select: users_section_1.SAFE_USER_SELECT },
    apartment: true,
};
