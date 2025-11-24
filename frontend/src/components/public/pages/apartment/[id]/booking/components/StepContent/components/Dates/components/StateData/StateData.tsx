import { MinusCircle, PlusCircle, UserRoundCheck } from 'lucide-react';
import classes from './StateData.module.scss';
import { ChangeEvent } from 'react';

interface StateDataProps {
  guests: number;
  setGuests: (guests: number) => void;
  error: Error | null;
}

export const StateData = ({ guests, setGuests, error }: StateDataProps) => {
  const handleGuestsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setGuests(1);
      return;
    }
    const number = parseInt(value, 10);
    if (isNaN(number)) return;
    if (number < 1) {
      setGuests(1);
      return;
    }
    setGuests(number);
  };

  return (
    <>
      <div className={classes.selected_range}>
        <div className={classes.label}>
          <UserRoundCheck size={16} />
          Guests:
        </div>
        <div className={classes.controls}>
          <button className={classes.button} onClick={() => setGuests(guests - 1)}>
            <MinusCircle size={16} />
          </button>

          <input
            type="number"
            className={classes.input}
            value={guests}
            onChange={(e) => handleGuestsChange(e)}
            min={1}
          />

          <button className={classes.button} onClick={() => setGuests(guests + 1)}>
            <PlusCircle size={16} />
          </button>
        </div>
      </div>

      {error && (
        <div className={classes.error}>
          Failed to load available dates information. Please try again later.
        </div>
      )}
    </>
  )
}