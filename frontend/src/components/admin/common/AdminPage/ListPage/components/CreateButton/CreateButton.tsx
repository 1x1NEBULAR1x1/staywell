import classes from './CreateButton.module.scss';

import { ButtonHTMLAttributes } from 'react';

type CreateButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  onClick: () => void;
}

export const CreateButton = ({ label, onClick }: CreateButtonProps) => (
  <button className={classes.create_button} onClick={onClick}>{label}</button>
);