import { User } from "@shared/src/database";
import { SAFE_USER_SELECT, USER_WITHOUT_PASSWORD_SELECT } from "@shared/src";
import { Role, Prisma } from "@shared/src/database";
import { ApartmentsFiltersDto } from "../dto";
import { EXTENDED_BOOKING_ADDITIONAL_OPTION_INCLUDE } from "@shared/src/types/bookings-section";
import { EXTENDED_APARTMENT_AMENITY_INCLUDE, EXTENDED_APARTMENT_BED_INCLUDE, EXTENDED_REVIEW_INCLUDE } from "@shared/src/types/apartments-section";

export const buildApartmentInclude = ({ user, filters }: { user?: User, filters?: ApartmentsFiltersDto }) => ({
  images: true,
  reviews: { include: EXTENDED_REVIEW_INCLUDE },
  apartment_beds: { include: EXTENDED_APARTMENT_BED_INCLUDE },
  apartment_amenities: { include: EXTENDED_APARTMENT_AMENITY_INCLUDE },
  // Admins can see reservations
  ...(user?.role === Role.ADMIN
    ? {
      reservations: {
        include: { user: { select: USER_WITHOUT_PASSWORD_SELECT } }
      }
    } : {}
  ),
  // See only available booking variants for the current filters
  booking_variants: {
    where: {
      is_available: true,
      ...(filters?.min_price !== undefined && { price: { gte: filters.min_price } }),
      ...(filters?.max_price !== undefined && { price: { lte: filters.max_price } }),
    },
    // Admins can see bookings
    ...(user?.role === Role.ADMIN
      ? {
        include: {
          bookings: {
            include: {
              user: { select: USER_WITHOUT_PASSWORD_SELECT },
              transaction: true,
              booking_additional_options: { include: EXTENDED_BOOKING_ADDITIONAL_OPTION_INCLUDE },
            }
          }
        }
      } : {}
    ),
  },
} as const satisfies Prisma.ApartmentInclude);