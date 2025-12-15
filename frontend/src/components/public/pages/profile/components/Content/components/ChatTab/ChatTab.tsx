"use client";

import classes from "./ChatTab.module.scss";
import { ChatWindow, UserChatProvider } from "./components";

export const ChatTab = () => {
  return (
    <UserChatProvider>
      <div className={classes.chat_tab}>
        <ChatWindow />
      </div>
    </UserChatProvider>
  );
};
