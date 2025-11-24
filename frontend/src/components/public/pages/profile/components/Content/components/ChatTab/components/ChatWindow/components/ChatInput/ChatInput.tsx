import { SendHorizonal } from "lucide-react";
import classes from "./ChatInput.module.scss";

interface ChatInputProps {
  message_value: string;
  is_sending: boolean;
  onMessageChange: (value: string) => void;
  onSend: () => void;
}

export const ChatInput = ({
  message_value,
  is_sending,
  onMessageChange,
  onSend,
}: ChatInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className={classes.input}>
      <div className={classes.input_container}>
        <div className={classes.input_field}>
          <textarea
            placeholder="Type something"
            value={message_value}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={is_sending}
          />
        </div>
        <button
          className={classes.input_button}
          onClick={onSend}
          disabled={!message_value.trim() || is_sending}
        >
          <SendHorizonal />
        </button>
      </div>
    </div>
  );
};

