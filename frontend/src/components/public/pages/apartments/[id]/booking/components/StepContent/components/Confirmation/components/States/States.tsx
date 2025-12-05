import { CheckCircle, Loader2 } from "lucide-react";
import classes from "./States.module.scss";

type LoadingProps = {};
type ErrorProps = {};

export const Loading = ({}: LoadingProps) => (
  <div className={classes.container}>
    <div className={classes.loading}>
      <Loader2 size={48} className={classes.spinner} />
      <h3>Loading data...</h3>
    </div>
  </div>
);

export const Error = ({}: ErrorProps) => (
  <div className={classes.container}>
    <div className={classes.empty}>
      <CheckCircle size={48} />
      <h3>Booking is not completed</h3>
      <p>You need to select dates, booking variant and payment method</p>
    </div>
  </div>
);
