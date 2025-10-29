import classes from './ChatButton.module.scss';
import { MessageCircle } from 'lucide-react';
import { useChatStore } from '@/hooks/admin/chat/lib/useChatStore';

export const ChatButton = ({ user_id }: { user_id: string }) => {
  const selectChat = useChatStore((state) => state.selectChat);

  return (
    <button
      className={classes.chat_button}
      onClick={() => {
        selectChat(user_id);
        // TODO: Navigate to chat page when implemented
        console.log('Navigate to chat with user:', user_id);
      }}
    >
      <MessageCircle className={classes.icon} />
      Chat with User
    </button>
  );
};
