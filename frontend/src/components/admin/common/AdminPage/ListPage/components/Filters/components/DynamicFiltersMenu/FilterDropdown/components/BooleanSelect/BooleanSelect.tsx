'use client';

import classes from './BooleanSelect.module.scss';

type BooleanSelectProps = {
  label: string;
  value: boolean | undefined;
  onChange: (value: boolean | undefined) => void;
}

export const BooleanSelect = ({ label, value, onChange }: BooleanSelectProps) => {
  const handleChange = (val: string) => {
    if (val === '') {
      onChange(undefined);
    } else if (val === 'true') {
      onChange(true);
    } else {
      onChange(false);
    }
  };

  return (
    <div className={classes.field}>
      <label className={classes.label}>{label}</label>
      <select
        className={classes.select}
        value={value === undefined ? '' : value.toString()}
        onChange={(e) => handleChange(e.target.value)}
      >
        <option value="">By default</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </div>
  );
};

