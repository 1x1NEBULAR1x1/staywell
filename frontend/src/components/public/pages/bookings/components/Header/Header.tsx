import Link from "next/link";
import classes from "./Header.module.scss";

export const Header = ({ title }: { title: string }) => (
  <div className={classes.header}>
    <div className={classes.navigation}>
      <Link href="/">Home</Link>
      <p> / </p>
      <p className={classes.current_page}>My Bookings</p>
    </div>
    <h2 className={classes.title}>{title}</h2>
  </div>
);



