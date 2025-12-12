"use client";

import {
  CheckCircle,
  Edit3,
  Mail,
  Phone,
  Shield,
  User,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import default_avatar from "@/../public/common/default-avatar.png";
import { useAccount } from "@/hooks/common";
import { getImageUrl } from "@/lib/api";
import { InlineProfileForm } from "./components";
import classes from "./ProfileInfoTab.module.scss";
import { useProfileInfoTab } from "./useProfileInfoTab";

export const ProfileInfoTab = () => {
  const { user } = useAccount();
  const { isEditing, startEditing, stopEditing } = useProfileInfoTab();

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

  if (isEditing) {
    return (
      <div className={classes.profile_info}>
        <div className={classes.header}>
          <div className={classes.title_section}>
            <User className={classes.title_icon} size={24} />
            <h1>Edit Profile</h1>
          </div>
          <button
            type="button"
            className={classes.cancel_button}
            onClick={stopEditing}
          >
            Cancel
          </button>
        </div>

        <InlineProfileForm user={user} onSuccess={stopEditing} />
      </div>
    );
  }

  return (
    <div className={classes.profile_info}>
      <div className={classes.header}>
        <div className={classes.title_section}>
          <User className={classes.title_icon} size={24} />
          <h1>Profile Information</h1>
        </div>
        <button
          type="button"
          className={classes.edit_button}
          onClick={startEditing}
        >
          <Edit3 size={18} />
          Edit Profile
        </button>
      </div>

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
            <div className={classes.detail_item}>
              <div className={classes.icon}>
                <Mail size={20} />
              </div>
              <div className={classes.detail_content}>
                <p className={classes.detail_label}>Email Address</p>
                <p className={classes.detail_value}>{user.email}</p>
                <p className={classes.detail_note}>Email cannot be changed</p>
              </div>
            </div>

            <div className={classes.detail_item}>
              <div className={classes.icon}>
                <User size={20} />
              </div>
              <div className={classes.detail_content}>
                <p className={classes.detail_label}>First Name</p>
                <p className={classes.detail_value}>
                  {user.first_name || "Not provided"}
                </p>
              </div>
            </div>

            <div className={classes.detail_item}>
              <div className={classes.icon}>
                <User size={20} />
              </div>
              <div className={classes.detail_content}>
                <p className={classes.detail_label}>Last Name</p>
                <p className={classes.detail_value}>
                  {user.last_name || "Not provided"}
                </p>
              </div>
            </div>

            <div className={classes.detail_item}>
              <div className={classes.icon}>
                <Phone size={20} />
              </div>
              <div className={classes.detail_content}>
                <p className={classes.detail_label}>Phone Number</p>
                <p className={classes.detail_value}>
                  {user.phone_number || "Not provided"}
                </p>
              </div>
            </div>

            <div className={classes.detail_item}>
              <div className={classes.icon}>
                <Shield size={20} />
              </div>
              <div className={classes.detail_content}>
                <p className={classes.detail_label}>Account Verification</p>
                <div className={classes.verification_status}>
                  <div className={classes.verification_item}>
                    {user.email_verified ? (
                      <>
                        <CheckCircle
                          size={16}
                          className={classes.verified_icon}
                        />
                        <span>Email verified</span>
                      </>
                    ) : (
                      <>
                        <XCircle
                          size={16}
                          className={classes.unverified_icon}
                        />
                        <span>Email not verified</span>
                      </>
                    )}
                  </div>
                  <div className={classes.verification_item}>
                    {user.phone_verified ? (
                      <>
                        <CheckCircle
                          size={16}
                          className={classes.verified_icon}
                        />
                        <span>Phone verified</span>
                      </>
                    ) : (
                      <>
                        <XCircle
                          size={16}
                          className={classes.unverified_icon}
                        />
                        <span>Phone not verified</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
