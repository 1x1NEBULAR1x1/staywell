import type { ExtendedApartment } from "@shared/src/types/apartments-section/extended.types";
import { House } from "lucide-react";
import Image from "next/image";
import default_image from "@/../public/common/no-image.jpeg";
import { getImageUrl } from "@/lib/api/utils/image-url";
import classes from "./ApartmentData.module.scss";

export const ApartmentData = ({
  apartment,
}: {
  apartment: ExtendedApartment;
}) => (
  <div className={classes.container}>
    <div className={classes.header}>
      <House size={24} />
      <h3>Selected apartment</h3>
    </div>
    <Image
      src={getImageUrl(apartment.image) ?? default_image.src}
      alt={apartment.name ?? "Apartment image"}
      width={400}
      height={300}
      className={classes.image}
    />
    <div className={classes.info}>
      <h3 className={classes.basic}>
        {apartment.name}{" "}
        <span className={classes.type}>{apartment.type.toLowerCase()}</span>
      </h3>
      <p className={classes.meta}>
        Max capacity: <span>up to {apartment.max_capacity} guests</span>
      </p>
      <p className={classes.meta}>
        Location:{" "}
        <span>
          Floor {apartment.floor}, Room {apartment.number}
        </span>
      </p>
    </div>
  </div>
);
