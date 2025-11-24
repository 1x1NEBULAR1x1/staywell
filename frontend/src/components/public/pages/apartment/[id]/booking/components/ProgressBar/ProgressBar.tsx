import { BookingStep } from '../../Booking';
import classes from './ProgressBar.module.scss';
import { PROGRESS_BAR_OPTIONS } from './options.data';
import clsx from 'clsx';
import Link from 'next/link';

type ProgressBarProps = {
  id: string;
  current_step: BookingStep;
}

export const ProgressBar = ({ id, current_step }: ProgressBarProps) => (
  <div className={classes.progress_bar}>
    <div className={classes.line} />
    <div className={classes.options}>
      {PROGRESS_BAR_OPTIONS.map((option) => (
        <Link
          key={option.label}
          href={`/apartments/${id}/booking/${option.order}`}
          className={clsx(classes.option, { [classes.completed]: option.step === current_step })}
        >
          <div className={classes.icon_container}>
            {option.step === current_step
              ? <option.icon className={classes.icon} />
              : <option.icon_completed className={classes.icon} />
            }
          </div>
          <span className={classes.label}>{option.label}</span>
        </Link>
      ))}
    </div>
  </div>
);