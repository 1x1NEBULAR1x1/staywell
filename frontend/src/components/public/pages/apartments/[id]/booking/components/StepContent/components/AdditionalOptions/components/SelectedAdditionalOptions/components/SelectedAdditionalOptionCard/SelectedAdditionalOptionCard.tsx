"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import no_image from "@/../public/common/no-image.jpeg";
import { useBookingAdditionalOptions } from "@/hooks/public/booking/useBookingAdditionalOptions";
import { getImageUrl } from "@/lib/api/utils/image-url";
import type { SelectedAdditionalOption } from "@/stores/public/pages/booking/useBookingStore";
import classes from "./SelectedAdditionalOptionCard.module.scss";

export const SelectedAdditionalOptionCard = ({
  selected_additional_option,
}: {
  selected_additional_option: SelectedAdditionalOption;
}) => {
  const { additional_options } = useBookingAdditionalOptions();

  const additional_option = additional_options.find(
    (ao) => ao.id === selected_additional_option.additional_option_id,
  );

  const { updateAdditionalOptionAmount, removeAdditionalOption } =
    useBookingAdditionalOptions();

  const handleUpdateAmount = (newAmount: number) => {
    if (newAmount < 1) return;
    updateAdditionalOptionAmount(
      selected_additional_option.additional_option_id,
      newAmount,
    );
  };

  const handleRemove = () => {
    removeAdditionalOption(selected_additional_option.additional_option_id);
  };

  const increment = () =>
    handleUpdateAmount(selected_additional_option.amount + 1);
  const decrement = () =>
    handleUpdateAmount(selected_additional_option.amount - 1);

  return (
    additional_option && (
      <div className={classes.card}>
        {/* Image */}
        <div className={classes.image_container}>
          <Image
            src={getImageUrl(additional_option.image) ?? no_image.src}
            alt={additional_option.name}
            className={classes.image}
            width={500}
            height={500}
            quality={100}
          />
          <div className={classes.price_badge}>
            ${additional_option.price.toFixed(2)}
          </div>
          <button
            type="button"
            className={classes.remove_button}
            onClick={handleRemove}
            title="Remove additional option"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Content */}
        <div className={classes.content}>
          <div className={classes.info}>
            <h3 className={classes.title}>{additional_option.name}</h3>
            <p className={classes.description}>
              {additional_option.description.length > 80
                ? `${additional_option.description.substring(0, 80)}...`
                : additional_option.description}
            </p>
          </div>

          {/* Controls */}
          <div className={classes.controls}>
            <div className={classes.amount_control}>
              <span className={classes.amount_label}>Quantity:</span>
              <div className={classes.counter}>
                <button
                  type="button"
                  className={classes.counter_button}
                  onClick={decrement}
                  disabled={selected_additional_option.amount <= 1}
                >
                  <Minus size={18} />
                </button>
                <span className={classes.count}>
                  {selected_additional_option.amount}
                </span>
                <button
                  type="button"
                  className={classes.counter_button}
                  onClick={increment}
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div className={classes.price_info}>
              <span className={classes.unit_price}>
                ${additional_option.price.toFixed(2)} ×{" "}
                {selected_additional_option.amount}
              </span>
              <span className={classes.total_price}>
                $
                {(
                  additional_option.price * selected_additional_option.amount
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  );
};
