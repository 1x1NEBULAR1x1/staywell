import classes from './UserRow.module.scss';
import default_avatar from '@/../public/common/default-avatar.png';

import Image from 'next/image';
import { UserWithoutPassword } from '@shared/src';
import { Shimmer } from '@/components/styles';
import { useRouter } from 'next/navigation';

type UserRowProps = {
  user: UserWithoutPassword;
}

export const UserRow = ({ user }: UserRowProps) => {
  const router = useRouter()
  return (
    <tr className={classes.user_row} onClick={() => router.push(`/admin/users/${user.id}`)}>
      <td>
        <div className={classes.user_row_name_container}>
          <Image src={user.image || default_avatar.src} alt="Default Avatar" width={45} height={45} className={classes.user_row_avatar} />
          <div className={classes.user_row_name_container_info}>
            <p className={classes.user_row_name_container_info_name}>{user.first_name} {user.last_name}</p>
            <span className={classes.user_row_name_container_info_email}>{user.email}</span>
          </div>
        </div>
      </td>
      <td ><span className={classes.user_row_role}>{user.role.toLowerCase()}</span></td>
      <td className={classes.user_row_created}>{new Date(user.created).toDateString()}</td>
    </tr>
  );
}


export const UserRowShimmer = () => (
  <tr className={classes.user_row}>
    <td>
      <div className={classes.user_row_name_container}>
        <Shimmer className={classes.user_row_avatar} />
        <div className={classes.user_row_name_container_info}>
          <Shimmer className={classes.user_row_name_container_info_name} />
          <Shimmer className={classes.user_row_name_container_info_email} />
        </div>
      </div>
    </td>
    <td ><Shimmer className={classes.user_row_role} /></td>
    <td ><Shimmer className={classes.user_row_created} /></td>
  </tr >
);