'use client';

import classes from './CheckboxInput.module.scss';

type CheckboxInputProps = {
  label: string;
  value: boolean | undefined;
  onChange: (value: boolean | undefined) => void;
}

export const CheckboxInput = ({ label, value, onChange }: CheckboxInputProps) => {
  const handleChange = () => {
    if (value === undefined) {
      onChange(true);
    } else if (value === true) {
      onChange(false);
    } else {
      onChange(undefined);
    }
  };

  return (
    <div className={classes.field}>
      <label className={classes.label}>
        <input
          type="checkbox"
          className={classes.checkbox}
          checked={value === true}
          indeterminate={value === undefined}
          onChange={handleChange}
        />
        <span className={classes.text}>
          {label}
          {value === false && ' (No)'}
          {value === true && ' (Yes)'}
          {value === undefined && ' (All)'}
        </span>
      </label>
    </div>
  );
};

