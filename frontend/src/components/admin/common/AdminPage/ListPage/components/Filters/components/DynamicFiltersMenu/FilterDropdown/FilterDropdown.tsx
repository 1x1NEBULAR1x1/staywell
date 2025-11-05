'use client';

import classes from './FilterDropdown.module.scss';
import { SlidersHorizontal, X } from 'lucide-react';
import { ReactNode, useRef, useEffect } from 'react';

type FilterDropdownProps = {
  is_open: boolean;
  onToggle: () => void;
  onClose: () => void;
  children: ReactNode;
}

export const FilterDropdown = ({ is_open, onToggle, onClose, children }: FilterDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (is_open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [is_open, onClose]);

  return (
    <div className={classes.container} ref={dropdownRef}>
      <button
        className={`${classes.filter_button} ${is_open ? classes.active : ''}`}
        onClick={onToggle}
      >
        <SlidersHorizontal className={classes.icon} />
      </button>

      {is_open && (
        <div className={`${classes.dropdown} ${is_open ? classes.dropdown_open : ''}`}>
          <div className={classes.header}>
            <h3 className={classes.title}>Filters</h3>
            <X className={classes.close_icon} onClick={onClose} />
          </div>
          <div className={classes.content}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

