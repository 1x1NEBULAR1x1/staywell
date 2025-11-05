"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const useChatUserItem = () => {
  const router = useRouter();

  const handleChatClick = useCallback((userId: string) => {
    router.push(`/admin/chat?id=${userId}`);
  }, [router]);

  return { handleChatClick };
};
