import { CheckCircle } from "lucide-react";
import classes from "./Terms.module.scss";

export const Terms = () => (
  <div className={classes.terms}>
    <h4>Booking conditions</h4>
    <div className={classes.termItems}>
      <div className={classes.termItem}>
        <CheckCircle size={16} />
        <span>Free cancellation within 24 hours before check-in</span>
      </div>
      <div className={classes.termItem}>
        <CheckCircle size={16} />
        <span>Guaranteed refund</span>
      </div>
      <div className={classes.termItem}>
        <CheckCircle size={16} />
        <span>Support 24/7</span>
      </div>
    </div>
  </div>
);
