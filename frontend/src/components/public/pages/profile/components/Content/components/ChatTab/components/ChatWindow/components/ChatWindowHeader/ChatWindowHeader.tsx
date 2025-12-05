import { Mail, MoreHorizontal, Phone } from "lucide-react";
import Image from "next/image";
import default_avatar from "@/../public/common/default-avatar.png";
import { useChat } from "@/hooks/public/chat";
import classes from "./ChatWindowHeader.module.scss";

export const ChatWindowHeader = () => {
  const { support_online } = useChat();

  return (
    <div className={classes.header}>
      <div className={classes.header_left}>
        <Image
          src={default_avatar}
          alt="Admin"
          width={40}
          height={40}
          className={classes.header_avatar}
        />
        <div className={classes.header_info}>
          <div className={classes.header_name}>Terion</div>
        </div>
      </div>
      <div className={classes.header_actions}>
        <button className={classes.header_action_btn}>
          <Phone size={20} />
        </button>
        <button className={classes.header_action_btn}>
          <Mail size={20} />
        </button>
        <button className={classes.header_action_btn}>
          <MoreHorizontal size={20} />
        </button>
      </div>
    </div>
  );
};
