import { CheckCircle, Loader2 } from "lucide-react";
import classes from "./States.module.scss";

export const LoadingMessage = () => (
  <div className={classes.container}>
    <div className={classes.loading}>
      <Loader2 size={48} className={classes.spinner} />
      <h3>Loading data...</h3>
    </div>
  </div>
);

export const ErrorMessage = () => (
  <div className={classes.container}>
    <div className={classes.empty}>
      <CheckCircle size={48} />
      <h3>Booking is not completed</h3>
      <p>You need to select dates, booking variant and payment method</p>
    </div>
  </div>
);
