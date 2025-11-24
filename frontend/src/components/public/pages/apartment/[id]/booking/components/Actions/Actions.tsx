'use client';

import classes from './Actions.module.scss';
import Link from 'next/link';
import { Undo, Undo2 } from 'lucide-react';
import { useBookingState } from '@/hooks/public/booking';
import { BookingStep } from '@/components/public/pages/apartment/[id]/booking/Booking';

type ActionsProps = {
  id: string;
  label: string;
  current_step: BookingStep;
}

export const Actions = ({ id, label, current_step }: ActionsProps) => {
  const { canProceedToNextStep, getPreviousStep, getNextStep } = useBookingState();

  const previous_step = getPreviousStep(current_step);

  return (
    <div className={classes.actions}>
      {canProceedToNextStep(current_step)
        ? <Link
          href={`/apartments/${id}/booking/${getNextStep(current_step)}`}
          className={classes.next_button}
        >
          {label}
        </Link>
        : <button className={classes.next_button} disabled>{label}</button>
      }
      <Link
        href={previous_step ? `/apartments/${id}/booking/${previous_step}` : `/apartments/${id}`}
        className={classes.back_button}
      >
        <Undo />{previous_step ? 'Back' : 'Cancel'}
      </Link>
      {
        !!previous_step && <Link
          href={`/apartments/${id}`}
          className={classes.cancel_button}
        >
          <Undo2 />Cancel
        </Link>
      }
    </div >
  );
};