"use client";

import clsx from "clsx";
import { MessageSquareMore } from "lucide-react";
import { useEffect } from "react";
import { AdminPage } from "@/components/admin/common/AdminPage";
import { useChat } from "@/hooks/admin/chat/useChat";
import { useQPId } from "@/hooks/common/useId";
import classes from "./Chat.module.scss";
import { AdminChatProvider, ChatSidebar, ChatWindow } from "./components";

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
      <div
        className={clsx(classes.chat, {
          [classes.chat_collapsed]: is_collapsed,
        })}
      >
        <div className={classes.chat_main}>
          {selected_chat_id ? (
            <ChatWindow />
          ) : (
            <div className={classes.chat_empty}>
              <MessageSquareMore size={48} />
              <div>Select a conversation to start messaging</div>
            </div>
          )}
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
