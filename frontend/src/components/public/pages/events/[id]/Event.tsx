import type { ExtendedEvent } from "@shared/src";
import { EventInfo } from "./components/EventInfo";
import { Header } from "./components/Header";
import { Images } from "./components/Images";
import classes from "./Event.module.scss";

export const Event = ({ initial_data }: { initial_data: ExtendedEvent }) => {
  return (
    <div className={classes.page}>
      <Header title={initial_data.name} />
      <Images event={initial_data} />
      <EventInfo event={initial_data} />
    </div>
  );
};
