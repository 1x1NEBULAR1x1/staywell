"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import classes from "./ImageModal.module.scss";

interface ImageData {
  id: string;
  image: string;
  name?: string | null;
}

interface ImageModalProps {
  is_open: boolean;
  onClose: () => void;
  images: ImageData[];
  current_index: number;
  onImageChange: (index: number) => void;
}

export const ImageModal = ({
  is_open,
  onClose,
  images,
  current_index,
  onImageChange,
}: ImageModalProps) => {
  const [is_mounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (is_open) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => document.body.classList.remove("modal-open");
  }, [is_open]);

  const handlePrevious = useCallback(() => {
    const new_index = current_index > 0 ? current_index - 1 : images.length - 1;
    onImageChange(new_index);
  }, [current_index, images.length, onImageChange]);

  const handleNext = useCallback(() => {
    const new_index = current_index < images.length - 1 ? current_index + 1 : 0;
    onImageChange(new_index);
  }, [current_index, images.length, onImageChange]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };

    if (is_open) document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, [is_open, handleNext, handlePrevious, onClose]);

  if (!is_mounted || !is_open || images.length === 0) {
    return null;
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const current_image = images[current_index];

  return (
    <button
      type="button"
      className={classes.modal_overlay}
      onClick={handleOverlayClick}
    >
      <div className={classes.modal_content}>
        <div className={classes.main_image_container}>
          <button
            type="button"
            className={classes.close_button}
            onClick={onClose}
          >
            <X size={24} />
          </button>
          <Image
            src={current_image.image}
            alt={current_image.name || "Event"}
            fill
            className={classes.main_image}
            sizes="100vw"
            priority
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                className={`${classes.nav_button} ${classes.nav_button_left}`}
                onClick={handlePrevious}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                className={`${classes.nav_button} ${classes.nav_button_right}`}
                onClick={handleNext}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className={classes.thumbnails_container}>
            <div className={classes.thumbnails_slider}>
              {images.map((image, index) => (
                <button
                  type="button"
                  key={image.id}
                  className={`${classes.thumbnail} ${index === current_index ? classes.thumbnail_active : ""}`}
                  onClick={() => onImageChange(index)}
                >
                  <Image
                    src={image.image}
                    alt={image.name || "Event"}
                    fill
                    className={classes.thumbnail_image}
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </button>
  );
};
