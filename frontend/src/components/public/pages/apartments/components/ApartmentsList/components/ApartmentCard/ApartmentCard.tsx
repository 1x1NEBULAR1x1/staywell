import type { ExtendedApartment } from "@shared/src/types/apartments-section/extended.types";
import Link from "next/link";
import {
  getTypeDisplayName,
  getTypeImage,
} from "@/components/public/pages/home/components/Recomendations/components/ApartmentCard/ApartmentCard";
import classes from "./ApartmentCard.module.scss";

export const ApartmentCard = ({
  apartment,
}: {
  apartment: ExtendedApartment;
}) => {
  const imageUrl =
    apartment.images?.[0]?.image ||
    apartment.image ||
    getTypeImage(apartment.type);
  const price = apartment.cheapest_variant?.price || apartment.price;
  const capacity = apartment.capacity || apartment.max_capacity;

  return (
    <Link
      className={classes.apartment_card}
      href={`/apartments/${apartment.id}`}
    >
      <div className={classes.apartment_image}>
        <img
          src={imageUrl}
          alt={apartment.name || getTypeDisplayName(apartment.type)}
        />
        <div className={classes.badge}>
          ${price}
          <p className={classes.pernight}>per night</p>
        </div>
      </div>

      <div className={classes.apartment_info}>
        <div className={classes.apartment_header}>
          <h3 className={classes.apartment_name}>
            {apartment.name || getTypeDisplayName(apartment.type)}
          </h3>
          <span className={classes.apartment_number}>#{apartment.number}</span>
        </div>

        <div className={classes.apartment_details}>
          <div className={classes.detail}>
            <span className={classes.label}>Capacity:</span>
            <span>{capacity} guests</span>
          </div>
          <div className={classes.detail}>
            <span className={classes.label}>Floor:</span>
            <span>{apartment.floor}</span>
          </div>
          <div className={classes.detail}>
            <span className={classes.label}>Rooms:</span>
            <span>{apartment.rooms_count}</span>
          </div>
        </div>

        {apartment.description && (
          <p className={classes.apartment_description}>
            {apartment.description.length > 100
              ? `${apartment.description.substring(0, 100)}...`
              : apartment.description}
          </p>
        )}

        <div className={classes.apartment_features}>
          {apartment.is_pet_friendly && (
            <span className={classes.feature}>Pet Friendly</span>
          )}
          {apartment.is_smoking && (
            <span className={classes.feature}>Smoking Allowed</span>
          )}
          {apartment.availability?.is_available && (
            <span className={classes.feature_available}>Available</span>
          )}
        </div>
      </div>
    </Link>
  );
};
