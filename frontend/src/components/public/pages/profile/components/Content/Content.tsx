"use client";

import { usePathname } from "next/navigation";
import classes from "./Content.module.scss";
import {
  CardsTab,
  ChatTab,
  NotificationTab,
  ProfileInfoTab,
  SettingsTab,
  TransfersTab,
} from "./components";

export const Content = () => {
  const pathname = usePathname();

  // Извлекаем активную вкладку из пути
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
      case "cards":
        return <CardsTab />;
      case "transfers":
        return <TransfersTab />;
      case "history":
        return <ChatTab />;
      default:
        return <ProfileInfoTab />;
    }
  };

  return <main className={classes.content}>{renderContent()}</main>;
};
