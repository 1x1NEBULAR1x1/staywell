import { EventList, SelectedEvents } from "./components";
import classes from "./Events.module.scss";

export const Events = () => (
  <div className={classes.container}>
    <EventList />

    <SelectedEvents />
  </div>
);
