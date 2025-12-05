"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useModel } from "@/hooks/admin/queries/useModel";
import { BookingVariantFornModal } from "../BookingVariantsTab/components/BookingVariantFornModal/BookingVariantFornModal";
import { BookingVariantsList } from "../BookingVariantsTab/components/BookingVariantsList/BookingVariantsList";
import classes from "./BookingVariantsSection.module.scss";

export const BookingVariantsSection = () => {
  const { id } = useParams<{ id: string }>();
  const { data: apartment } = useModel("APARTMENT").find(id);
  const [isAddingVariant, setIsAddingVariant] = useState(false);

  return (
    <div className={classes.booking_variants}>
      <div className={classes.header}>
        <h3 className={classes.title}>Booking Variants</h3>
        <button
          className={classes.add_button}
          onClick={() => setIsAddingVariant(!isAddingVariant)}
        >
          {isAddingVariant ? "Cancel" : "+ Add Variant"}
        </button>
      </div>

      {/* Add Variant Form */}
      {isAddingVariant && (
        <BookingVariantFornModal onClose={() => setIsAddingVariant(false)} />
      )}

      {/* Variants List */}
      <BookingVariantsList
        booking_variants={apartment?.booking_variants || []}
      />
    </div>
  );
};
