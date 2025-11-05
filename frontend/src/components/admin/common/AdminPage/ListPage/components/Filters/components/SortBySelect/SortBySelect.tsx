'use client';

import classes from './SortBySelect.module.scss';
import { ChevronDown, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

type SortBySelectProps = {
  sort_by_list?: string[];
  setSortBy: (sort_by: string) => void;
}

export const SortBySelect = ({
  sort_by_list,
  setSortBy
}: SortBySelectProps) => {
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
    setSortBy(value);
    setIsOpen(false);
  };

  return (
    <div className={classes.dropdown_container} ref={dropdownRef}>
      <button 
        className={`${classes.dropdown_button} ${is_open ? classes.open : ''}`}
        onClick={() => setIsOpen(!is_open)}
      >
        <span className={classes.dropdown_label}>
          {selected || 'Sort by'}
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
            <span>Sort by</span>
            {!selected && <Check size={16} className={classes.check_icon} />}
          </div>
          {sort_by_list?.map((sort_by) => (
            <div 
              key={`sort-by-${sort_by.toString()}`}
              className={`${classes.dropdown_item} ${selected === sort_by.toString() ? classes.selected : ''}`}
              onClick={() => handleSelect(sort_by.toString())}
            >
              <span>{sort_by.toString()}</span>
              {selected === sort_by.toString() && <Check size={16} className={classes.check_icon} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}