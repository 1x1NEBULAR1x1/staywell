"use client";

import type {
  ExtendedApartment,
  ExtendedBookingVariant,
} from "@shared/src/types";
import { Users } from "lucide-react";
import Image from "next/image";
import no_image from "@/../public/common/no-image.jpeg";
import { getImageUrl } from "@/lib/api";
import classes from "./BookingVariant.module.scss";

export const BookingVariant = ({
  nights,
  apartment,
  booking_variant,
}: {
  nights: number;
  apartment: ExtendedApartment;
  booking_variant: ExtendedBookingVariant;
}) => {
  return (
    <div className={classes.variant}>
      <div className={classes.header}>
        <div className={classes.capacity}>
          <Users size={16} />
          <span>Max {booking_variant.capacity} guests</span>
        </div>
        <div className={classes.price}>${booking_variant.price}/night</div>
      </div>

      <div className={classes.details}>
        {/* Beds info */}
        <div className={classes.beds}>
          <span>
            {apartment.apartment_beds.length > 0
              ? apartment.apartment_beds.map((bed) => (
                  <div key={bed.id} className={classes.bed}>
                    {bed.count}x
                    <Image
                      className={classes.bed_image}
                      src={getImageUrl(bed.bed_type.image) ?? no_image.src}
                      alt={bed.bed_type.name}
                      width={20}
                      height={20}
                      quality={100}
                    />
                    {bed.bed_type.name}
                  </div>
                ))
              : "No beds specified"}
          </span>
        </div>

        {/* Top amenities */}
        {apartment.apartment_amenities.length > 0 && (
          <div className={classes.amenities}>
            {apartment.apartment_amenities.map((apartment_amenity, index) => (
              <span key={index} className={classes.amenity}>
                <Image
                  src={
                    getImageUrl(apartment_amenity.amenity.image) ?? no_image.src
                  }
                  alt={apartment_amenity.amenity.name}
                  width={16}
                  height={16}
                  quality={100}
                />
                {apartment_amenity.amenity.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
