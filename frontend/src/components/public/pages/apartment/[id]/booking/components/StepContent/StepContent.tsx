import { Events, Dates, Payment, Confirmation } from './components';
import { ExtendedApartment } from '@shared/src/types/apartments-section/extended.types';
import { BookingStep } from '../../Booking';

export const StepContent = ({ current_step, initial_data }: { current_step: BookingStep, initial_data: ExtendedApartment }) => {
  switch (current_step) {
    case 'dates':
      return <Dates initial_data={initial_data} />;
    case 'events':
      return <Events />;
    case 'payment':
      return <Payment />;
    case 'confirmation':
      return <Confirmation />;
    default:
      return null;
  }
}