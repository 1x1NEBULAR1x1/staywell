import classes from './Header.module.scss';

import { Account, Message, Notification } from './components';

export const Header = () => (
  <header className={classes.header}>
    <div className={classes.left}>
      <Message />
      <Notification />

    </div>
    <div className={classes.right}>
      <Account />
    </div>
  </header>
)