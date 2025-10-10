import classes from './ApartmentCard.module.scss';
import no_image from '@/../public/common/no-image.jpeg';

import Image from 'next/image';
import { ExtendedApartment } from '@shared/src';
import { Shimmer } from '@/components/styles';
import { useRouter } from 'next/navigation';


export const ApartmentCard = ({ apartment }: { apartment: ExtendedApartment }) => {
  const router = useRouter();
  return (
    <tr className={classes.apartment_row} onClick={() => router.push(`/admin/apartments/${apartment.id}`)}>
      <td>
        <div className={classes.apartment_row_name_container}>
          <Image
            src={apartment.image || no_image.src}
            alt="No Image"
            width={500}
            height={500}
            className={classes.apartment_row_avatar}
          />
          <div className={classes.apartment_row_name_container_info}>
            <p className={classes.apartment_row_name_container_info_name}>
              {apartment.name}
              <span className={classes.apartment_row_name_container_info_location}>
                {apartment.floor} - {apartment.number}
              </span>
            </p>
            <p className={classes.apartment_row_name_container_info_description}>
              {apartment.description || 'No description'}
            </p>
          </div>
        </div>
      </td>
      <td ><span
        className={`${classes.apartment_row_status} ${apartment.is_available ? classes.apartment_row_status_available : classes.apartment_row_status_unavailable}`}>
        {apartment.is_available ? 'Available' : 'Unavailable'}
      </span></td>
      <td ><span className={classes.apartment_row_type}>{apartment.type.toLowerCase()}</span></td>
      <td className={classes.apartment_row_created}>{new Date(apartment.created).toDateString()}</td>
    </tr >
  );
}


export const ApartmentCardShimmer = () => (
  <tr className={classes.apartment_row}>
    <td>
      <div className={classes.apartment_row_name_container}>
        <Shimmer className={classes.apartment_row_avatar} />
        <div className={classes.apartment_row_name_container_info}>
          <Shimmer className={classes.apartment_row_name_container_info_name} />
          <Shimmer className={classes.apartment_row_name_container_info_description} />
        </div>
      </div>
    </td>
    <td ><Shimmer className={classes.apartment_row_role} /></td>
    <td ><Shimmer className={classes.apartment_row_status} /></td>
    <td ><Shimmer className={classes.apartment_row_created} /></td>
  </tr >
)