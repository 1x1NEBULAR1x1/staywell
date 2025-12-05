import { Lock } from "lucide-react";
import classes from "./Header.module.scss";

export const Header = () => (
  <div className={classes.header}>
    <div className={classes.title}>
      <Lock size={24} />
      <h2>Confirmation of booking</h2>
    </div>
    <p className={classes.subtitle}>
      Check the details and confirm the booking
    </p>
  </div>
);
