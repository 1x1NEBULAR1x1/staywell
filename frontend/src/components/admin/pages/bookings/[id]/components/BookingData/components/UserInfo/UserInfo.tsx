import type { UserWithoutPassword } from "@shared/src";
import { ExternalLink, Mail, Phone, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import classes from "./UserInfo.module.scss";

export const UserInfo = ({ user }: { user: UserWithoutPassword }) => (
  <div className={classes.user_info}>
    <div className={classes.header}>
      <User className={classes.header_icon} />
      <h3 className={classes.title}>Guest Information</h3>
      <Link href={`/admin/users/${user.id}`} className={classes.link_button}>
        <ExternalLink className={classes.link_icon} />
        Profile
      </Link>
    </div>

    <div className={classes.content}>
      <div className={classes.user_details}>
        <div className={classes.user_header}>
          <div className={classes.user_avatar}>
            <Image
              src={user.image || "/common/default-avatar.png"}
              alt={user.first_name || "User"}
              width={60}
              height={60}
              className={classes.avatar_image}
            />
          </div>
          <div className={classes.user_name}>
            {user.first_name && user.last_name
              ? `${user.first_name} ${user.last_name}`
              : user.email}
          </div>
        </div>

        <div className={classes.contact_info}>
          <div className={classes.contact_item}>
            <Mail className={classes.contact_icon} />
            <span>{user.email}</span>
          </div>

          {user.phone_number && (
            <div className={classes.contact_item}>
              <Phone className={classes.contact_icon} />
              <span>{user.phone_number}</span>
            </div>
          )}
        </div>

        <div className={classes.verification_status}>
          <div className={classes.status_item}>
            <span
              className={`${classes.status_badge} ${user.email_verified ? classes.verified : classes.not_verified}`}
            >
              {user.email_verified
                ? "✓ Email Verified"
                : "⚠ Email Not Verified"}
            </span>
          </div>

          {user.phone_number && (
            <div className={classes.status_item}>
              <span
                className={`${classes.status_badge} ${user.phone_verified ? classes.verified : classes.not_verified}`}
              >
                {user.phone_verified
                  ? "✓ Phone Verified"
                  : "⚠ Phone Not Verified"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
