import classes from './Dropdown.module.scss';
import { LogOut, Settings, User } from 'lucide-react';

import Link from 'next/link';

import type { Dispatch, SetStateAction } from 'react';

type DropdownProps = {
  setIsDropdownOpen: Dispatch<SetStateAction<boolean>>
  handleLogout: () => void
}

export const Dropdown = ({ setIsDropdownOpen, handleLogout }: DropdownProps) => (
  <div className={classes.dropdown}>
    <Link href="/admin/profile" className={classes.dropdown_item} onClick={() => setIsDropdownOpen(false)}>
      <User size={16} />
      <span>Profile</span>
    </Link>
    <Link href="/admin/settings" className={classes.dropdown_item} onClick={() => setIsDropdownOpen(false)}>
      <Settings size={16} />
      <span>Settings</span>
    </Link>
    <div className={classes.dropdown_divider}></div>
    <button className={classes.dropdown_item} onClick={handleLogout}>
      <LogOut size={16} />
      <span>Logout</span>
    </button>
  </div>
);