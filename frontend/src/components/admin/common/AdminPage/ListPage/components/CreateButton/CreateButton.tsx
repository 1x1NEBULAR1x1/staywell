import type { ButtonHTMLAttributes } from "react";
import classes from "./CreateButton.module.scss";

type CreateButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  onClick: () => void;
};

export const CreateButton = ({ label, onClick }: CreateButtonProps) => (
  <button type="button" className={classes.create_button} onClick={onClick}>
    {label}
  </button>
);
