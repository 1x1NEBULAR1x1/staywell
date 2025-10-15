import classes from './Layout.module.scss';

import { Sidebar, Header } from './components';
import { ReactNode } from 'react';

import { AccountProvider } from '@/components/common/providers';
import { RoleGuard } from '../RoleGuard';
import { Role } from '@shared/src/database';


export const Layout = ({ children }: { children: ReactNode }) => (
  <AccountProvider>
    <RoleGuard redirect_to='/auth/login' required_roles={[Role.ADMIN]}>
      <div className={classes.layout}>
        <Sidebar />
        <div className={classes.content}>
          <Header />
          {children}
        </div>
      </div>
    </RoleGuard>
  </AccountProvider>
);