'use client';
import classes from './Header.module.scss';
import { Logo } from '@/components/common/Logo';
import { Navigation, Account } from './components';
import Link from 'next/link';
import { useAccount } from '@/hooks/common/useAccount';
import { Loader2 } from 'lucide-react';

type HeaderProps = {}

export const Header = ({ }: HeaderProps) => {
  const account = useAccount();
  return (
    <header className={classes.header}>
      <div className={classes.header_left}>
        <Logo />
      </div>

      <div className={classes.header_right}>
        <Navigation />
        {!!account.user
          ? <Account user={account.user} />
          : <>{!account.user && account.is_account_loading
            ? <div className={classes.login_button}><Loader2 className={classes.loader} /></div>
            : <Link className={classes.login_button} href="/auth/login">Login</Link>
          }</>
        }
      </div>
    </header>
  )
};