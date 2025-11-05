import classes from './GalleryImage.module.scss';
import no_image from '@/../public/common/no-image.jpeg';
import clsx from 'clsx';

import Image from 'next/image';


type GalleryImageProps = {
  image: { src: string, alt: string, id: string, name: string | null };
  root?: boolean
  is_selected: boolean;
  setCurrentImage: (image: { src: string, alt: string }) => void;
}

export const GalleryImage = ({ image, setCurrentImage, is_selected, root }: GalleryImageProps) => (
  <Image
    key={image.id}
    src={image.src || no_image.src}
    alt={image.name || 'Apartment'}
    quality={100}
    width={150}
    height={150}
    priority
    className={clsx(classes.image_item, root && classes.image_item_root, is_selected && classes.image_item_selected)}
    onClick={() => setCurrentImage({ src: image.src || no_image.src, alt: image.name || 'Apartment image' })}
  />
);