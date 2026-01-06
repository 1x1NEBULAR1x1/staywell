"use client";

import type { UserWithoutPassword } from "@shared/src";
import { Mail, Phone, User } from "lucide-react";
import Image from "next/image";
import default_avatar from "@/../public/common/default-avatar.png";
import { getImageUrl } from "@/lib/api";
import { ProfileDetailItem } from "./components/ProfileDetailItem";
import classes from "./ProfileView.module.scss";

interface ProfileViewProps {
  user: UserWithoutPassword;
}

export const ProfileView = ({ user }: ProfileViewProps) => {
  return (
    <div className={classes.profile_card}>
      <div className={classes.profile_header}>
        <div className={classes.avatar_container}>
          {user.image ? (
            <Image
              src={getImageUrl(user.image) ?? default_avatar.src}
              alt="Profile Avatar"
              width={100}
              height={100}
              className={classes.avatar}
            />
          ) : (
            <div className={classes.avatar_placeholder}>
              <User size={40} />
            </div>
          )}
        </div>
        <div className={classes.profile_meta}>
          <h2 className={classes.full_name}>
            {user.first_name && user.last_name
              ? `${user.first_name} ${user.last_name}`
              : user.first_name || user.last_name || "User"}
          </h2>
        </div>
      </div>

      <div className={classes.profile_details}>
        <div className={classes.detail_group}>
          <ProfileDetailItem
            icon={<Mail size={20} />}
            label="Email Address"
            value={user.email}
            note="Email cannot be changed"
          />

          <ProfileDetailItem
            icon={<User size={20} />}
            label="First Name"
            value={user.first_name || "Not provided"}
          />

          <ProfileDetailItem
            icon={<User size={20} />}
            label="Last Name"
            value={user.last_name || "Not provided"}
          />

          <ProfileDetailItem
            icon={<Phone size={20} />}
            label="Phone Number"
            value={user.phone_number || "Not provided"}
          />
        </div>
      </div>
    </div>
  );
};
