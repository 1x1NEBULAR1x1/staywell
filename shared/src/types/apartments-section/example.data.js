"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.example_reviews_list_result = exports.example_apartments_list_result = exports.example_extended_apartment = exports.example_review = exports.example_apartment_availability_result = exports.example_available_apartments_list_result = exports.example_available_apartment = exports.example_apartment = exports.example_apartment_images_list_result = exports.example_apartment_image = exports.example_extended_apartment_beds_list_result = exports.example_extended_apartment_bed = exports.example_apartment_bed = exports.example_bed_types_list_result = exports.example_bed_type = exports.example_extended_apartment_amenities_list_result = exports.example_extended_apartment_amenity = exports.example_amenities_list_result = exports.example_amenity_with_relations = exports.example_amenity = exports.example_apartment_amenity = void 0;
const database_1 = require("../../database");
const bookings_section_1 = require("../bookings-section");
exports.example_apartment_amenity = {
    id: "1",
    apartment_id: "UUID",
    amenity_id: "UUID",
    created: new Date(),
    updated: new Date(),
    is_excluded: false,
};
exports.example_amenity = {
    id: "UUID",
    name: "Amenity 1",
    description: "Amenity 1 description",
    image: "https://example.com/image.jpg",
    created: new Date(),
    updated: new Date(),
    is_excluded: false,
};
exports.example_amenity_with_relations = {
    ...exports.example_amenity,
    apartment_amenities: [exports.example_apartment_amenity],
};
exports.example_amenities_list_result = {
    items: [exports.example_amenity_with_relations],
    total: 1,
    skip: 0,
    take: 1,
};
exports.example_extended_apartment_amenity = {
    ...exports.example_apartment_amenity,
    amenity: exports.example_amenity,
};
exports.example_extended_apartment_amenities_list_result = {
    items: [exports.example_extended_apartment_amenity],
    total: 1,
    take: 10,
    skip: 0,
};
exports.example_bed_type = {
    id: "UUID",
    name: "Single Bed",
    image: "https://example.com/image.jpg",
    created: new Date(),
    updated: new Date(),
    is_excluded: false,
};
exports.example_bed_types_list_result = {
    items: [exports.example_bed_type],
    total: 1,
    skip: 0,
    take: 10,
};
exports.example_apartment_bed = {
    id: "UUID",
    apartment_id: "UUID",
    bed_type_id: "UUID",
    count: 1,
    created: new Date(),
    updated: new Date(),
    is_excluded: false,
};
exports.example_extended_apartment_bed = {
    ...exports.example_apartment_bed,
    bed_type: exports.example_bed_type,
};
exports.example_extended_apartment_beds_list_result = {
    items: [exports.example_extended_apartment_bed],
    total: 1,
    skip: 0,
    take: 10,
};
exports.example_apartment_image = {
    id: "UUID",
    apartment_id: "UUID",
    name: "Apartment 1 image",
    description: "Apartment 1 image description",
    image: "https://example.com/image.jpg",
    created: new Date(),
    updated: new Date(),
    is_excluded: false,
};
exports.example_apartment_images_list_result = {
    items: [exports.example_apartment_image],
    total: 1,
    skip: 0,
    take: 10,
};
exports.example_apartment = {
    id: "1",
    name: "Apartment 1",
    number: 1,
    floor: 3,
    description: "Apartment 1 description",
    image: "https://example.com/image.jpg",
    deposit: 100,
    is_available: true,
    is_smoking: false,
    is_pet_friendly: false,
    type: database_1.ApartmentType.STANDARD,
    rules: "Apartment 1 rules",
    max_capacity: 2,
    created: new Date(),
    updated: new Date(),
    rooms_count: 2,
    is_excluded: false,
};
exports.example_available_apartment = {
    ...exports.example_apartment,
    price: 100,
    capacity: 3,
    rating: 4,
};
exports.example_available_apartments_list_result = {
    items: [exports.example_available_apartment],
    total: 1,
    skip: 0,
    take: 10,
};
exports.example_apartment_availability_result = {
    apartment: exports.example_apartment,
    is_available: false,
    reason: "reserved",
    reservations: [],
};
exports.example_review = {
    id: "1",
    apartment_id: "UUID",
    user_id: "UUID",
    booking_id: "UUID",
    rating: 5,
    comment: "Great apartment!",
    created: new Date(),
    updated: new Date(),
    is_excluded: false,
};
exports.example_extended_apartment = {
    ...exports.example_available_apartment,
    apartment_beds: [exports.example_extended_apartment_bed],
    apartment_amenities: [exports.example_extended_apartment_amenity],
    images: [exports.example_apartment_image],
    booking_variants: [bookings_section_1.example_booking_variant],
    reviews: [exports.example_review],
    cheapest_variant: bookings_section_1.example_booking_variant,
    availability: exports.example_apartment_availability_result,
};
exports.example_apartments_list_result = {
    items: [exports.example_available_apartment],
    total: 1,
    take: 10,
    skip: 0,
};
exports.example_reviews_list_result = {
    items: [exports.example_review],
    total: 1,
    skip: 0,
    take: 1,
};
