import { BaseFiltersOptions, CreativeOmit } from "../../common";
import { Amenity, Apartment, ApartmentAmenity, ApartmentBed, ApartmentImage, ApartmentType, BedType, Review, BookingVariant, Reservation, Booking } from "../../database";

export type AmenitiesFilters = BaseFiltersOptions<Amenity> & {
  name?: string;
  description?: string;
}
export type CreateAmenity = CreativeOmit<Amenity> & { image?: string }
export type UpdateAmenity = Partial<CreateAmenity> & { is_excluded?: boolean }

export type ApartmentsFilters = BaseFiltersOptions<Apartment> & {
  number?: number;
  name?: string;
  description?: string;
  deposit?: number;
  floor?: number;
  rooms_count?: number;
  max_capacity?: number;
  is_available?: boolean;
  is_smoking?: boolean;
  is_pet_friendly?: boolean;
  type?: ApartmentType;
}
export type CreateApartment = CreativeOmit<Apartment> & { image?: string }
export type UpdateApartment = Partial<CreateApartment> & { is_excluded?: boolean }

export type ApartmentAmenitiesFilters = BaseFiltersOptions<ApartmentAmenity> & {
  apartment_id?: string;
  amenity_id?: string;
}
export type CreateApartmentAmenity = CreativeOmit<ApartmentAmenity> & { image?: string }
export type UpdateApartmentAmenity = Partial<CreateApartmentAmenity> & { is_excluded?: boolean }

export type BedTypesFilters = BaseFiltersOptions<BedType> & {
  name?: string;
}
export type CreateBedType = CreativeOmit<BedType> & { image?: string }
export type UpdateBedType = Partial<CreateBedType> & { is_excluded?: boolean }

export type ApartmentBedsFilters = BaseFiltersOptions<ApartmentBed> & {
  apartment_id?: string;
  bed_type_id?: string;
  count?: number;
}
export type CreateApartmentBed = CreativeOmit<ApartmentBed> & { image?: string }
export type UpdateApartmentBed = Partial<CreateApartmentBed> & { is_excluded?: boolean }

export type ApartmentImagesFilters = BaseFiltersOptions<ApartmentImage> & {
  name?: string;
  apartment_id?: string;
  description?: string;
}
export type CreateApartmentImage = CreativeOmit<ApartmentImage> & { image?: string }
export type UpdateApartmentImage = Partial<CreateApartmentImage> & { is_excluded?: boolean }

export type ReviewsFilters = BaseFiltersOptions<Review> & {
  apartment_id?: string;
  user_id?: string;
  booking_id?: string;
  rating?: number;
  comment?: string;
}
export type CreateReview = CreativeOmit<Review> & { image?: string }
export type UpdateReview = Partial<CreateReview> & { is_excluded?: boolean }

export interface DateRange {
  start_date: Date;
  end_date: Date;
}