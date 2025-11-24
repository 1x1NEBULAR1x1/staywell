import { BaseListResult } from "../../common";
import { ApartmentImage, BedType, Amenity, ApartmentAmenity, ApartmentBed, Review, Apartment, ApartmentType } from "../../database";
import { ExtendedAmenity, ExtendedApartmentAmenity, ExtendedApartmentBed, ExtendedApartment, AvailableApartment, ApartmentAvailabilityResult } from "./extended.types";
import { example_booking_variant } from "../bookings-section";
import { example_safe_user } from "../users-section";


export const example_apartment_amenity: ApartmentAmenity = {
  id: "1",
  apartment_id: "UUID",
  amenity_id: "UUID",
  created: new Date(),
  updated: new Date(),
  is_excluded: false,
};

export const example_amenity: Amenity = {
  id: "UUID",
  name: "Amenity 1",
  description: "Amenity 1 description",
  image: "https://example.com/image.jpg",
  created: new Date(),
  updated: new Date(),
  is_excluded: false,
};

export const example_amenity_with_relations: ExtendedAmenity = {
  ...example_amenity,
  apartment_amenities: [example_apartment_amenity],
};

export const example_amenities_list_result: BaseListResult<ExtendedAmenity> =
{
  items: [example_amenity_with_relations],
  total: 1,
  skip: 0,
  take: 1,
};



export const example_extended_apartment_amenity: ExtendedApartmentAmenity =
{
  ...example_apartment_amenity,
  amenity: example_amenity,
};

export const example_extended_apartment_amenities_list_result: BaseListResult<ExtendedApartmentAmenity> =
{
  items: [example_extended_apartment_amenity],
  total: 1,
  take: 10,
  skip: 0,
};

export const example_bed_type: BedType = {
  id: "UUID",
  name: "Single Bed",
  image: "https://example.com/image.jpg",
  created: new Date(),
  updated: new Date(),
  is_excluded: false,
};

export const example_bed_types_list_result: BaseListResult<BedType> = {
  items: [example_bed_type],
  total: 1,
  skip: 0,
  take: 10,
};


export const example_apartment_bed: ApartmentBed = {
  id: "UUID",
  apartment_id: "UUID",
  bed_type_id: "UUID",
  count: 1,
  created: new Date(),
  updated: new Date(),
  is_excluded: false,
};


export const example_extended_apartment_bed: ExtendedApartmentBed = {
  ...example_apartment_bed,
  bed_type: example_bed_type,
};

export const example_extended_apartment_beds_list_result: BaseListResult<ExtendedApartmentBed> =
{
  items: [example_extended_apartment_bed],
  total: 1,
  skip: 0,
  take: 10,
};

export const example_apartment_image: ApartmentImage = {
  id: "UUID",
  apartment_id: "UUID",
  name: "Apartment 1 image",
  description: "Apartment 1 image description",
  image: "https://example.com/image.jpg",
  created: new Date(),
  updated: new Date(),
  is_excluded: false,
};

export const example_apartment_images_list_result: BaseListResult<ApartmentImage> =
{
  items: [example_apartment_image],
  total: 1,
  skip: 0,
  take: 10,
};

export const example_apartment: Apartment = {
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
  type: ApartmentType.STANDARD,
  rules: "Apartment 1 rules",
  max_capacity: 2,
  created: new Date(),
  updated: new Date(),
  rooms_count: 2,
  is_excluded: false,
};

export const example_available_apartment: AvailableApartment = {
  ...example_apartment,
  price: 100,
  capacity: 3,
  rating: 4,
};

export const example_available_apartments_list_result: BaseListResult<AvailableApartment> =
{
  items: [example_available_apartment],
  total: 1,
  skip: 0,
  take: 10,
};

export const example_apartment_availability_result: ApartmentAvailabilityResult =
{
  apartment: example_apartment,
  is_available: false,
  reason: "reserved",
  reservations: [],
};


export const example_review: Review = {
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

export const example_extended_apartment: ExtendedApartment = {
  ...example_available_apartment,
  apartment_beds: [example_extended_apartment_bed],
  apartment_amenities: [example_extended_apartment_amenity],
  images: [example_apartment_image],
  booking_variants: [example_booking_variant],
  reviews: [{
    ...example_review,
    user: example_safe_user,
  }],
  cheapest_variant: example_booking_variant,
  availability: example_apartment_availability_result,
  reservations: [],
  bookings: [],
};

export const example_apartments_list_result: BaseListResult<AvailableApartment> =
{
  items: [example_available_apartment],
  total: 1,
  take: 10,
  skip: 0,
};

export const example_reviews_list_result: BaseListResult<Review> = {
  items: [example_review],
  total: 1,
  skip: 0,
  take: 1,
};