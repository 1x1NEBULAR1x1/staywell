"use client";

import clsx from "clsx";
import classes from "./Sidebar.module.scss";
import { useAccount } from "@/hooks/common/useAccount";
import Image from "next/image";
import default_avatar from "@/../public/common/default-avatar.png";
import { profile_tabs_config } from "../../config";
import { useProfileNavigation } from "./useProfileNavigation";
import { getImageUrl } from "@/lib/api";


export const Sidebar = () => {
  const { user } = useAccount();
  const { isActiveTab, handleNavigate } = useProfileNavigation();
  return (
    <aside className={classes.sidebar}>
      <header className={classes.header}>
        <div className={classes.user_data}>
          <Image
            src={getImageUrl(user?.image) ?? default_avatar.src}
            alt={user?.first_name || "User"}
            className={classes.avatar}
            width={160}
            height={160}
          />
          <div className={classes.info}>
            <h2 className={classes.name}>
              {user?.first_name} {user?.last_name}
            </h2>
            <p className={classes.email}>{user?.email}</p>
          </div>
        </div>
      </header>

      <nav className={classes.nav}>
        {profile_tabs_config.map((tab) => {
          return (
            <button
              key={tab.href}
              className={clsx(classes.nav_item, { [classes.nav_item_active]: isActiveTab(tab) })}
              onClick={() => handleNavigate(tab)}
            >
              <tab.icon size={24} className={classes.nav_item_icon} />
              <span className={classes.nav_item_label}>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
