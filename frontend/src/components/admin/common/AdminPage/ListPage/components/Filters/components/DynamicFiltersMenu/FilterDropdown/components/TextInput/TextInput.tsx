'use client';

import classes from './TextInput.module.scss';

type TextInputProps = {
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
}

export const TextInput = ({ label, value, onChange, placeholder }: TextInputProps) => {
  return (
    <div className={classes.field}>
      <label className={classes.label}>{label}</label>
      <input
        type="text"
        className={classes.input}
        value={value || ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        placeholder={placeholder}
      />
    </div>
  );
};

