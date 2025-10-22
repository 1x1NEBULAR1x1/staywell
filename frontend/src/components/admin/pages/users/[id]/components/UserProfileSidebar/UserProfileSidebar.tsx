'use client';

import { UserWithoutPassword } from '@shared/src';
import { UserTab } from '../../User';
import classes from './UserProfileSidebar.module.scss';
import { User, Calendar, DollarSign, Star, PartyPopper, ArrowLeftRight } from 'lucide-react';
import Image from 'next/image';

interface UserProfileSidebarProps {
  user: UserWithoutPassword;
  activeTab: UserTab;
  setActiveTab: (tab: UserTab) => void;
}

const navItems = [
  { id: 'profile' as UserTab, label: 'Profile', icon: User },
  { id: 'bookings' as UserTab, label: 'Bookings', icon: Calendar },
  { id: 'transactions' as UserTab, label: 'Transactions', icon: DollarSign },
  { id: 'reservations' as UserTab, label: 'Reservations', icon: Calendar },
  { id: 'reviews' as UserTab, label: 'Reviews', icon: Star },
  { id: 'events' as UserTab, label: 'Events', icon: PartyPopper },
  { id: 'transfers' as UserTab, label: 'Transfers', icon: ArrowLeftRight },
];

export const UserProfileSidebar = ({ user, activeTab, setActiveTab }: UserProfileSidebarProps) => {
  return (
    <div className={classes.sidebar}>
      <div className={classes.user_info}>
        <div className={classes.avatar_container}>
          <Image
            src={user.image || '/common/default-avatar.png'}
            alt={`${user.first_name} ${user.last_name}`}
            width={80}
            height={80}
            className={classes.avatar}
          />
          <div className={`${classes.status_badge} ${user.is_active ? classes.active : classes.inactive}`}>
            {user.is_active ? 'Active' : 'Inactive'}
          </div>
        </div>
        <h2 className={classes.user_name}>{user.first_name} {user.last_name}</h2>
        <p className={classes.user_email}>{user.email}</p>
        <div className={classes.user_role}>{user.role}</div>
      </div>

      <nav className={classes.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`${classes.nav_button} ${activeTab === item.id ? classes.active : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className={classes.nav_icon} />
              <span className={classes.nav_label}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

