import classes from './Logo.module.scss';

import clsx from 'clsx';
import Link from 'next/link';

type LogoProps = {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => (
  <Link className={clsx(classes.logo, className)} href="/">
    Stay<span>Well</span>
  </Link>
);