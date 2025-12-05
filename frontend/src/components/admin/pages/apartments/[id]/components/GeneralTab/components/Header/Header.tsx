"use client";

import Image from "next/image";
import { useState } from "react";
import no_image from "@/../public/common/no-image.jpeg";
import { ApartmentModal } from "@/components/admin/pages/apartments/ApartmentModal";
import { useModel } from "@/hooks/admin/queries";
import { usePId } from "@/hooks/common/useId";
import { MainData, MetaData } from "./components";
import classes from "./Header.module.scss";

export const Header = () => {
  const { data: apartment } = useModel("APARTMENT").find(usePId());
  const [is_modal_open, setIsModalOpen] = useState(false);

  const mainImage =
    apartment?.images?.[0]?.image || apartment?.image || no_image.src;

  return (
    !!apartment && (
      <>
        <div className={classes.header_section}>
          <div className={classes.preview_image_container}>
            <Image
              src={mainImage}
              alt={apartment.name || "Apartment"}
              fill
              className={classes.preview_image}
            />
            <div className={classes.image_overlay}>
              <span className={classes.image_count}>
                {apartment.images.length + (apartment.image ? 1 : 0)} photos
              </span>
            </div>
          </div>

          <div className={classes.main_info_container}>
            <MainData setIsModalOpen={setIsModalOpen} />
            <MetaData />
          </div>
        </div>

        {is_modal_open && (
          <ApartmentModal
            initial_data={apartment}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </>
    )
  );
};
