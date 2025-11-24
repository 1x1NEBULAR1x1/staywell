import { CalendarDays } from "lucide-react";
import classes from './Header.module.scss';

export const Header = () => (
  <div className={classes.header}>
    <div className={classes.title}>
      <CalendarDays size={24} />
      Select check-in and check-out dates
    </div>
    <p className={classes.subtitle}>
      Select a consecutive range of free days for booking
    </p>
  </div>
);