"use client";

import { usePathname } from "next/navigation";
import classes from "./Content.module.scss";
import {
  ChatTab,
  NotificationTab,
  ProfileInfoTab,
  SettingsTab,
} from "./components";

export const Content = () => {
  const pathname = usePathname();

  // Extract active tab from path
  const active_tab =
    pathname === "/profile" ? "" : pathname.replace("/profile/", "");

  const renderContent = () => {
    switch (active_tab) {
      case "":
        return <ProfileInfoTab />;
      case "settings":
        return <SettingsTab />;
      case "notification":
        return <NotificationTab />;
      case "support":
        return <ChatTab />;
      default:
        return null;
    }
  };

  return <main className={classes.content}>{renderContent()}</main>;
};
