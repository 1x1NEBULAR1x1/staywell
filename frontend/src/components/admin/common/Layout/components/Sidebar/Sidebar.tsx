import classes from './Sidebar.module.scss';

import { Logo } from '@/components/common/Logo';
import { Navigation } from './components';

type SidebarProps = {}

export const Sidebar = ({ }: SidebarProps) => (
  <aside className={classes.sidebar}>
    <header className={classes.header}>
      <Logo />
    </header>
    <Navigation />
  </aside>
);