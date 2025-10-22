import classes from './UserData.module.scss';
import { UserWithoutPassword } from '@shared/src';
import { EditUserModal } from './components';
import { ChatButton } from '../ChatButton/ChatButton';

export const UserData = ({ user, setIsEditModalOpen, isEditModalOpen, refetch }: {
  user: UserWithoutPassword,
  setIsEditModalOpen: (isEditModalOpen: boolean) => void,
  isEditModalOpen: boolean,
  refetch: () => void
}) => (
  <>
    <h1 className={classes.title_container}>
      <span className={classes.title}>{user.first_name} {user.last_name}</span>
      <div className={classes.actions}>
        <ChatButton user_id={user.id} />
        <button
          className={classes.edit_button}
          onClick={() => setIsEditModalOpen(true)}
        >
          Edit User
        </button>
      </div>
    </h1>
    <div className={classes.info}>
      <div className={classes.email}>Email: {user.email}</div>
      <div className={classes.phone}>Phone: {user.phone_number || 'Not provided'}</div>
      <div className={classes.role}>Role: {user.role}</div>
      <div className={classes.status}>Status: {user.is_active ? 'Active' : 'Inactive'}</div>
      <div className={classes.verification}>
        Email verified: {user.email_verified ? 'Yes' : 'No'} |
        Phone verified: {user.phone_verified ? 'Yes' : 'No'}
      </div>
    </div>

    {isEditModalOpen && (
      <EditUserModal
        user={user}
        onClose={() => setIsEditModalOpen(false)}
        refetch={refetch}
      />
    )}
  </>
);
