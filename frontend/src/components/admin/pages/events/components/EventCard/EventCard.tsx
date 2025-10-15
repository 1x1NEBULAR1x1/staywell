import classes from './EventCard.module.scss';
import no_image from '@/../public/common/no-image.jpeg';

import Image from 'next/image';
import { ExtendedEvent } from '@shared/src';
import { Shimmer } from '@/components/styles';
import { useRouter } from 'next/navigation';


export const EventCard = ({ event }: { event: ExtendedEvent }) => {
  const router = useRouter();
  const is_available = Date.now() < new Date(event.start).getTime();
  return (
    <tr className={classes.apartment_row} onClick={() => router.push(`/admin/events/${event.id}`)}>
      <td>
        <div className={classes.apartment_row_name_container}>
          <Image
            src={event.image || no_image.src}
            alt="No Image"
            width={500}
            height={500}
            className={classes.apartment_row_avatar}
          />
          <div className={classes.apartment_row_name_container_info}>
            <p className={classes.apartment_row_name_container_info_name}>
              {event.name}
              <span className={classes.apartment_row_name_container_info_location}>
                {new Date(event.start).toLocaleString()} - {new Date(event.end).toLocaleString()}
              </span>
            </p>
            <p className={classes.apartment_row_name_container_info_description}>
              {event.description || 'No description'}
            </p>
          </div>
        </div>
      </td>
      <td><span
        className={`${classes.apartment_row_status} ${is_available ? classes.apartment_row_status_available : classes.apartment_row_status_unavailable}`}>
        {is_available ? 'Available' : 'Unavailable'}
      </span></td>
      <td><span className={classes.apartment_row_type}>Capacity: {event.capacity}</span></td>
      <td className={classes.apartment_row_created}>{new Date(event.created).toDateString()}</td>
    </tr >
  );
}


export const EventCardShimmer = () => (
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
    <td><Shimmer className={classes.apartment_row_role} /></td>
    <td><Shimmer className={classes.apartment_row_status} /></td>
    <td><Shimmer className={classes.apartment_row_created} /></td>
  </tr >
)