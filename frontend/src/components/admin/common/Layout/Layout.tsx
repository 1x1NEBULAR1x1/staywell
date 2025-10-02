import classes from './Layout.module.scss';

import { Sidebar, Header } from './components';
import { ReactNode } from 'react';

import { AccountProvider } from '@/components/common/providers';
type LayoutProps = {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => (
  <AccountProvider>
    <div className={classes.layout}>
      <Sidebar />
      <div className={classes.content}>
        <Header />
        {children}
      </div>
    </div>
  </AccountProvider>
);