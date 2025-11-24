"use client";

import classes from "./Content.module.scss";
import {
  ChatTab,
  ProfileInfoTab,
  CardsTab,
  SettingsTab,
  NotificationTab,
  TransfersTab
} from "./components";
import { usePathname } from "next/navigation";

export const Content = () => {
  const pathname = usePathname();

  // Извлекаем активную вкладку из пути
  const active_tab = pathname === '/profile' ? '' : pathname.replace('/profile/', '');

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
