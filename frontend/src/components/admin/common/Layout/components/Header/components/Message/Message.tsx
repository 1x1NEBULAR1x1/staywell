'use client';

import classes from './Message.module.scss';

export const Message = () => {
  const message = "Hello, World!";
  const sub_message = "Welcome to the dashboard";

  return (
    <div className={classes.message_container}>
      <span className={classes.message}>{message}</span>
      <span className={classes.sub_message}>{sub_message}</span>
    </div>
  )
};