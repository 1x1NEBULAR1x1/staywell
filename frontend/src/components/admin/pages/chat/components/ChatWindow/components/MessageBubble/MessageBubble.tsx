import Image from 'next/image';
import clsx from 'clsx';
import classes from './MessageBubble.module.scss';
import { Message } from '@shared/src/database';
import { useEffect, useState } from 'react';

interface MessageBubbleProps {
  message: Message;
  is_outgoing: boolean;
  sender_avatar: string;
  is_new?: boolean;
}

export const MessageBubble = ({ message, is_outgoing, sender_avatar, is_new = false }: MessageBubbleProps) => {
  const [show_animation, setShowAnimation] = useState(is_new);

  useEffect(() => {
    if (is_new) {
      // Убираем класс анимации после её завершения
      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [is_new]);

  const formatted_time = new Date(message.created).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={clsx(classes.message, {
        [classes.message_outgoing]: is_outgoing,
        [classes.message_incoming]: !is_outgoing,
        [classes.message_animate]: show_animation,
      })}
    >
      <Image
        src={sender_avatar}
        alt="Avatar"
        width={40}
        height={40}
        className={classes.message_avatar}
      />
      <div className={classes.message_content}>
        <div className={classes.message_bubble}>
          <div className={classes.message_text}>{message.message}</div>
        </div>
        <div className={classes.message_time}>{formatted_time}</div>
      </div>
    </div>
  );
};

