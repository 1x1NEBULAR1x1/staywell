
export const CRUDDABLE_DATA = {
  APARTMENT: "apartments",
  REVIEW: "reviews",
  AMENITY: "amenities",
  APARTMENT_IMAGE: "apartment-images",
  APARTMENT_BED: "apartment-beds",
  APARTMENT_AMENITY: "apartment-amenities",
  BED_TYPE: "bed-types",
  EVENT: "events",
  EVENT_IMAGE: "event-images",
  ADDITIONAL_OPTION: "additional-options",
  BOOKING_VARIANT: "booking-variants",
  RESERVATION: "reservations",
  BOOKING: "bookings",
  TRANSACTION: "transactions",
  TRANSFER_DETAIL: "transfer-details",
  CARD_DETAIL: "card-details",
  BOOKING_EVENT: "booking-events",
  BOOKING_ADDITIONAL_OPTION: "booking-additional-options",
  NOTIFICATION: "notifications"
} as const;

export type CRUDDABLE_NAMES = keyof typeof CRUDDABLE_DATA;
export type CRUDDABLE_PATHS = typeof CRUDDABLE_DATA[CRUDDABLE_NAMES];

export const GETTABLE_DATA = {
  ...CRUDDABLE_DATA,
  USER: "users",
  SESSION: "sessions",
} as const;

export type GETTABLE_NAMES = keyof typeof GETTABLE_DATA;
export type GETTABLE_PATHS = typeof GETTABLE_DATA[GETTABLE_NAMES];