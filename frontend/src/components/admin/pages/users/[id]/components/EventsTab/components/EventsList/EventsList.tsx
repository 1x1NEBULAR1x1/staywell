import classes from './EventsList.module.scss';
import { ExtendedEvent } from '@shared/src';

export const EventsList = ({ events }: { events: ExtendedEvent[] }) => {
  if (events.length === 0) {
    return <p className={classes.empty}>No events found</p>;
  }

  return (
    <div className={classes.events_list}>
      {events.map((event) => (
        <div key={event.id} className={classes.event_item}>
          <div className={classes.event_header}>
            <span className={classes.event_name}>{event.name}</span>
            <span className={classes.price}>${event.price}</span>
          </div>

          <div className={classes.event_details}>
            <div className={classes.detail}>
              <span className={classes.label}>Capacity:</span>
              <span>{event.capacity}</span>
            </div>
            <div className={classes.detail}>
              <span className={classes.label}>Dates:</span>
              <span>{new Date(event.start).toLocaleDateString()} - {new Date(event.end).toLocaleDateString()}</span>
            </div>
          </div>

          <div className={classes.description}>
            <p>{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

