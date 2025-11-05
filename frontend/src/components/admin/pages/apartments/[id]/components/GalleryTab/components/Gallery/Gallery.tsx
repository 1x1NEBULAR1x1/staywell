import classes from './Gallery.module.scss';
import no_image from '@/../public/common/no-image.jpeg';

import { ExtendedApartment } from '@shared/src';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { AddImageModal } from './components';
import { Plus, Trash2, Star, SquareX } from 'lucide-react';
import { useModel } from '@/hooks/admin/queries/useModel';
import { usePId } from '@/hooks/common/useId';

export const Gallery = ({ apartment }: { apartment: ExtendedApartment }) => {
  const id = usePId();
  const { refetch } = useModel('APARTMENT').find(id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [is_modal_open, setIsModalOpen] = useState(false);
  // Combine main image and gallery images
  const allImages = useMemo(() => [
    { src: apartment.image || no_image.src, alt: apartment.name || 'Main image', id: apartment.id, isMain: true, isExcluded: false },
    ...apartment.images.map(img => ({
      src: img.image || no_image.src,
      alt: img.name || 'Apartment image',
      id: img.id,
      isMain: false,
      isExcluded: img.is_excluded,
      dbImage: img
    }))
  ], [apartment]);
  const currentImage = allImages[currentImageIndex];

  const delete_image_mutation = useModel('APARTMENT_IMAGE').remove(currentImage.id);
  const update_apartment_mutation = useModel('APARTMENT').update(id);

  const handleDeleteImage = async () => {
    if (currentImage.isMain) {
      // If deleting main image, set it to null
      try {
        await update_apartment_mutation.mutateAsync({
          image: undefined
        });
        if (currentImageIndex === 0) {
          setCurrentImageIndex(0);
        }
        refetch();
      } catch (error) {
        console.error('Failed to delete main image:', error);
      }
    } else {
      // Delete from gallery
      try {
        await delete_image_mutation.mutateAsync();
        if (currentImageIndex >= allImages.length - 1) {
          setCurrentImageIndex(Math.max(0, currentImageIndex - 1));
        }
        refetch();
      } catch (error) {
        console.error('Failed to delete image:', error);
      }
    }
  };

  const handleSetAsMain = async (imageSrc: string) => {
    try {
      await update_apartment_mutation.mutateAsync({
        image: imageSrc
      });
      refetch();
    } catch (error) {
      console.error('Failed to set main image:', error);
    }
  };

  return (
    <>
      <div className={classes.gallery}>
        {/* Main Image Display */}
        <div className={classes.main_image_section}>
          <div className={`${classes.current_image_container} ${currentImage.isExcluded ? classes.excluded_image : ''}`}>
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              quality={100}
              fill
              priority
              className={classes.current_image}
            />
            {currentImage.isExcluded && (
              <div className={classes.excluded_overlay}>
                <div className={classes.excluded_badge}>
                  <span>Excluded</span>
                  <span className={classes.excluded_text}>This image will not be displayed to users</span>
                </div>
              </div>
            )}
            {allImages.length > 1 && (
              <div className={classes.image_navigation}>
                <button
                  className={classes.nav_button}
                  onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                  disabled={currentImageIndex === 0}
                >
                  ←
                </button>
                <span className={classes.image_counter}>
                  {currentImageIndex + 1} / {allImages.length}
                </span>
                <button
                  className={classes.nav_button}
                  onClick={() => setCurrentImageIndex(Math.min(allImages.length - 1, currentImageIndex + 1))}
                  disabled={currentImageIndex === allImages.length - 1}
                >
                  →
                </button>
              </div>
            )}
          </div>

          {/* Image Actions */}
          <div className={classes.image_actions}>
            {!currentImage.isMain && (
              <button
                className={classes.action_button}
                onClick={() => handleSetAsMain(currentImage.src)}
                title="Set as main image"
              >
                <Star size={16} />
                Set as Main
              </button>
            )}
            {currentImage.isMain && (
              <div className={classes.main_badge}>
                <Star size={14} fill="currentColor" />
                Main Image
              </div>
            )}
            <button
              className={`${classes.action_button} ${classes.delete_button}`}
              onClick={handleDeleteImage}
              title={currentImage.isExcluded ? "Permanently delete image" : "Delete image"}
            >
              <Trash2 size={16} />
              {currentImage.isExcluded ? "Permanently delete" : "Delete"}
            </button>
          </div>
        </div>

        {/* Thumbnails Grid */}
        <div className={classes.thumbnails_section}>
          <div className={classes.thumbnails_grid}>
            {allImages.map((image, index) => (
              <div
                key={image.id}
                className={`${classes.thumbnail} ${currentImageIndex === index ? classes.thumbnail_active : ''} ${image.isMain ? classes.thumbnail_main : ''} ${image.isExcluded ? classes.thumbnail_excluded : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={80}
                  height={80}
                  className={classes.thumbnail_image}
                />
                {image.isMain && (
                  <div className={classes.main_indicator}>
                    <Star size={12} fill="currentColor" />
                  </div>
                )}
                {image.isExcluded && (
                  <div className={classes.excluded_indicator}>
                    <SquareX size={14} />
                  </div>
                )}
              </div>
            ))}

            {/* Add Image Button */}
            <button
              className={classes.add_thumbnail}
              onClick={() => setIsModalOpen(true)}
              title="Add new image"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>
      </div>

      {is_modal_open && (
        <AddImageModal
          apartment_id={apartment.id}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  )
};