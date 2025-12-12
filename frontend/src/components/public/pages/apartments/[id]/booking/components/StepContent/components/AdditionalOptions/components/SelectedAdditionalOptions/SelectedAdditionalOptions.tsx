"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useBookingState } from "@/hooks/public/booking";
import { useBookingAdditionalOptions } from "@/hooks/public/booking/useBookingAdditionalOptions";
import { SelectedAdditionalOptionCard } from "./components/SelectedAdditionalOptionCard/SelectedAdditionalOptionCard";
import classes from "./SelectedAdditionalOptions.module.scss";

export const SelectedAdditionalOptions = () => {
  const { selected_additional_options } = useBookingAdditionalOptions();
  const { additional_options } = useBookingAdditionalOptions();
  const { getNextStep } = useBookingState();
  const { id } = useParams<{ id: string }>();

  // Calculate total price
  const total_price = selected_additional_options.reduce(
    (total, selected_additional_option) => {
      const additional_option = additional_options.find(
        (ao) => ao.id === selected_additional_option.additional_option_id,
      );
      return (
        total +
        (additional_option?.price || 0) * selected_additional_option.amount
      );
    },
    0,
  );

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h3>
          Selected additional options ({selected_additional_options.length})
        </h3>
      </div>

      <div className={classes.additional_options_scroll}>
        {selected_additional_options.length > 0 ? (
          selected_additional_options.map((selected_additional_option) => (
            <SelectedAdditionalOptionCard
              key={`${selected_additional_option.additional_option_id}-${selected_additional_option.amount}`}
              selected_additional_option={selected_additional_option}
            />
          ))
        ) : (
          <div className={classes.empty_state}>
            <span>No additional options selected</span>
          </div>
        )}
      </div>

      {selected_additional_options.length > 0 && (
        <div className={classes.summary}>
          <div className={classes.total}>
            <span className={classes.total_label}>Total:</span>
            <span className={classes.total_amount}>
              ${total_price.toFixed(2)}
            </span>
          </div>
          <Link
            href={`/apartments/${id}/booking/${getNextStep("additional_options")}`}
            className={classes.next_button}
          >
            <span>Continue</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
};
