import Link from "next/link";
import classes from "./Header.module.scss";

export const Header = ({
  title,
  booking_id,
}: {
  title?: string;
  booking_id: string;
}) => (
  <div className={classes.header}>
    <div className={classes.navigation}>
      <Link href="/">Home</Link>
      <p> / </p>
      <Link href="/bookings">My Bookings</Link>
      <p> / </p>
      <Link href={`/bookings/${booking_id}`}>Booking Details</Link>
      {title && (
        <>
          <p> / </p>
          <p className={classes.current_page}>{title}</p>
        </>
      )}
    </div>
  </div>
);
