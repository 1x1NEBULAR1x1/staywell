"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactElement } from "react";
import classes from "./Header.module.scss";

export interface HeaderProps {
  title: string;
  title_icon?: ReactElement<LucideIcon>;
  subtitle?: string;
  subtitle_icon?: ReactElement<LucideIcon>;
}

export const Header = ({
  title,
  title_icon,
  subtitle,
  subtitle_icon,
}: HeaderProps) => (
  <div className={classes.header}>
    <div className={classes.title}>
      {title_icon}
      <h2>{title}</h2>
    </div>
    <p className={classes.subtitle}>
      {subtitle_icon}
      {subtitle}
    </p>
  </div>
);
