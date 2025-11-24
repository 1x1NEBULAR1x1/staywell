import type { CRUDDABLE_NAMES, GETTABLE_NAMES } from "./data";
import type { BaseFiltersOptions } from "../common";

import {
  ExtendedAmenity, AmenitiesFilters, CreateAmenity, UpdateAmenity,
  ApartmentAmenity, ApartmentAmenitiesFilters, CreateApartmentAmenity, UpdateApartmentAmenity,
  ExtendedApartment, ApartmentsFilters, CreateApartment, UpdateApartment,
  BedType, BedTypesFilters, CreateBedType, UpdateBedType,
  ExtendedApartmentBed, ApartmentBedsFilters, CreateApartmentBed, UpdateApartmentBed,
  ApartmentImage, ApartmentImagesFilters, CreateApartmentImage, UpdateApartmentImage,
  ExtendedReview, ReviewsFilters, CreateReview, UpdateReview,
} from '../types/apartments-section';

import {
  ExtendedBookingVariant, BookingVariantsFilters, CreateBookingVariant, UpdateBookingVariant,
  ExtendedBooking, BookingsFilters, CreateBooking, UpdateBooking,
  ExtendedBookingAdditionalOption, BookingAdditionalOptionsFilters, CreateBookingAdditionalOption, UpdateBookingAdditionalOption,
  AdditionalOption, AdditionalOptionsFilters, CreateAdditionalOption, UpdateAdditionalOption,
  ExtendedReservation, ReservationsFilters, CreateReservation, UpdateReservation,
} from '../types/bookings-section';

import {
  ExtendedEvent, EventsFilters, CreateEvent, UpdateEvent,
  ExtendedBookingEvent, BookingEventsFilters, CreateBookingEvent, UpdateBookingEvent,
  EventImage, EventImagesFilters, CreateEventImage, UpdateEventImage,
} from '../types/events-section';

import {
  Transaction, TransactionsFilters, CreateTransaction, UpdateTransaction,
  TransferDetail, TransferDetailsFilters, CreateTransferDetail, UpdateTransferDetail,
  CardDetail, CardDetailsFilters, CreateCardDetail, UpdateCardDetail,
} from '../types/transactions-section';

import {
  UserWithoutPassword, UsersFilters,
  SessionData, SessionsFilters,
  CreateNotification,
  UpdateNotification,
  NotificationsFilters
} from '../types/users-section';
import { Notification } from "../database";

interface CruddableTypeShape<M extends { id: string }, F extends BaseFiltersOptions<M>, C, U extends Partial<C>> {
  model: M;
  filters: F;
  create: C;
  update: U;
};


export type CruddableTypes<T extends CRUDDABLE_NAMES> =
  T extends 'AMENITY' ? CruddableTypeShape<ExtendedAmenity, AmenitiesFilters, CreateAmenity, UpdateAmenity> :
  T extends 'APARTMENT_AMENITY' ? CruddableTypeShape<ApartmentAmenity, ApartmentAmenitiesFilters, CreateApartmentAmenity, UpdateApartmentAmenity> :
  T extends 'APARTMENT' ? CruddableTypeShape<ExtendedApartment, ApartmentsFilters, CreateApartment, UpdateApartment> :
  T extends 'APARTMENT_BED' ? CruddableTypeShape<ExtendedApartmentBed, ApartmentBedsFilters, CreateApartmentBed, UpdateApartmentBed> :
  T extends 'APARTMENT_IMAGE' ? CruddableTypeShape<ApartmentImage, ApartmentImagesFilters, CreateApartmentImage, UpdateApartmentImage> :
  T extends 'BED_TYPE' ? CruddableTypeShape<BedType, BedTypesFilters, CreateBedType, UpdateBedType> :
  T extends 'REVIEW' ? CruddableTypeShape<ExtendedReview, ReviewsFilters, CreateReview, UpdateReview> :
  T extends 'BOOKING_VARIANT' ? CruddableTypeShape<ExtendedBookingVariant, BookingVariantsFilters, CreateBookingVariant, UpdateBookingVariant> :
  T extends 'BOOKING' ? CruddableTypeShape<ExtendedBooking, BookingsFilters, CreateBooking, UpdateBooking> :
  T extends 'BOOKING_ADDITIONAL_OPTION' ? CruddableTypeShape<ExtendedBookingAdditionalOption, BookingAdditionalOptionsFilters, CreateBookingAdditionalOption, UpdateBookingAdditionalOption> :
  T extends 'ADDITIONAL_OPTION' ? CruddableTypeShape<AdditionalOption, AdditionalOptionsFilters, CreateAdditionalOption, UpdateAdditionalOption> :
  T extends 'RESERVATION' ? CruddableTypeShape<ExtendedReservation, ReservationsFilters, CreateReservation, UpdateReservation> :
  T extends 'EVENT' ? CruddableTypeShape<ExtendedEvent, EventsFilters, CreateEvent, UpdateEvent> :
  T extends 'EVENT_IMAGE' ? CruddableTypeShape<EventImage, EventImagesFilters, CreateEventImage, UpdateEventImage> :
  T extends 'BOOKING_EVENT' ? CruddableTypeShape<ExtendedBookingEvent, BookingEventsFilters, CreateBookingEvent, UpdateBookingEvent> :
  T extends 'TRANSACTION' ? CruddableTypeShape<Transaction, TransactionsFilters, CreateTransaction, UpdateTransaction> :
  T extends 'TRANSFER_DETAIL' ? CruddableTypeShape<TransferDetail, TransferDetailsFilters, CreateTransferDetail, UpdateTransferDetail> :
  T extends 'CARD_DETAIL' ? CruddableTypeShape<CardDetail, CardDetailsFilters, CreateCardDetail, UpdateCardDetail> :
  T extends 'NOTIFICATION' ? CruddableTypeShape<Notification, NotificationsFilters, CreateNotification, UpdateNotification> :
  never;

interface GettableTypeShape<M extends { id: string }, F extends BaseFiltersOptions<M>> {
  model: M;
  filters: F;
};

export type GettableTypes<T extends GETTABLE_NAMES> =
  T extends CRUDDABLE_NAMES
  ? CruddableTypes<T> extends CruddableTypeShape<infer M, infer F, Record<string, unknown>, Partial<Record<string, unknown>>>
  ? GettableTypeShape<M, F>
  : never
  : T extends 'USER'
  ? GettableTypeShape<UserWithoutPassword, UsersFilters>
  : T extends 'SESSION'
  ? GettableTypeShape<SessionData, SessionsFilters>
  : never;
