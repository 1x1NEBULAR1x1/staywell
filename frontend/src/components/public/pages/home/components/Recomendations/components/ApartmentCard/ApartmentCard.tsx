import type { ExtendedApartment } from "@shared/src/types/apartments-section/extended.types";
import Image from "next/image";
import Link from "next/link";
import classes from "./ApartmentCard.module.scss";

type ApartmentCardProps = {
  apartment: ExtendedApartment;
  isLarge?: boolean;
};

export const ApartmentCard = ({
  apartment,
  isLarge = false,
}: ApartmentCardProps) => {
  const imageUrl = apartment.image || getTypeImage(apartment.type);
  const price =
    apartment.booking_variants?.[0]?.price ||
    apartment.cheapest_variant?.price ||
    0;

  return (
    <Link
      className={`${classes.card} ${isLarge ? classes.card_large : ""}`}
      href={`/apartments/${apartment.id}`}
    >
      <div className={classes.badge}>
        ${price}
        <span className={classes.pernight}>per night</span>
      </div>
      <div className={classes.room_title}>
        {getTypeDisplayName(apartment.type)}
      </div>
      <Image
        src={imageUrl}
        alt={getTypeDisplayName(apartment.type)}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        style={{ objectFit: "cover" }}
      />
    </Link>
  );
};

// Helper function to get display name for apartment type
export const getTypeDisplayName = (type: string): string => {
  const typeMap: Record<string, string> = {
    BUDGET: "Budget Room",
    STANDARD: "Standard Room",
    EXCLUSIVE: "Executive Room",
    SUPERIOR: "Superior Room",
    LUXURY: "Luxury Suite",
  };
  return typeMap[type] || type;
};

// Helper function to get default image for apartment type
export const getTypeImage = (type: string): string => {
  const imageMap: Record<string, string> = {
    BUDGET: "/images/apartments/budget.jpg",
    STANDARD: "/images/apartments/standard.jpg",
    EXCLUSIVE: "/images/apartments/executive.jpg",
    SUPERIOR: "/images/apartments/superior.jpg",
    LUXURY: "/images/apartments/luxury.jpg",
  };
  return imageMap[type] || "/placeholder-apartment.jpg";
};
