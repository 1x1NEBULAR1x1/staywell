import Image from "next/image";
import support_avatar_image from "@/../public/common/default-avatar.png";
//import { useChat } from "@/hooks/public/chat"; TODO: Add support last seen
import classes from "./ChatWindowHeader.module.scss";

export const ChatWindowHeader = () => {
  //const { support_last_seen } = useChat(); TODO: Add support last seen

  return (
    <div className={classes.header}>
      <div className={classes.header_left}>
        <Image
          src={support_avatar_image}
          alt="Support"
          width={40}
          height={40}
          className={classes.header_avatar}
        />
        <div className={classes.header_info}>
          <div className={classes.header_name}>Support</div>
        </div>
      </div>
    </div>
  );
};
