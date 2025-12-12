"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { type ReactNode, useEffect, useRef } from "react";
import classes from "./FilterDropdown.module.scss";

type FilterDropdownProps = {
  is_open: boolean;
  onToggle: () => void;
  onClose: () => void;
  children: ReactNode;
};

export const FilterDropdown = ({
  is_open,
  onToggle,
  onClose,
  children,
}: FilterDropdownProps) => {
  const dropdown_ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdown_ref.current &&
        !dropdown_ref.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (is_open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [is_open, onClose]);

  return (
    <div className={classes.container} ref={dropdown_ref}>
      <button
        type="button"
        className={classes.filter_button}
        onClick={onToggle}
      >
        <SlidersHorizontal className={classes.icon} />
        <p>Filters</p>
      </button>

      {is_open && (
        <div className={classes.dropdown}>
          <div className={classes.header}>
            <h3 className={classes.title}>Filters</h3>
            <button
              type="button"
              className={classes.close_icon}
              onClick={onClose}
            >
              <X size={16} />
            </button>
          </div>
          <div className={classes.content}>{children}</div>
        </div>
      )}
    </div>
  );
};
