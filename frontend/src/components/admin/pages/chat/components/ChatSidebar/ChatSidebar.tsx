"use client";

import { useChat } from "@/hooks/admin/chat/useChat";
import classes from "./ChatSidebar.module.scss";
import {
  ChatSidebarHeader,
  ChatUserList,
} from "./components";

export const ChatSidebar = () => {
  const { is_connected } = useChat();

  return (
    <div className={classes.sidebar}>
      <ChatSidebarHeader />

      <ChatUserList />

      {!is_connected && (
        <div className={classes.connection_status}>
          <div className={classes.offline_indicator} />
          <span>Connecting to chat...</span>
        </div>
      )}
    </div>
  );
};
