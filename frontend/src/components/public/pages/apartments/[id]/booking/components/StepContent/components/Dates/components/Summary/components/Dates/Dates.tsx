import { formatDate } from "date-fns";
import { ArrowRight } from "lucide-react";
import classes from "./Dates.module.scss";

export const Dates = ({
  selected_dates,
  nights,
}: {
  selected_dates: { start: Date; end: Date };
  nights: number;
}) => (
  <div className={classes.dates}>
    <span className={classes.date}>
      {formatDate(selected_dates.start, "dd MMMM yyyy")}
    </span>
    <ArrowRight size={24} />
    <span className={classes.date}>
      {formatDate(selected_dates.end, "dd MMMM yyyy")}
    </span>
    <span className={classes.nights}>({nights} nights)</span>
  </div>
);
