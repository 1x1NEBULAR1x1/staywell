'use client';

import classes from './Account.module.scss';
import default_avatar from '@/../public/common/default-avatar.png';

import { ChevronDown, User, MessageSquare, Calendar, Settings, LogOut } from 'lucide-react';
import { SafeUser } from '@shared/src';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/common';
import clsx from 'clsx';


export const Account = ({ user }: { user: SafeUser }) => {
  const [is_dropdown_open, setIsDropdownOpen] = useState(false);
  const dropdown_ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { logout, is_logout_loading } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdown_ref.current && !dropdown_ref.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (is_dropdown_open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [is_dropdown_open]);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
  };

  const getUserDisplayName = () => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.email;
  };

  return (
    <div className={classes.account} ref={dropdown_ref} onClick={() => setIsDropdownOpen(!is_dropdown_open)}>
      <div className={classes.user_info}>
        <div className={classes.avatar_container}>
          <Image
            src={user.image || default_avatar.src}
            alt="User Avatar"
            width={400}
            height={400}
            quality={100}
            className={classes.avatar}
          />
        </div>
        <div className={classes.user_details}>
          <div className={classes.user_name}>{getUserDisplayName()}</div>
          <div className={classes.user_email}>{user.email}</div>
        </div>
      </div>

      <button
        className={classes.dropdown_toggle}
        aria-label="Account Menu"
      >
        <ChevronDown
          size={20}
          className={clsx(classes.chevron, is_dropdown_open && classes.chevron_rotated)}
        />
      </button>

      {is_dropdown_open && (
        <div className={classes.dropdown}>
          <button
            className={classes.dropdown_item}
            onClick={() => {
              setIsDropdownOpen(false);
              router.push('/chat');
            }}
          >
            <MessageSquare size={16} />
            <span>Chat</span>
          </button>

          <button
            className={classes.dropdown_item}
            onClick={() => {
              setIsDropdownOpen(false);
              router.push('/bookings');
            }}
          >
            <Calendar size={16} />
            <span>Booking</span>
          </button>

          <button
            className={classes.dropdown_item}
            onClick={() => {
              setIsDropdownOpen(false);
              router.push('/settings');
            }}
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>

          <button
            className={classes.dropdown_item}
            onClick={() => {
              setIsDropdownOpen(false);
              router.push('/profile');
            }}
          >
            <User size={16} />
            <span>Profile</span>
          </button>

          <div className={classes.dropdown_divider}></div>

          <button
            className={classes.dropdown_item}
            onClick={handleLogout}
            disabled={is_logout_loading}
          >
            <LogOut size={16} />
            <span>{is_logout_loading ? 'Signing out...' : 'Logout'}</span>
          </button>
        </div>
      )}
    </div>
  );
};