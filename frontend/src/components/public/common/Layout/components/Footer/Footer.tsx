import classes from './Footer.module.scss';
import { Logo } from '@/components/common/Logo';

export const Footer = () => (
  <footer className={classes.footer}>

    <div className={classes.footer_top}>

      <div className={classes.footer_top_left}>

        <Logo />
        <p className={classes.add_text}> Looking forward to seeing you —<br />your perfect getaway starts with us. </p>

      </div>

      <div className={classes.footer_top_right}>

        <p className={classes.text}> Become hotel Owner </p>

        <a className={classes.register_button} href="/login">Register Now</a>

      </div>

    </div>

    <div className={classes.footer_bottom}>

      Copyright 2025 • All rights reserved

    </div>

  </footer>
);