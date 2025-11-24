import classes from './RequestStates.module.scss';
import { Calendar } from 'lucide-react';

type RequestStatesProps = {
  error: Error;
  isLoading: boolean;
  hasAvailableEvents: boolean;
}

export const RequestStates = ({ error, isLoading, hasAvailableEvents }: RequestStatesProps) => (
  <>
    {isLoading && (
      <div className={classes.loading}>
        <div className={classes.spinner} />
        <p>Loading available events...</p>
      </div>
    )}

    {error && (
      <div className={classes.error}>
        <p>Error during loading events. Please try again later</p>
      </div>
    )}

    {!isLoading && !error && !hasAvailableEvents && (
      <div className={classes.noEvents}>
        <Calendar size={48} />
        <h3>We don't have available events for selected dates</h3>
      </div>
    )}
  </>
);