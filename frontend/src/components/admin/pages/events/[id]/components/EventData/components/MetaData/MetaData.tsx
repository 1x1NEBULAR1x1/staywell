import classes from './MetaData.module.scss';
import clsx from 'clsx';
import { ToolTip } from '@/components/styles/ui';
import { Calendar, Clock, Users, User } from 'lucide-react';
import { ExtendedEvent } from '@shared/src';


export const MetaData = ({ event }: { event: ExtendedEvent }) => {
  const is_available = Date.now() < new Date(event.start).getTime();

  return (
    <div className={classes.meta}>
      <div className={classes.meta_row}>
        <span className={`${classes.status} ${is_available ? classes.available : classes.unavailable}`}>
          {is_available ? 'Available' : 'Unavailable'}
        </span>
        <ToolTip label="Event capacity" variant="blue" position="bottom">
          <div className={clsx(classes.icon_container)}>
            <Users className={classes.icon} />
            <span>{event.capacity} people</span>
          </div>
        </ToolTip>
      </div>
      <div className={classes.meta_row}>
        <ToolTip label="Start date" variant="blue" position="bottom">
          <div className={clsx(classes.icon_container)}>
            <Calendar className={classes.icon} />
            <span>{new Date(event.start).toLocaleDateString()}</span>
          </div>
        </ToolTip>
        <ToolTip label="Duration" variant="blue" position="bottom">
          <div className={clsx(classes.icon_container)}>
            <Clock className={classes.icon} />
            <span>{new Date(event.start).toLocaleTimeString()} - {new Date(event.end).toLocaleTimeString()}</span>
          </div>
        </ToolTip>
      </div>
      {event.guide && (
        <div className={classes.meta_row}>
          <ToolTip label="Tour guide" variant="green" position="bottom">
            <div className={clsx(classes.icon_container)}>
              <User className={classes.icon} />
              <span>{event.guide.first_name} {event.guide.last_name}</span>
            </div>
          </ToolTip>
        </div>
      )}
    </div>
  );
};