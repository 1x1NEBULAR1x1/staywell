"use client";

import clsx from "clsx";
import Image from "next/image";
import support_avatar_image from "@/../public/common/default-avatar.png";
import { useChat } from "@/hooks/public/chat";
import classes from "./ChatWindowHeader.module.scss";

const formatLastSeen = (timestamp: Date | null) => {
  if (!timestamp) return "Offline";

  const now = Date.now();
  const diff = now - timestamp.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (seconds < 60) return "Active now";
  if (minutes === 1) return "Last seen 1m ago";
  if (minutes < 60) return `Last seen ${minutes}m ago`;
  if (hours === 1) return "Last seen 1h ago";
  if (hours < 24) return `Last seen ${hours}h ago`;
  if (days === 1) return "Last seen yesterday";
  if (days < 7) return `Last seen ${days}d ago`;
  return "Last seen long ago";
};

export const ChatWindowHeader = () => {
  const { support_online, support_last_seen } = useChat();

  const statusText = support_online
    ? "Online"
    : formatLastSeen(support_last_seen);

  return (
    <div className={classes.header}>
      <div className={classes.header_left}>
        <Image
          src={support_avatar_image}
          alt="Support"
          width={50}
          height={50}
          className={classes.header_avatar}
        />
        <div className={classes.header_info}>
          <div className={classes.header_name}>Support</div>
          <div
            className={clsx(classes.header_status, {
              [classes.header_status_online]: support_online,
            })}
          >
            {statusText}
          </div>
        </div>
      </div>
    </div>
  );
};
