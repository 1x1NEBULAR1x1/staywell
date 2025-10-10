"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.example_extended_reservations_list_result = exports.example_extended_reservation = exports.example_reservation = exports.example_extended_bookings_list_result = exports.example_extended_booking = exports.example_booking = exports.example_extended_booking_variants_list_result = exports.example_extended_booking_variant = exports.example_booking_variant = exports.example_total_price = exports.example_extended_booking_additional_options_list_result = exports.example_extended_booking_additional_option = exports.example_booking_additional_option = exports.example_additional_options_list_result = exports.example_additional_option = void 0;
const database_1 = require("../../database");
const transactions_section_1 = require("../transactions-section");
const users_section_1 = require("../users-section");
const example_apartment = {
    id: 'UUID',
    name: 'Apartment 1',
    number: 1,
    rooms_count: 2,
    floor: 3,
    description: 'Apartment 1 description',
    image: 'https://example.com/image.jpg',
    deposit: 100,
    is_available: true,
    is_smoking: false,
    is_pet_friendly: false,
    type: database_1.ApartmentType.STANDARD,
    rules: 'Apartment 1 rules',
    max_capacity: 2,
    created: new Date(),
    updated: new Date(),
    is_excluded: false,
};
exports.example_additional_option = {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa1",
    name: "Breakfast",
    description: "Breakfast from 7:00 to 10:00",
    image: "https://example.com/breakfast.jpg",
    price: 850,
    created: new Date(),
    updated: new Date(),
    is_excluded: false,
};
exports.example_additional_options_list_result = {
    items: [exports.example_additional_option],
    total: 3,
    skip: 0,
    take: 10,
};
exports.example_booking_additional_option = {
    id: "UUID",
    booking_id: "UUID",
    amount: 2,
    option_id: "UUID",
    created: new Date(),
    updated: new Date(),
};
exports.example_extended_booking_additional_option = {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afb1",
    booking_id: "UUID",
    option_id: exports.example_additional_option.id,
    amount: 2,
    additional_option: exports.example_additional_option,
    created: new Date(),
    updated: new Date(),
};
exports.example_extended_booking_additional_options_list_result = {
    items: [exports.example_extended_booking_additional_option],
    total: 1,
    skip: 0,
    take: 10,
};
exports.example_total_price = {
    total_price: 1800,
};
exports.example_booking_variant = {
    id: "UUID",
    apartment_id: "UUID",
    price: 100,
    capacity: 2,
    is_available: true,
    created: new Date(),
    updated: new Date(),
    is_excluded: false,
};
exports.example_extended_booking_variant = {
    ...exports.example_booking_variant,
    apartment: example_apartment,
};
exports.example_extended_booking_variants_list_result = {
    items: [exports.example_extended_booking_variant],
    total: 1,
    skip: 0,
    take: 10,
};
exports.example_booking = {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa5",
    user_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    booking_variant_id: "3fa85f64-5717-4562-b3fc-2c963f66afa7",
    transaction_id: "3fa85f64-5717-4562-b3fc-2c963f66afa8",
    message: "Example message",
    status: database_1.BookingStatus.CONFIRMED,
    start: new Date("2023-10-01T14:00:00Z"),
    end: new Date("2023-10-05T12:00:00Z"),
    created: new Date(),
    updated: new Date(),
};
exports.example_extended_booking = {
    ...exports.example_booking,
    user: users_section_1.example_user,
    booking_variant: exports.example_extended_booking_variant,
    transaction: transactions_section_1.example_transaction,
    booking_additional_options: [],
};
exports.example_extended_bookings_list_result = {
    items: [exports.example_extended_booking],
    total: 1,
    skip: 0,
    take: 10,
};
exports.example_reservation = {
    id: "1",
    user_id: "1",
    apartment_id: "1",
    start: new Date(),
    end: new Date(),
    created: new Date(),
    updated: new Date(),
};
exports.example_extended_reservation = {
    ...exports.example_reservation,
    apartment: example_apartment,
    user: users_section_1.example_safe_user
};
exports.example_extended_reservations_list_result = {
    items: [exports.example_extended_reservation],
    total: 1,
    take: 10,
    skip: 0,
};
