import classes from './AdminPage.module.scss';

import { ReactNode } from 'react';

type AdminPageProps = {
  title: string;
  children: ReactNode;
}

export const AdminPage = ({ title, children }: AdminPageProps) => (
  <div className={classes.page}>
    <h1 className={classes.title}>{title}</h1>
    {children}
  </div>
);