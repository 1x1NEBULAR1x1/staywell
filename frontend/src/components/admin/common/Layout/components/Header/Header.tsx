import classes from './Header.module.scss';

import { Account, Message, NotificationDropdown } from './components';

export const Header = () => (
  <header className={classes.header}>
    <div className={classes.left}>
      <Message />
      <NotificationDropdown />

    </div>
    <div className={classes.right}>
      <Account />
    </div>
  </header>
)