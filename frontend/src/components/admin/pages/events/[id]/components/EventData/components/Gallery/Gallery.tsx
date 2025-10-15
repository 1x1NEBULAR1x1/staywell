import classes from './Gallery.module.scss';
import no_image from '@/../public/common/no-image.jpeg';

import { ExtendedEvent } from '@shared/src';
import Image from 'next/image';
import { useState } from 'react';
import { GalleryImage, AddImageModal } from './components';
import { AddButton } from '../AddButton';

export const Gallery = ({ event }: { event: ExtendedEvent }) => {
  const [currentImage, setCurrentImage] = useState<{ src: string, alt: string }>({ src: event.image || no_image.src, alt: event.name || 'Event' });
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
            image={{ src: event.image || no_image.src, alt: event.name || 'Event', id: event.id, name: event.name }}
            setCurrentImage={setCurrentImage}
            is_selected={currentImage.src === event.image}
            root
          />
          {event.images.map((image) => (
            <GalleryImage
              key={image.id}
              image={{ src: image.image || no_image.src, alt: image.name || 'Event', id: image.id, name: image.name }}
              setCurrentImage={setCurrentImage}
              is_selected={currentImage.src === image.image}
            />
          ))}
          <AddButton onClick={() => setIsModalOpen(!is_modal_open)} size={48} />
        </div>
      </div>

      {is_modal_open && (
        <AddImageModal
          event_id={event.id}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  )
};