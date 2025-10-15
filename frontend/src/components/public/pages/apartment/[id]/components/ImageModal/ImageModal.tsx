'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import classes from './ImageModal.module.scss';

interface ImageData {
  id: string;
  image: string;
  name?: string | null;
}

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: ImageData[];
  currentIndex: number;
  onImageChange: (index: number) => void;
}

export const ImageModal = ({ isOpen, onClose, images, currentIndex, onImageChange }: ImageModalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };

    if (isOpen) document.addEventListener('keydown', handleEscape);

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, currentIndex]);

  if (!isMounted || !isOpen || images.length === 0) {
    return null;
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    onImageChange(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    onImageChange(newIndex);
  };

  const currentImage = images[currentIndex];

  return (
    <div className={classes.modal_overlay} onClick={handleOverlayClick}>
      <div className={classes.modal_content}>
        <div className={classes.main_image_container}>
          <button
            className={classes.close_button}
            onClick={onClose}
          >
            <X size={24} />
          </button>
          <Image
            src={currentImage.image}
            alt={currentImage.name || 'Apartment'}
            fill
            className={classes.main_image}
            sizes="100vw"
            priority
          />

          {images.length > 1 && (
            <>
              <button
                className={`${classes.nav_button} ${classes.nav_button_left}`}
                onClick={handlePrevious}
              >
                <ChevronLeft size={24} />
              </button>
              <button
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
                  key={image.id}
                  className={`${classes.thumbnail} ${index === currentIndex ? classes.thumbnail_active : ''}`}
                  onClick={() => onImageChange(index)}
                >
                  <Image
                    src={image.image}
                    alt={image.name || 'Apartment'}
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
    </div>
  );
};
