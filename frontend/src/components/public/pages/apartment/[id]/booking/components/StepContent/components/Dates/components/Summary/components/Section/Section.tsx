import classes from './Section.module.scss';
import { ReactNode } from 'react';


export const Section = ({ title, children }: { title: string, children: ReactNode }) => (
  <div className={classes.section}>
    <h4 className={classes.title}>{title}</h4>
    {children}
  </div>
);