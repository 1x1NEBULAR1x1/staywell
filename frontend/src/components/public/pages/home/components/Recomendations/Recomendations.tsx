"use client";

import type { ExtendedApartment } from "@shared/src/types/apartments-section";
import { useMemo } from "react";
import { ApartmentCard } from "./components";
import classes from "./Recomendations.module.scss";

const APARTMENT_TYPES = [
  "BUDGET",
  "STANDARD",
  "EXCLUSIVE",
  "SUPERIOR",
  "LUXURY",
];

export const Recomendations = ({
  apartments,
}: {
  apartments: ExtendedApartment[];
}) => {
  // Select exactly 5 apartments with different types where possible
  const recomendations_apartments = useMemo(() => {
    const result: ExtendedApartment[] = [];
    const used_types = new Set<string>();

    // First pass: try to get one of each type
    for (const type of APARTMENT_TYPES) {
      if (result.length >= 5) break;
      const apartment = apartments.find(
        (apt) => apt.type === type && !used_types.has(apt.type),
      );
      if (apartment) {
        result.push(apartment);
        used_types.add(apartment.type);
      }
    }

    // Second pass: fill remaining slots with any available apartments
    if (result.length < 5) {
      for (const apartment of apartments) {
        if (result.length >= 5) break;
        if (!result.find((a) => a.id === apartment.id)) {
          result.push(apartment);
        }
      }
    }

    // Sort by APARTMENT_TYPES order in descending order (LUXURY -> BUDGET)
    return result.sort((a, b) => {
      const index_a = APARTMENT_TYPES.indexOf(a.type);
      const index_b = APARTMENT_TYPES.indexOf(b.type);
      return index_b - index_a;
    });
  }, [apartments]);

  return (
    recomendations_apartments && (
      <section className={classes.section_recommendations}>
        <h2 className={classes.title}>Most Picked</h2>

        <div className={classes.grid_container}>
          <div className={classes.large_card}>
            <ApartmentCard apartment={recomendations_apartments[0]} isLarge />
          </div>

          {recomendations_apartments.slice(1).map((apartment) => (
            <ApartmentCard key={apartment.id} apartment={apartment} />
          ))}
        </div>
      </section>
    )
  );
};
