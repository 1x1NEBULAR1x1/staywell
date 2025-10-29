"use client";

import { ChatUserItem, EmptyMessage } from "./components";
import classes from "./ChatUserList.module.scss";
import { useChat } from "@/hooks/admin/chat/useChat";


export const ChatUserList = () => {
  const { chats, selectChat, joinChat, selected_chat_id, isTyping } = useChat();

  return chats.length > 0
    ?
    <div className={classes.list}>
      {chats.map((chat) => (
        <ChatUserItem
          key={chat.user.id}
          user={chat.user}
          is_active={selected_chat_id === chat.user.id}
          last_message={chat.last_message}
          unread_count={chat.unread_count}
          is_online={chat.is_online}
          is_typing={isTyping(chat.user.id)}
          onClick={() => joinChat(chat.user.id)}
        />
      ))}
    </div>
    :
    <EmptyMessage />;
};
