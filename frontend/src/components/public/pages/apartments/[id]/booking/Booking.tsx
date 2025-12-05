import type { ExtendedApartment } from "@shared/src";
import classes from "./Booking.module.scss";
import { Actions, Header, ProgressBar, StepContent } from "./components";
import { type BookingStep, getHeaderProps } from "./config";

type BookingProps = {
  id: string;
  initial_data: ExtendedApartment;
  current_step: BookingStep;
};

export const Booking = ({ id, initial_data, current_step }: BookingProps) => (
  <div className={classes.page}>
    <ProgressBar id={id} current_step={current_step} />

    <Header {...getHeaderProps(current_step)} />

    <StepContent current_step={current_step} initial_data={initial_data} />

    <Actions id={id} label="Next step" current_step={current_step} />
  </div>
);
