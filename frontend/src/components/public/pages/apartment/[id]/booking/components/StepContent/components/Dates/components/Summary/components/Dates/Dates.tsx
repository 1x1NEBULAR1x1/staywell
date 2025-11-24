import classes from './Dates.module.scss';

import { ArrowRight } from 'lucide-react';
import { formatDate } from 'date-fns';


export const Dates = ({ selected_dates, nights }: { selected_dates: { start: Date; end: Date }, nights: number }) => (
  <div className={classes.dates}>
    <span className={classes.date}>
      {formatDate(selected_dates.start, 'dd MMMM yyyy')}
    </span>
    <ArrowRight size={16} />
    <span className={classes.date}>
      {formatDate(selected_dates.end, 'dd MMMM yyyy')}
    </span>
    <span className={classes.nights}>({nights} nights)</span>
  </div>
);