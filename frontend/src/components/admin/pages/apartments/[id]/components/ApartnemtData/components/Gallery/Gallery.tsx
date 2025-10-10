import classes from './Gallery.module.scss';
import no_image from '@/../public/common/no-image.jpeg';

import { ExtendedApartment } from '@shared/src';
import Image from 'next/image';
import { useState } from 'react';
import { GalleryImage, AddImageModal } from './components';
import { AddButton } from '../AddButton';

export const Gallery = ({ apartment }: { apartment: ExtendedApartment }) => {
  const [currentImage, setCurrentImage] = useState<{ src: string, alt: string }>({ src: apartment.image || no_image.src, alt: apartment.name || 'Apartment' });
  const [is_modal_open, setIsModalOpen] = useState(false);

  return (
    <>
      <div className={classes.gallery}>
        <div className={classes.current_image_container}>
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            quality={100}
            width={300}
            height={300}
            priority
          />
        </div>
        <div className={classes.images_grid}>
          <GalleryImage
            image={{ src: apartment.image || no_image.src, alt: apartment.name || 'Apartment', id: apartment.id, name: apartment.name }}
            setCurrentImage={setCurrentImage}
            is_selected={currentImage.src === apartment.image}
            root
          />
          {apartment.images.map((image) => (
            <GalleryImage
              key={image.id}
              image={{ src: image.image || no_image.src, alt: image.name || 'Apartment', id: image.id, name: image.name }}
              setCurrentImage={setCurrentImage}
              is_selected={currentImage.src === image.image}
            />
          ))}
          <AddButton onClick={() => setIsModalOpen(!is_modal_open)} size={48} />
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