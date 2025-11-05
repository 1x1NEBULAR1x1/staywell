'use client';

import classes from './NumberInput.module.scss';

type NumberInputProps = {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export const NumberInput = ({ label, value, onChange, placeholder, min, max, step }: NumberInputProps) => {
  return (
    <div className={classes.field}>
      <label className={classes.label}>{label}</label>
      <input
        type="number"
        className={classes.input}
        step={step}
        value={value ?? ''}
        onChange={(e) => {
          const val = e.target.value;
          onChange(val === '' ? undefined : Number(val));
        }}
        placeholder={placeholder}
        min={min}
        max={max}
      />
    </div>
  );
};

