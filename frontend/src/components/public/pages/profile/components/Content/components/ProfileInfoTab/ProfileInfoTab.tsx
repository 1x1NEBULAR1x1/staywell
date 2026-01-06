"use client";

import { useState } from "react";
import { useAccount } from "@/hooks/common";
import { InlineProfileForm, ProfileHeader, ProfileView } from "./components";
import classes from "./ProfileInfoTab.module.scss";

export const ProfileInfoTab = () => {
  const { user } = useAccount();
  const [is_editing, setIsEditing] = useState<boolean>(false);

  const startEditing = () => setIsEditing(true);
  const stopEditing = () => setIsEditing(false);

  if (!user) {
    return (
      <div className={classes.profile_info}>
        <div className={classes.loading}>
          <div className={classes.loading_spinner}></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.profile_info}>
      <ProfileHeader
        title={is_editing ? "Edit Profile" : "Profile Information"}
        is_editing={is_editing}
        on_edit={startEditing}
        on_cancel={stopEditing}
      />

      {is_editing ? (
        <InlineProfileForm user={user} onSuccess={stopEditing} />
      ) : (
        <ProfileView user={user} />
      )}
    </div>
  );
};
