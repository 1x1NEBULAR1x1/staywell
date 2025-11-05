import type { UserWithoutPassword } from "@shared/src";
import clsx from "clsx";
import Image from "next/image";
import { useChat } from "@/hooks/admin/chat/useChat";
import classes from "./ChatWindowHeader.module.scss";

interface ChatWindowHeaderProps {
  selected_user: UserWithoutPassword;
}

const formatLastSeen = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
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

export const ChatWindowHeader = ({ selected_user }: ChatWindowHeaderProps) => {
  const { getUserLastSeen } = useChat();
  const full_name = `${selected_user.first_name} ${selected_user.last_name}`;
  const avatar_url = selected_user.image || "/common/default-avatar.png";

  const lastSeen = getUserLastSeen(selected_user.id);
  const isOnline = lastSeen ? (Date.now() - lastSeen.getTime()) < 5 * 60 * 1000 : false;

  const statusText = isOnline
    ? "Online"
    : lastSeen
      ? formatLastSeen(lastSeen.getTime())
      : "Offline";

  return (
    <div className={classes.header}>
      <Image
        src={avatar_url}
        alt={full_name}
        width={50}
        height={50}
        className={classes.header_avatar}
      />
      <div className={classes.header_info}>
        <div className={classes.header_name}>{full_name}</div>
        <div className={clsx(classes.header_status, {
          [classes.header_status_online]: isOnline
        })}>
          {statusText}
        </div>
      </div>
    </div>
  );
};
