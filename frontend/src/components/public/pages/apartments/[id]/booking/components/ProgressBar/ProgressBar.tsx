import clsx from "clsx";
import Link from "next/link";
import { BOOKING_STEPS, type BookingStep } from "../../config";
import { PROGRESS_BAR_OPTIONS } from "./options.data";
import classes from "./ProgressBar.module.scss";

type ProgressBarProps = {
  id: string;
  current_step: BookingStep;
};

export const ProgressBar = ({ id, current_step }: ProgressBarProps) => {
  const currentStepIndex = BOOKING_STEPS.indexOf(current_step);

  return (
    <div className={classes.progress_bar}>
      <div className={classes.line} />
      <div className={classes.options}>
        {PROGRESS_BAR_OPTIONS.map((option) => {
          const optionStepIndex = BOOKING_STEPS.indexOf(option.step);
          const isCompleted = optionStepIndex < currentStepIndex;
          const isCurrent = optionStepIndex === currentStepIndex;

          return (
            <Link
              key={option.label}
              href={`/apartments/${id}/booking/${option.step}`}
              className={clsx(classes.option, {
                [classes.completed]: isCompleted,
                [classes.current]: isCurrent,
              })}
            >
              <div className={classes.icon_container}>
                {isCompleted ? (
                  <option.icon_completed className={classes.icon} />
                ) : (
                  <option.icon className={classes.icon} />
                )}
              </div>
              <pre className={classes.label}>{option.label}</pre>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
