import classes from './UserData.module.scss';
import default_avatar from '@/../public/common/default-avatar.png';

import type { UserWithoutPassword } from '@shared/src';

import Image from 'next/image';
import { Shimmer } from '@/components/styles';
import { getImageUrl } from '@/lib/api';

type UserDataProps = {
  user: UserWithoutPassword | null
}

export const UserData = ({ user }: UserDataProps) => (
  <>
    <Shimmer show_animation={!user} className={classes.image_container}>
      <Image src={getImageUrl(user?.image) ?? default_avatar.src} alt="Default Avatar" quality={100} height={45} width={45} className={classes.image} />
    </Shimmer>
    <div className={classes.info_container}>
      <Shimmer show_animation={!user} className={classes.account_name}>{user?.email}</Shimmer>
      <Shimmer show_animation={!user} className={classes.account_role}>{user?.role.toLowerCase()}</Shimmer>
    </div>
  </>
);