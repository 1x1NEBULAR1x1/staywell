import type { ReactNode } from "react";
import classes from "./Section.module.scss";

export const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div className={classes.section}>
    <h4 className={classes.title}>{title}</h4>
    {children}
  </div>
);
