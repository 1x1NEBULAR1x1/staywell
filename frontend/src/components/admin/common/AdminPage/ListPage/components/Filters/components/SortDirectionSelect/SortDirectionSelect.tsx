'use client';

import classes from './SortDirectionSelect.module.scss';
import { SortDirection } from '@shared/src';
import { ChevronDown, Check, ArrowUp, ArrowDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

type SortDirectionSelectProps = {
  setSortDirection: (sort_direction: SortDirection) => void;
}

export const SortDirectionSelect = ({ setSortDirection }: SortDirectionSelectProps) => {
  const [is_open, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (is_open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [is_open]);

  const handleSelect = (value: string) => {
    setSelected(value);
    setSortDirection(value as SortDirection);
    setIsOpen(false);
  };

  const getDirectionIcon = (direction: string) => {
    if (direction === SortDirection.asc) {
      return <ArrowUp size={14} className={classes.direction_icon} />;
    }
    if (direction === SortDirection.desc) {
      return <ArrowDown size={14} className={classes.direction_icon} />;
    }
    return null;
  };

  return (
    <div className={classes.dropdown_container} ref={dropdownRef}>
      <button
        className={`${classes.dropdown_button} ${is_open ? classes.open : ''}`}
        onClick={() => setIsOpen(!is_open)}
      >
        <span className={classes.dropdown_label}>
          {getDirectionIcon(selected)}
          {selected || 'Direction'}
        </span>
        <ChevronDown
          className={`${classes.dropdown_icon} ${is_open ? classes.rotated : ''}`}
          size={16}
        />
      </button>

      {is_open && (
        <div className={`${classes.dropdown_menu} ${is_open ? classes.menu_visible : ''}`}>
          <div
            className={`${classes.dropdown_item} ${!selected ? classes.selected : ''}`}
            onClick={() => handleSelect('')}
          >
            <span>Direction</span>
            {!selected && <Check size={16} className={classes.check_icon} />}
          </div>
          {Object.values(SortDirection).map((sort_direction) => (
            <div
              key={`sort-direction-${sort_direction.toString()}`}
              className={`${classes.dropdown_item} ${selected === sort_direction.toString() ? classes.selected : ''}`}
              onClick={() => handleSelect(sort_direction.toString())}
            >
              <span className={classes.item_content}>
                {getDirectionIcon(sort_direction)}
                {sort_direction.toString()}
              </span>
              {selected === sort_direction.toString() && <Check size={16} className={classes.check_icon} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}