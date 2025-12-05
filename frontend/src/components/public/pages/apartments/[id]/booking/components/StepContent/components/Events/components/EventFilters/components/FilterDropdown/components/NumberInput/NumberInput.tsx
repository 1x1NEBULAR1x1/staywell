"use client";

import classes from "./NumberInput.module.scss";

type NumberInputProps = {
  label: string;
  value?: number;
  onChange: (value?: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
};

export const NumberInput = ({
  label,
  value,
  onChange,
  placeholder,
  min,
  max,
}: NumberInputProps) => (
  <div className={classes.container}>
    <label className={classes.label}>{label}</label>
    <input
      type="number"
      className={classes.input}
      value={value ?? ""}
      onChange={(e) => {
        const val = e.target.value;
        onChange(val ? Number(val) : undefined);
      }}
      placeholder={placeholder}
      min={min}
      max={max}
    />
  </div>
);
