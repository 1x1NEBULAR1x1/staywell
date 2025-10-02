'use client';

import classes from './NavButton.module.scss';

import Link from 'next/link';
import { useMemo, createElement } from 'react';
import { match } from 'path-to-regexp';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { NavButtonProps } from '../../navigation.data';

export const NavButton = ({ icon, href, label }: NavButtonProps) => {
  const pathname = usePathname();

  const is_active = useMemo(() => {
    const matcher = match(href);
    console.log(matcher(pathname), pathname, href);
    return matcher(pathname) !== false;
  }, [href, pathname]);

  return (
    <Link href={href} className={clsx(classes.nav_button, is_active && classes.active)}>
      {createElement(icon, { className: classes.icon, size: 24 })}
      <p className={classes.label}>{label}</p>
    </Link >
  );
};