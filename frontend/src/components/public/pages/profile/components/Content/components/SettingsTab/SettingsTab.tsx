"use client";

import { ChangePassword } from "./components/ChangePassword";
import { NotificationsToggle } from "./components/NotificationsToggle";
import classes from "./SettingsTab.module.scss";

export const SettingsTab = () => {
  return (
    <div className={classes.settings}>
      <div className={classes.header}>
        <h2>Settings</h2>
        <p>Manage your account settings</p>
      </div>

      <div className={classes.settings_sections}>
        <NotificationsToggle />
        <ChangePassword />
      </div>
    </div>
  );
};
