"use client";

import { usePathname } from "next/navigation";
import classes from "./Content.module.scss";
import { ChatTab, NotificationTab, ProfileInfoTab } from "./components";

export const Content = () => {
  const pathname = usePathname();

  // Extract active tab from path
  const active_tab =
    pathname === "/profile" ? "" : pathname.replace("/profile/", "");

  const renderContent = () => {
    switch (active_tab) {
      case "":
        return (
          <main className={classes.content}>
            <ProfileInfoTab />
          </main>
        );
      case "notification":
        return (
          <main className={classes.content}>
            <NotificationTab />
          </main>
        );
      case "support":
        return <ChatTab />;
      default:
        return null;
    }
  };

  return renderContent();
};
