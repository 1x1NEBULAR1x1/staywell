"use client";

import { Edit3, User } from "lucide-react";
import classes from "./ProfileHeader.module.scss";

interface ProfileHeaderProps {
  title: string;
  is_editing: boolean;
  on_edit?: () => void;
  on_cancel?: () => void;
}

export const ProfileHeader = ({
  title,
  is_editing,
  on_edit,
  on_cancel,
}: ProfileHeaderProps) => {
  return (
    <div className={classes.header}>
      <div className={classes.title_section}>
        <User className={classes.title_icon} size={24} />
        <h1>{title}</h1>
      </div>
      {is_editing ? (
        <button
          type="button"
          className={classes.cancel_button}
          onClick={on_cancel}
        >
          Cancel
        </button>
      ) : (
        <button type="button" className={classes.edit_button} onClick={on_edit}>
          <Edit3 size={18} />
          Edit Profile
        </button>
      )}
    </div>
  );
};
