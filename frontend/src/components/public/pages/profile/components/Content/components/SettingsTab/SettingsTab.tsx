"use client";

import classes from "./SettingsTab.module.scss";
import { ThemeToggle } from "./components/ThemeToggle";
import { NotificationsToggle } from "./components/NotificationsToggle";
import { ChangePassword } from "./components/ChangePassword";

export const SettingsTab = () => {
  return (
    <div className={classes.settings}>
      <div className={classes.header}>
        <h2>Settings</h2>
        <p>Manage your account settings</p>
      </div>

      <div className={classes.settings_sections}>
        <ThemeToggle />
        <NotificationsToggle />
        <ChangePassword />
      </div>
    </div>
  );
};

