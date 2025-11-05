import classes from './EventRow.module.scss';
import no_image from '@/../public/common/no-image.jpeg';

import Image from 'next/image';
import { ExtendedEvent } from '@shared/src';
import { Shimmer } from '@/components/styles';
import { useRouter } from 'next/navigation';


export const EventRow = ({ event }: { event: ExtendedEvent }) => {
  const router = useRouter();
  const is_available = Date.now() < new Date(event.start).getTime();
  return (
    <tr className={classes.event_row} onClick={() => router.push(`/admin/events/${event.id}`)}>
      <td>
        <div className={classes.event_row_name_container}>
          <Image
            src={event.image || no_image.src}
            alt="No Image"
            width={500}
            height={500}
            className={classes.event_row_avatar}
          />
          <div className={classes.event_row_name_container_info}>
            <p className={classes.event_row_name_container_info_name}>
              {event.name}
              <span className={classes.event_row_name_container_info_location}>
                {new Date(event.start).toLocaleString()} - {new Date(event.end).toLocaleString()}
              </span>
            </p>
            <p className={classes.event_row_name_container_info_description}>
              {event.description || 'No description'}
            </p>
          </div>
        </div>
      </td>
      <td><span
        className={`${classes.event_row_status} ${is_available ? classes.event_row_status_available : classes.event_row_status_unavailable}`}>
        {is_available ? 'Available' : 'Unavailable'}
      </span></td>
      <td><span className={classes.event_row_type}>{event.capacity}</span></td>
      <td className={classes.event_row_created}>{new Date(event.created).toDateString()}</td>
    </tr >
  );
}


export const EventRowShimmer = () => (
  <tr className={classes.event_row}>
    <td>
      <div className={classes.event_row_name_container}>
        <Shimmer style={{ width: '6rem', height: '6rem', borderRadius: '4px' }} />
        <div className={classes.event_row_name_container_info}>
          <Shimmer style={{ width: '150px', height: '18px', borderRadius: '4px' }} />
          <Shimmer style={{ width: '200px', height: '14px', borderRadius: '4px' }} />
        </div>
      </div>
    </td>
    <td><Shimmer style={{ width: '100px', height: '24px', borderRadius: '4px' }} /></td>
    <td><Shimmer style={{ width: '110px', height: '24px', borderRadius: '4px' }} /></td>
    <td><Shimmer style={{ width: '120px', height: '14px', borderRadius: '4px' }} /></td>
  </tr >
)