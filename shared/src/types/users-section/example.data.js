"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.example_users_list_result = exports.example_user = exports.example_safe_user = void 0;
const database_1 = require("../../database");
exports.example_safe_user = {
    id: "UUID",
    email: "example@gmail.com",
    first_name: "John",
    last_name: "Smith",
    is_active: true,
    image: "https://example.com/iamge"
};
exports.example_user = {
    ...exports.example_safe_user,
    created: new Date(),
    updated: new Date(),
    date_of_birth: new Date(),
    email_verified: true,
    phone_verified: true,
    phone_number: "+12345678901",
    role: database_1.Role.USER
};
exports.example_users_list_result = {
    items: [exports.example_user],
    total: 1,
    skip: 0,
    take: 10,
};
