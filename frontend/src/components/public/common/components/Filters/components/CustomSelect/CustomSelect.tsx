"use client";

import { ChevronDown } from "lucide-react";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import classes from "./CustomSelect.module.scss";

type Option = {
  label: string;
  value: unknown;
};

type CustomSelectProps = {
  label: string;
  value?: unknown;
  options: Option[];
  onChange: (value: unknown) => void;
  placeholder?: string;
  icon?: ReactNode;
};

export const CustomSelect = ({
  label,
  value,
  options,
  onChange,
  placeholder = "Select...",
  icon,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();
  const selectRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((option) => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  const handleOptionClick = (option: Option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className={classes.container} ref={selectRef}>
      <button
        className={classes.select_button}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <div className={classes.button_content}>
          {icon && <div className={classes.icon}>{icon}</div>}
          <div className={classes.text_content}>
            <span className={classes.label}>{label}</span>
            <span
              className={`${classes.value} ${!selectedOption ? classes.placeholder : ""}`}
            >
              {displayValue}
            </span>
          </div>
        </div>
        <ChevronDown
          className={`${classes.chevron} ${isOpen ? classes.chevron_open : ""}`}
        />
      </button>

      {isOpen && (
        <div className={classes.dropdown}>
          <div className={classes.options}>
            {options.map((option) => (
              <button
                key={`${id}-${option.value}`}
                className={`${classes.option} ${option.value === value ? classes.option_selected : ""}`}
                onClick={() => handleOptionClick(option)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
