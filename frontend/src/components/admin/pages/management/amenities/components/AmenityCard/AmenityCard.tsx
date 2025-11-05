'use client'

import classes from './AmenityCard.module.scss';
import no_image from '@/../public/common/no-image.jpeg';

import Image from 'next/image';
import { Amenity, ExtendedAmenity } from '@shared/src';
import { Shimmer } from '@/components/styles';

type AmenityCardProps = {
  amenity: ExtendedAmenity;
  setEditAmenityData: (amenity: Amenity) => void;
}

export const AmenityCard = ({ amenity, setEditAmenityData }: AmenityCardProps) => (
  <tr className={classes.amenity_row} onClick={() => setEditAmenityData(amenity)} >
    <td>
      <div className={classes.amenity_row_name_container}>
        <Image
          src={amenity.image || no_image.src}
          alt="No Image"
          width={500}
          height={500}
          className={classes.amenity_row_avatar}
        />
        <div className={classes.amenity_row_name_container_info}>
          <p className={classes.amenity_row_name_container_info_name}>
            {amenity.name}
          </p>
          <p className={classes.amenity_row_name_container_info_description}>
            {amenity.description || 'No description'}
          </p>
        </div>
      </div>
    </td>
    <td className={classes.amenity_row_created}>{new Date(amenity.created).toDateString()}</td>
  </tr>
);


export const AmenityCardShimmer = () => (
  <tr className={classes.amenity_row}>
    <td>
      <div className={classes.amenity_row_name_container}>
        <Shimmer style={{ width: '6rem', height: '6rem', borderRadius: '4px' }} />
        <div className={classes.amenity_row_name_container_info}>
          <Shimmer style={{ width: '150px', height: '18px', borderRadius: '4px' }} />
          <Shimmer style={{ width: '200px', height: '14px', borderRadius: '4px' }} />
        </div>
      </div>
    </td>
    <td><Shimmer style={{ width: '120px', height: '14px', borderRadius: '4px' }} /></td>
  </tr >
)