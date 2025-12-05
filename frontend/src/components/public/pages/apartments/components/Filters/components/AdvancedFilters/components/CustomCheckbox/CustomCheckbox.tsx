"use client";

import { Check } from "lucide-react";
import classes from "./CustomCheckbox.module.scss";

type CustomCheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
};

export const CustomCheckbox = ({
  label,
  checked,
  onChange,
  description,
}: CustomCheckboxProps) => {
  return (
    <label className={classes.checkbox_container}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={classes.checkbox_input}
      />
      <div
        className={`${classes.checkbox_box} ${checked ? classes.checkbox_checked : ""}`}
      >
        {checked && <Check size={16} className={classes.check_icon} />}
      </div>
      <div className={classes.checkbox_content}>
        <span className={classes.checkbox_label}>{label}</span>
        {description && (
          <span className={classes.checkbox_description}>{description}</span>
        )}
      </div>
    </label>
  );
};
