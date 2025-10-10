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
        <Shimmer className={classes.amenity_row_avatar} />
        <div className={classes.amenity_row_name_container_info}>
          <Shimmer className={classes.amenity_row_name_container_info_name} style={{ width: '100px' }} />
          <Shimmer className={classes.amenity_row_name_container_info_description} style={{ width: '300px' }} />
        </div>
      </div>
    </td>
    <td ><Shimmer className={classes.amenity_row_created} style={{ width: '100px' }} /></td>
  </tr >
)