"use client";

import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useChat } from "@/hooks/admin/chat/useChat";
import classes from "./ChatButton.module.scss";

export const ChatButton = ({ user_id }: { user_id: string }) => {
  const { joinChat } = useChat();
  const router = useRouter();

  return (
    <button
      type="button"
      className={classes.chat_button}
      onClick={() => {
        joinChat(user_id);
        router.push(`/admin/chat?id=${user_id}`);
      }}
    >
      <MessageCircle className={classes.icon} />
      Chat with User
    </button>
  );
};
