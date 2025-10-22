import Image from 'next/image';
import classes from './ChatWindowHeader.module.scss';
import { UserWithoutPassword } from '@shared/src';

interface ChatWindowHeaderProps {
  selected_user: UserWithoutPassword;
}

export const ChatWindowHeader = ({ selected_user }: ChatWindowHeaderProps) => {
  const full_name = `${selected_user.first_name} ${selected_user.last_name}`;
  const avatar_url = selected_user.image || '/common/default-avatar.png';

  return (
    <div className={classes.header}>
      <Image
        src={avatar_url}
        alt={full_name}
        width={50}
        height={50}
        className={classes.header_avatar}
      />
      <div className={classes.header_info}>
        <div className={classes.header_name}>{full_name}</div>
        <div className={classes.header_email}>{selected_user.email}</div>
      </div>
    </div>
  );
};

