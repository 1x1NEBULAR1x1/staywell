'use client';

import { useState } from 'react';
import { UserWithoutPassword } from '@shared/src';
import classes from '../Tab.module.scss';
import { EditUserModal } from '../UserData/components';
import { useModel } from '@/hooks/admin/queries';
import { AccountSection, Header, InfoSection } from './components';

interface ProfileTabProps {
  user: UserWithoutPassword;
  refetch: () => void;
}

export const ProfileTab = ({ user, refetch }: ProfileTabProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { data: sessions } = useModel('SESSION').get({ user_id: user.id, skip: 0, take: 1, sort_field: 'created', sort_direction: 'asc' });
  return (
    <div className={classes.tab}>
      <Header user={user} setIsEditModalOpen={setIsEditModalOpen} />

      <InfoSection user={user} />

      <AccountSection user={user} sessions={sessions} />

      {isEditModalOpen && (
        <EditUserModal
          user={user}
          onClose={() => setIsEditModalOpen(false)}
          refetch={refetch}
        />
      )}
    </div>
  );
};

