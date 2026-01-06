"use client";

import type { ReactNode } from "react";
import classes from "./ProfileDetailItem.module.scss";

interface ProfileDetailItemProps {
  icon: ReactNode;
  label: string;
  value: string | ReactNode;
  note?: string;
}

export const ProfileDetailItem = ({
  icon,
  label,
  value,
  note,
}: ProfileDetailItemProps) => {
  return (
    <div className={classes.detail_item}>
      <div className={classes.icon}>{icon}</div>
      <div className={classes.detail_content}>
        <p className={classes.detail_label}>{label}</p>
        <p className={classes.detail_value}>{value}</p>
        {note && <p className={classes.detail_note}>{note}</p>}
      </div>
    </div>
  );
};
