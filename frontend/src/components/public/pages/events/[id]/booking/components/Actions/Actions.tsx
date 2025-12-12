"use client";

import { Undo, Undo2 } from "lucide-react";
import Link from "next/link";
import { useEventBookingState } from "@/hooks/public/event-booking/useEventBookingState";
import type { EventBookingStep } from "../../config";
import classes from "./Actions.module.scss";

type ActionsProps = {
  id: string;
  label: string;
  current_step: EventBookingStep;
};

export const Actions = ({ id, label, current_step }: ActionsProps) => {
  const { canProceedToNextStep, getPreviousStep, getNextStep } =
    useEventBookingState();

  const previous_step = getPreviousStep(current_step);

  return (
    <div className={classes.actions}>
      {canProceedToNextStep(current_step) ? (
        <Link
          href={`/events/${id}/booking/${getNextStep(current_step)}`}
          className={classes.next_button}
        >
          {label}
        </Link>
      ) : (
        <button type="button" className={classes.next_button} disabled>
          {label}
        </button>
      )}
      <Link
        href={
          previous_step
            ? `/events/${id}/booking/${previous_step}`
            : `/events/${id}`
        }
        className={classes.back_button}
      >
        <Undo />
        {previous_step ? "Back" : "Cancel"}
      </Link>
      {!!previous_step && (
        <Link href={`/events/${id}`} className={classes.cancel_button}>
          <Undo2 />
          Cancel
        </Link>
      )}
    </div>
  );
};
