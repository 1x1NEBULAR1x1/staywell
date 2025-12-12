"use client";

import classes from "./DateInput.module.scss";

type DateInputProps = {
  label: string;
  value: Date | undefined;
  onChange: (value: Date | undefined) => void;
};

export const DateInput = ({ label, value, onChange }: DateInputProps) => {
  return (
    <div className={classes.field}>
      <label htmlFor={`date-input-${label}`} className={classes.label}>
        {label}
      </label>
      <input
        id={`date-input-${label}`}
        type="date"
        className={classes.input}
        value={
          value
            ? new Date(value.getTime() - value.getTimezoneOffset() * 60000)
                .toISOString()
                .split("T")[0]
            : ""
        }
        onChange={(e) => {
          const val = e.target.value;
          onChange(val === "" ? undefined : new Date(val));
        }}
      />
    </div>
  );
};
