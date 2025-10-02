"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.example_booking_events_list_result = exports.example_extended_booking_event = exports.example_booking_event = exports.example_events_list_result = exports.example_extended_event = exports.example_event = exports.example_event_images_list_result = exports.example_event_image = void 0;
const users_section_1 = require("../users-section");
exports.example_event_image = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    event_id: "123e4567-e89b-12d3-a456-426614174001",
    image: "https://example.com/event1.jpg",
    created: new Date(),
    updated: new Date(),
    name: "Event 1",
    description: "Event 1 description",
    is_excluded: false,
};
exports.example_event_images_list_result = {
    items: [exports.example_event_image],
    total: 1,
    skip: 0,
    take: 10,
};
exports.example_event = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    name: "Event 1",
    description: "Event 1 description",
    image: "https://example.com/event1.jpg",
    price: 100,
    created: new Date(),
    updated: new Date(),
    guide_id: "123e4567-e89b-12d3-a456-426614174001",
    capacity: 10,
    start: new Date(),
    end: new Date(),
    is_excluded: false,
};
exports.example_extended_event = {
    ...exports.example_event,
    images: [exports.example_event_image],
    guide: users_section_1.example_user,
};
exports.example_events_list_result = {
    items: [exports.example_event],
    total: 1,
    skip: 0,
    take: 10,
};
exports.example_booking_event = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    booking_id: "UUID",
    event_id: "UUID",
    created: new Date(),
    updated: new Date(),
    number_of_people: 10,
    transaction_id: "UUID",
    is_excluded: false
};
exports.example_extended_booking_event = {
    ...exports.example_booking_event,
    event: exports.example_event,
};
exports.example_booking_events_list_result = {
    items: [exports.example_extended_booking_event],
    total: 1,
    skip: 0,
    take: 10,
};
