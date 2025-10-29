'use client';

import classes from "./ConnectionStatus.module.scss";
import { useChat } from "@/hooks/admin/chat/useChat";

export const ConnectionStatus = () => {
  const { is_connected } = useChat();
  return is_connected ? null : (
    <div className={classes.connection_status}>
      <div className={classes.offline_indicator} />
      <span>Connecting to chat...</span>
    </div>
  );
};