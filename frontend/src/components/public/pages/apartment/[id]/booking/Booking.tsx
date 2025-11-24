import classes from './Booking.module.scss';

import { ExtendedApartment } from '@shared/src';
import { ProgressBar, StepContent, Actions } from './components';

export type BookingStep = 'dates' | 'events' | 'payment' | 'confirmation';

export const BOOKING_STEPS: BookingStep[] = ['dates', 'events', 'payment', 'confirmation'];

export const isBookingStep = (step: string): step is BookingStep => {
  return BOOKING_STEPS.some(s => s === step);
};

type BookingProps = {
  id: string;
  initial_data: ExtendedApartment;
  current_step: BookingStep;
}


export const Booking = ({ id, initial_data, current_step }: BookingProps) => (
  <div className={classes.page}>
    <ProgressBar id={id} current_step={current_step} />

    <StepContent current_step={current_step} initial_data={initial_data} />

    <Actions id={id} label="Next step" current_step={current_step} />
  </div>
);