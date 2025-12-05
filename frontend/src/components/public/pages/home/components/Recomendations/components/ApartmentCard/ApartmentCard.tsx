import type { ExtendedApartment } from "@shared/src/types/apartments-section/extended.types";
import Link from "next/link";
import budget_room from "@/../public/pages/home/rooms/room-budget-room.jpg";
import executive_room from "@/../public/pages/home/rooms/room-executive-room.jpg";
import luxury_suite from "@/../public/pages/home/rooms/room-luxury-suite.jpg";
import standard_room from "@/../public/pages/home/rooms/room-standard-room.jpg";
import superior_room from "@/../public/pages/home/rooms/room-superior-room.jpg";
import classes from "./ApartmentCard.module.scss";

export const ApartmentCard = ({
  apartment,
}: {
  apartment: ExtendedApartment;
}) => (
  <Link
    className={classes.right_images_bottom_image}
    href={`/apartments/${apartment.id}`}
  >
    <div className={classes.badge}>
      ${apartment.cheapest_variant?.price || "N/A"}
      <p className={classes.pernight}>per night</p>
    </div>
    <div className={classes.room_title}>
      {apartment.name || getTypeDisplayName(apartment.type)}
    </div>
    <img
      src={apartment.image || getTypeImage(apartment.type)}
      alt={apartment.name || getTypeDisplayName(apartment.type)}
    />
  </Link>
);

export const getTypeImage = (type?: string) => {
  switch (type) {
    case "LUXURY":
      return luxury_suite.src;
    case "BUDGET":
      return budget_room.src;
    case "SUPERIOR":
      return superior_room.src;
    case "EXCLUSIVE":
      return executive_room.src;
    default:
      return standard_room.src;
  }
};

export const getTypeDisplayName = (type?: string) => {
  switch (type) {
    case "LUXURY":
      return "Luxury Suite";
    case "BUDGET":
      return "Budget Room";
    case "SUPERIOR":
      return "Superior Room";
    case "EXCLUSIVE":
      return "Executive Room";
    default:
      return "Standard Room";
  }
};
