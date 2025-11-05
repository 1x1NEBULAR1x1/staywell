'use client';

import classes from './SelectInput.module.scss';

type SelectOption = {
  value: string;
  label: string;
}

type SelectInputProps = {
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  options: SelectOption[];
  placeholder?: string;
}

export const SelectInput = ({ label, value, onChange, options, placeholder }: SelectInputProps) => {
  return (
    <div className={classes.field}>
      <label className={classes.label}>{label}</label>
      <select
        className={classes.select}
        value={value || ''}
        onChange={(e) => onChange(e.target.value || undefined)}
      >
        <option value="">{placeholder || 'All'}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

