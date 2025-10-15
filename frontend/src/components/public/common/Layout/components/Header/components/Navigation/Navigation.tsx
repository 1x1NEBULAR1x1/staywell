'use client';
import clsx from 'clsx';
import classes from './Navigation.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export const Navigation = () => (
  <nav className={classes.navigation}>
    {links.map((link) => <NavLink key={link.href} href={link.href} label={link.label} />)}
  </nav>
);

const links = [
  { href: '/', label: 'Home' },
  { href: '/event', label: 'Events' },
  { href: '/apartment', label: 'Apartments' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const NavLink = ({ href, label }: { href: string, label: string }) => {
  const pathname = usePathname();

  const isActive = useMemo(() => {
    return (href === '/' && pathname === '/') || (href !== '/' && pathname.startsWith(href));
  }, [href, pathname]);

  return (
    <Link className={clsx(classes.link, isActive && classes.link_active)} href={href}>{label}</Link>
  );
};
