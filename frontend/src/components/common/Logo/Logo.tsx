import clsx from "clsx";
import Link from "next/link";
import classes from "./Logo.module.scss";

type LogoProps = {
  className?: string;
};

export const Logo = ({ className }: LogoProps) => (
  <Link className={clsx(classes.logo, className)} href="/">
    Stay<span>Well</span>
  </Link>
);
