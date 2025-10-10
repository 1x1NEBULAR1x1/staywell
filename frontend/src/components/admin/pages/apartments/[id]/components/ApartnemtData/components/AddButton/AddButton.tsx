import classes from './AddButton.module.scss';
import { PlusIcon } from 'lucide-react';


export const AddButton = ({ onClick, size = 32 }: { onClick: () => void, size?: number }) => (
  <button className={classes.add_button} type='button' style={{ width: size, height: size }} onClick={onClick}>
    <PlusIcon />
  </button>
);