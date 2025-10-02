'use client';

import classes from './Account.module.scss';
import { ChevronDown } from 'lucide-react';

import { useAccount } from '@/hooks/common';
import { useState, useRef, useEffect } from 'react';
import { Dropdown, UserData } from './components';
import { useRouter } from 'next/navigation';


export const Account = () => {
  const account = useAccount()
  const router = useRouter()
  const [is_dropdown_open, setIsDropdownOpen] = useState(false)
  const dropdown_ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdown_ref.current && !dropdown_ref.current.contains(event.target as Node)) setIsDropdownOpen(false)
    }
    if (is_dropdown_open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [is_dropdown_open])

  const handleLogout = () => {
    setIsDropdownOpen(false)
    router.push('/')
    account.logout();
  }

  return (
    <div className={classes.account} ref={dropdown_ref}>
      <UserData user={account.user} />
      <div className={classes.dropdown_toggle} onClick={() => setIsDropdownOpen(!is_dropdown_open)}>
        <ChevronDown size={16} className={`${classes.chevron} ${is_dropdown_open ? classes.chevron_rotated : ''}`} />
      </div>
      {is_dropdown_open && <Dropdown setIsDropdownOpen={setIsDropdownOpen} handleLogout={handleLogout} />}
    </div>
  )
};