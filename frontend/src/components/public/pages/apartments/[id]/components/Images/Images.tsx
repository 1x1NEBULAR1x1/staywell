"use client";

import type { ExtendedApartment } from "@shared/src";
import Image from "next/image";
import { useState } from "react";
import no_image from "@/../public/common/no-image.jpeg";
import { getImageUrl } from "@/lib/api/utils/image-url";
import { ImageModal } from "../ImageModal";
import classes from "./Images.module.scss";

interface ImageData {
  id: string;
  image: string;
  name?: string | null;
}

export const Images = ({ apartment }: { apartment: ExtendedApartment }) => {
  const all_images: ImageData[] = [
    {
      id: "main",
      image: apartment.image || no_image.src,
      name: apartment.name || "Main apartment image",
    },
    ...apartment.images.map((img) => ({
      id: img.id,
      image: getImageUrl(img.image) || no_image.src,
      name: img.name,
    })),
  ];

  const [current_image_index, setCurrentImageIndex] = useState(0);
  const [is_modal_open, setIsModalOpen] = useState(false);

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleMainImageClick = () => {
    setIsModalOpen(true);
  };

  const currentImage = all_images[current_image_index];

  return (
    <>
      <div className={classes.images_gallery}>
        <div className={classes.main_image_container}>
          <Image
            src={currentImage.image}
            alt={currentImage.name || "Apartment"}
            fill
            className={classes.main_image}
            sizes="(max-width: 768px) 100vw, 60vw"
            quality={95}
            priority
            onClick={handleMainImageClick}
          />
        </div>

        {all_images.length > 1 && (
          <div className={classes.thumbnails_container}>
            <div className={classes.thumbnails_slider}>
              {all_images.map((image, index) => (
                <button
                  type="button"
                  key={image.id}
                  className={`${classes.thumbnail} ${index === current_image_index ? classes.thumbnail_active : ""}`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <Image
                    src={image.image}
                    alt={image.name || "Apartment"}
                    fill
                    className={classes.thumbnail_image}
                    sizes="140px"
                    quality={90}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <ImageModal
        is_open={is_modal_open}
        onClose={() => setIsModalOpen(false)}
        images={all_images}
        current_index={current_image_index}
        onImageChange={setCurrentImageIndex}
      />
    </>
  );
};
