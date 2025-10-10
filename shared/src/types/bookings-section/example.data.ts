import { BaseListResult } from "../../common";
import { AdditionalOption, ApartmentType, Booking, BookingAdditionalOption, BookingStatus, BookingVariant, Reservation } from "../../database";
import { example_transaction } from "../transactions-section";
import { example_safe_user, example_user } from "../users-section";
import { ExtendedBookingAdditionalOption, ExtendedBookingVariant } from "./extended.types";
import { ExtendedBooking } from "./extended.types";
import { ExtendedReservation } from "./extended.types";

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
  type: ApartmentType.STANDARD,
  rules: 'Apartment 1 rules',
  max_capacity: 2,
  created: new Date(),
  updated: new Date(),
  is_excluded: false,
}

export const example_additional_option: AdditionalOption = {
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa1",
  name: "Breakfast",
  description: "Breakfast from 7:00 to 10:00",
  image: "https://example.com/breakfast.jpg",
  price: 850,
  created: new Date(),
  updated: new Date(),
  is_excluded: false,
};

export const example_additional_options_list_result: BaseListResult<AdditionalOption> =
{
  items: [example_additional_option],
  total: 3,
  skip: 0,
  take: 10,
};


export const example_booking_additional_option: BookingAdditionalOption = {
  id: "UUID",
  booking_id: "UUID",
  amount: 2,
  option_id: "UUID",
  created: new Date(),
  updated: new Date(),
};

export const example_extended_booking_additional_option: ExtendedBookingAdditionalOption =
{
  id: "3fa85f64-5717-4562-b3fc-2c963f66afb1",
  booking_id: "UUID",
  option_id: example_additional_option.id,
  amount: 2,
  additional_option: example_additional_option,
  created: new Date(),
  updated: new Date(),
};

export const example_extended_booking_additional_options_list_result: BaseListResult<ExtendedBookingAdditionalOption> =
{
  items: [example_extended_booking_additional_option],
  total: 1,
  skip: 0,
  take: 10,
};

export const example_total_price = {
  total_price: 1800,
};

export const example_booking_variant: BookingVariant = {
  id: "UUID",
  apartment_id: "UUID",
  price: 100,
  capacity: 2,
  is_available: true,
  created: new Date(),
  updated: new Date(),
  is_excluded: false,
};



export const example_extended_booking_variant: ExtendedBookingVariant =
{
  ...example_booking_variant,
  apartment: example_apartment,
};

export const example_extended_booking_variants_list_result: BaseListResult<ExtendedBookingVariant> =
{
  items: [example_extended_booking_variant],
  total: 1,
  skip: 0,
  take: 10,
};


export const example_booking: Booking = {
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa5",
  user_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  booking_variant_id: "3fa85f64-5717-4562-b3fc-2c963f66afa7",
  transaction_id: "3fa85f64-5717-4562-b3fc-2c963f66afa8",
  message: "Example message",
  status: BookingStatus.CONFIRMED,
  start: new Date("2023-10-01T14:00:00Z"),
  end: new Date("2023-10-05T12:00:00Z"),
  created: new Date(),
  updated: new Date(),
};

export const example_extended_booking: ExtendedBooking = {
  ...example_booking,
  user: example_user,
  booking_variant: example_extended_booking_variant,
  transaction: example_transaction,
  booking_additional_options: [],
};

export const example_extended_bookings_list_result: BaseListResult<ExtendedBooking> =
{
  items: [example_extended_booking],
  total: 1,
  skip: 0,
  take: 10,
};

export const example_reservation: Reservation = {
  id: "1",
  user_id: "1",
  apartment_id: "1",
  start: new Date(),
  end: new Date(),
  created: new Date(),
  updated: new Date(),
};



export const example_extended_reservation: ExtendedReservation = {
  ...example_reservation,
  apartment: example_apartment,
  user: example_safe_user
}

export const example_extended_reservations_list_result: BaseListResult<ExtendedReservation> = {
  items: [example_extended_reservation],
  total: 1,
  take: 10,
  skip: 0,
};