"use client";

import clsx from "clsx";
import { useEffect } from "react";
import { AdminPage } from "@/components/admin/common/AdminPage";
import classes from "./Chat.module.scss";
import {
  AdminChatProvider,
  ChatSidebar,
  ChatWindow,
} from "./components";
import { useChat } from "@/hooks/admin/chat/useChat";
import { useQPId } from "@/hooks/common/useId";

const ChatContent = () => {
  const selected_chat_id = useQPId();
  const { is_collapsed, joinChat } = useChat();

  // Auto-join when chat id is present in URL
  useEffect(() => {
    if (selected_chat_id) {
      joinChat(selected_chat_id);
    }
  }, [selected_chat_id, joinChat]);

  return (
    <AdminPage title="Chat">
      <div className={clsx(classes.chat, { [classes.chat_collapsed]: is_collapsed })}  >
        <div className={classes.chat_main}>
          {selected_chat_id
            ? <ChatWindow />
            :
            <div className={classes.chat_empty}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <div>Select a conversation to start messaging</div>
            </div>
          }
        </div>
        <div className={classes.chat_sidebar}>
          <ChatSidebar />
        </div>
      </div>
    </AdminPage>
  );
};

export const Chat = () => {
  return (
    <AdminChatProvider>
      <ChatContent />
    </AdminChatProvider>
  );
};
