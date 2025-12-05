"use client";

import classes from "./TextInput.module.scss";

type TextInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const TextInput = ({
  label,
  value,
  onChange,
  placeholder,
}: TextInputProps) => (
  <div className={classes.container}>
    <label className={classes.label}>{label}</label>
    <input
      type="text"
      className={classes.input}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);
