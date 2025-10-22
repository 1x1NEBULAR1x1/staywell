'use client';

import classes from './NavButton.module.scss';

import Link from 'next/link';
import { useMemo, createElement } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { NavButtonProps } from '../../navigation.data';

export const NavButton = ({ icon, href, label }: NavButtonProps) => {
  const pathname = usePathname();

  const is_active = useMemo(() => {
    return (href === '/admin' && pathname === '/admin') || (href !== '/admin' && pathname.startsWith(href));
  }, [href, pathname]);

  return (
    <Link href={href} className={clsx(classes.nav_button, is_active && classes.active)}>
      {createElement(icon, { className: classes.icon, size: 24 })}
      <p className={classes.label}>{label}</p>
    </Link >
  );
};