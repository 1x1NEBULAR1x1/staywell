'use client';

import classes from './FiltersMenu.module.scss';

import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

type FiltersMenuProps = {}

export const FiltersMenu = ({ }: FiltersMenuProps) => {
  const [is_open, setIsOpen] = useState(false);

  return (
    <div className={classes.container}>
      <SlidersHorizontal className={classes.icon} onClick={() => setIsOpen(!is_open)} />
      {is_open && <div className={classes.dropdown} >
        <div className={classes.dropdown_item}>Checkbox</div>
        <div className={classes.dropdown_item}>Checkbox</div>
      </div>}
    </div>
  )
};