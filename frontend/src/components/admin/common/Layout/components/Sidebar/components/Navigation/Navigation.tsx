'use client';

import classes from './Navigation.module.scss';

import { main_buttons, secondary_buttons } from './navigation.data';
import { NavButton } from './components/NavButton/NavButton';

export const Navigation = () => {
  return (
    <nav className={classes.nav}>
      <div className={classes.main}>
        {main_buttons.map((item) => <NavButton key={item.label} {...item} />)}
      </div>
      <div className={classes.secondary}>
        {secondary_buttons.map((item) => <NavButton key={item.label} {...item} />)}
      </div>
    </nav>
  )
};