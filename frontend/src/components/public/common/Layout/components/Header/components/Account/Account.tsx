"use client";

import type { SafeUser } from "@shared/src";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import default_avatar from "@/../public/common/default-avatar.png";
import { useNotifications } from "@/hooks/common/useNotifications";
import { getImageUrl } from "@/lib/api";
import classes from "./Account.module.scss";
import { Dropdown } from "./components/Dropdown/Dropdown";

export const Account = ({ user }: { user: SafeUser }) => {
  const [is_dropdown_open, setIsDropdownOpen] = useState(false);
  const dropdown_ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdown_ref.current &&
        !dropdown_ref.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    if (is_dropdown_open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [is_dropdown_open]);

  const { get } = useNotifications();

  const { data: notifications } = get({
    is_read: false,
    take: 1000,
    skip: 0,
  });

  const unread_count =
    notifications?.items?.filter((notification) => !notification.is_read)
      .length || 0;

  const getUserDisplayName = () => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.email;
  };

  return (
    <div className={classes.account_wrapper} ref={dropdown_ref}>
      <button
        type="button"
        className={classes.account}
        onClick={() => setIsDropdownOpen(!is_dropdown_open)}
      >
        <div className={classes.user_info}>
          <div className={classes.avatar_container}>
            <Image
              src={getImageUrl(user.image) ?? default_avatar.src}
              alt="User Avatar"
              width={400}
              height={400}
              quality={100}
              className={classes.avatar}
            />
            {unread_count > 0 && (
              <span className={classes.badge}>
                {unread_count > 99 ? "99+" : unread_count}
              </span>
            )}
          </div>
          <div className={classes.user_details}>
            <div className={classes.user_name}>{getUserDisplayName()}</div>
            <div className={classes.user_email}>{user.email}</div>
          </div>
        </div>

        <div className={classes.dropdown_toggle}>
          <ChevronDown
            size={20}
            className={clsx(
              classes.chevron,
              is_dropdown_open && classes.chevron_rotated,
            )}
          />
        </div>
      </button>

      {is_dropdown_open && <Dropdown setIsDropdownOpen={setIsDropdownOpen} />}
    </div>
  );
};
