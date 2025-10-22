'use client';

import { useState } from 'react';
import { useUsers } from '@/hooks/admin/queries/users/useUsers';
import { AdminPage } from "@/components/admin/common/AdminPage";
import { UserProfileSidebar, TransfersTab, BookingsTab, TransactionsTab, ReservationsTab, ReviewsTab, EventsTab, ProfileTab } from "./components";
import classes from './User.module.scss';

export type UserTab = 'profile' | 'bookings' | 'transactions' | 'reservations' | 'reviews' | 'events' | 'transfers';

export const User = ({ id }: { id: string }) => {
  const { data: user, refetch } = useUsers().find(id);
  const [activeTab, setActiveTab] = useState<UserTab>('profile');

  if (!user) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab user={user} refetch={refetch} />;
      case 'bookings':
        return <BookingsTab user_id={user.id} />;
      case 'transactions':
        return <TransactionsTab user_id={user.id} />;
      case 'reservations':
        return <ReservationsTab user_id={user.id} />;
      case 'reviews':
        return <ReviewsTab user_id={user.id} />;
      case 'events':
        return <EventsTab user_id={user.id} />;
      case 'transfers':
        return <TransfersTab user_id={user.id} />;
      default:
        return null;
    }
  };

  return (
    <AdminPage title={`${user.first_name} ${user.last_name}`}>
      <div className={classes.user_profile}>
        <UserProfileSidebar
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div className={classes.content}>
          {renderTabContent()}
        </div>
      </div>
    </AdminPage>
  );
};