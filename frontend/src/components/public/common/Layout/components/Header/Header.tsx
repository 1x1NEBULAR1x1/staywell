"use client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { useAccount } from "@/hooks/common/useAccount";
import { Account, Navigation } from "./components";
import classes from "./Header.module.scss";

export const Header = () => {
  const account = useAccount();
  return (
    <header className={classes.header}>
      <div className={classes.header_left}>
        <Logo />
      </div>

      <div className={classes.header_right}>
        <Navigation />
        {account.user ? (
          <Account user={account.user} />
        ) : account.is_loading ? (
          <div className={classes.login_button}>
            <Loader2 className={classes.loader} />
          </div>
        ) : (
          <Link className={classes.login_button} href="/auth/login">
            Login
          </Link>
        )}
      </div>
    </header>
  );
};
