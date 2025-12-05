"use client";

import type { ExtendedTransaction } from "@shared/src/types";
import { format } from "date-fns";
import Image from "next/image";
import no_image from "@/../public/common/no-image.jpeg";
import classes from "./UserTab.module.scss";

export const UserTab = ({
  transaction,
}: {
  transaction: ExtendedTransaction;
}) => {
  const user = transaction.user;

  return (
    <div className={classes.user_tab}>
      {/* User Profile */}
      <div className={classes.section}>
        <h3 className={classes.section_title}>User Information</h3>
        <div className={classes.user_profile}>
          <div className={classes.user_avatar}>
            <Image
              src={user.image || no_image.src}
              alt={`${user.first_name} ${user.last_name}`}
              width={80}
              height={80}
              className={classes.avatar_image}
            />
          </div>
          <div className={classes.user_info}>
            <h4 className={classes.user_name}>
              {user.first_name} {user.last_name}
            </h4>
            <p className={classes.user_email}>{user.email}</p>
            {user.phone_number && (
              <p className={classes.user_phone}>{user.phone_number}</p>
            )}
          </div>
          <div className={classes.user_status}>
            <span
              className={`${classes.status_badge} ${user.is_active ? classes.active : classes.inactive}`}
            >
              {user.is_active ? "Active" : "Inactive"}
            </span>
            {user.email_verified && (
              <span className={classes.verification_badge}>Email Verified</span>
            )}
            {user.phone_verified && (
              <span className={classes.verification_badge}>Phone Verified</span>
            )}
          </div>
        </div>
      </div>

      {/* User Details */}
      <div className={classes.section}>
        <h3 className={classes.section_title}>Account Details</h3>
        <div className={classes.details_grid}>
          <div className={classes.detail_item}>
            <span className={classes.detail_label}>User ID</span>
            <span className={classes.detail_value}>{user.id}</span>
          </div>
          <div className={classes.detail_item}>
            <span className={classes.detail_label}>Email</span>
            <span className={classes.detail_value}>{user.email}</span>
          </div>
          {user.phone_number && (
            <div className={classes.detail_item}>
              <span className={classes.detail_label}>Phone</span>
              <span className={classes.detail_value}>{user.phone_number}</span>
            </div>
          )}
          {user.date_of_birth && (
            <div className={classes.detail_item}>
              <span className={classes.detail_label}>Date of Birth</span>
              <span className={classes.detail_value}>
                {format(new Date(user.date_of_birth), "PPP")}
              </span>
            </div>
          )}
          <div className={classes.detail_item}>
            <span className={classes.detail_label}>Role</span>
            <span className={classes.detail_value}>
              {user.role.toLowerCase()}
            </span>
          </div>
          <div className={classes.detail_item}>
            <span className={classes.detail_label}>Joined</span>
            <span className={classes.detail_value}>
              {format(new Date(user.created), "PPP")}
            </span>
          </div>
          <div className={classes.detail_item}>
            <span className={classes.detail_label}>Email Notifications</span>
            <span className={classes.detail_value}>
              {user.email_notifications ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
