"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createElement, useMemo } from "react";
import type { NavButtonProps } from "../../navigation.data";
import classes from "./NavButton.module.scss";

export const NavButton = ({ icon, href, label }: NavButtonProps) => {
  const pathname = usePathname();

  const is_active = useMemo(() => {
    return (
      (href === "/admin" && pathname === "/admin") ||
      (href !== "/admin" && pathname.startsWith(href))
    );
  }, [href, pathname]);

  return (
    <Link
      href={href}
      className={clsx(classes.nav_button, is_active && classes.active)}
    >
      {createElement(icon, { className: classes.icon, size: 24 })}
      <p className={classes.label}>{label}</p>
    </Link>
  );
};
