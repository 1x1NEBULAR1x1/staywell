"use client";

import classes from "./ChatTab.module.scss";
import { UserChatProvider, ChatWindow } from "./components";

export const ChatTab = () => {
  return (
    <UserChatProvider>
      <div className={classes.chat_tab}>
        <div className={classes.chat_tab_header}>
          <h1 className={classes.chat_tab_title}>Chat with admin</h1>
        </div>
        <ChatWindow />
      </div>
    </UserChatProvider>
  );
};

