"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_WITHOUT_PASSWORD_SELECT = exports.SAFE_USER_SELECT = void 0;
exports.SAFE_USER_SELECT = {
    id: true,
    email: true,
    first_name: true,
    last_name: true,
    role: true,
    image: true,
    is_active: true,
};
exports.USER_WITHOUT_PASSWORD_SELECT = {
    ...exports.SAFE_USER_SELECT,
    email_verified: true,
    phone_verified: true,
    role: true,
    created: true,
    updated: true,
    phone_number: true,
};
