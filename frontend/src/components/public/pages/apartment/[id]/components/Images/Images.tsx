'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ExtendedApartment } from '@shared/src';
import { ImageModal } from '../ImageModal';
import { getImageUrl } from '@/lib/api/utils/image-url';
import classes from './Images.module.scss';
import no_image from '@/../public/common/no-image.jpeg';

interface ImageData {
  id: string;
  image: string;
  name?: string | null;
}

export const Images = ({ apartment }: { apartment: ExtendedApartment }) => {
  const allImages: ImageData[] = [
    {
      id: 'main',
      image: apartment.image || no_image.src,
      name: apartment.name || 'Main apartment image'
    },
    ...apartment.images.map(img => ({
      id: img.id,
      image: getImageUrl(img.image) || no_image.src,
      name: img.name
    }))
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleMainImageClick = () => {
    setIsModalOpen(true);
  };

  const currentImage = allImages[currentImageIndex];

  return (
    <>
      <div className={classes.images_gallery}>
        <div className={classes.main_image_container}>
          <Image
            src={currentImage.image}
            alt={currentImage.name || 'Apartment'}
            fill
            className={classes.main_image}
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
            onClick={handleMainImageClick}
          />
        </div>

        {allImages.length > 1 && (
          <div className={classes.thumbnails_container}>
            <div className={classes.thumbnails_slider}>
              {allImages.map((image, index) => (
                <button
                  key={image.id}
                  className={`${classes.thumbnail} ${index === currentImageIndex ? classes.thumbnail_active : ''}`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <Image
                    src={image.image}
                    alt={image.name || 'Apartment'}
                    fill
                    className={classes.thumbnail_image}
                    sizes="120px"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={allImages}
        currentIndex={currentImageIndex}
        onImageChange={setCurrentImageIndex}
      />
    </>
  );
};