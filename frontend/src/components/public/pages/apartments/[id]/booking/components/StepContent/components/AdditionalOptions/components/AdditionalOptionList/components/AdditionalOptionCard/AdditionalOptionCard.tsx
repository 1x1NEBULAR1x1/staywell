"use client";

import type { AdditionalOption } from "@shared/src/database";
import { Plus } from "lucide-react";
import Image from "next/image";
import no_image from "@/../public/common/no-image.jpeg";
import { useBookingAdditionalOptions } from "@/hooks/public/booking/useBookingAdditionalOptions";
import { getImageUrl } from "@/lib/api/utils/image-url";
import classes from "./AdditionalOptionCard.module.scss";

export const AdditionalOptionCard = ({
  additional_option,
}: {
  additional_option: AdditionalOption;
}) => {
  const { addAdditionalOption } = useBookingAdditionalOptions();

  return (
    <div className={classes.card}>
      {/* Image */}
      <div className={classes.image_container}>
        <Image
          src={getImageUrl(additional_option.image) || no_image.src}
          alt={additional_option.name}
          className={classes.image}
          width={500}
          height={500}
          quality={100}
        />
        <div className={classes.price_badge}>
          ${additional_option.price.toFixed(2)}
        </div>
      </div>

      {/* Content */}
      <div className={classes.content}>
        <div className={classes.info}>
          <h3 className={classes.title}>{additional_option.name}</h3>
          <p className={classes.description}>{additional_option.description}</p>
        </div>

        <div className={classes.controls}>
          <button
            type="button"
            className={classes.add_button}
            onClick={() => addAdditionalOption(additional_option.id)}
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
