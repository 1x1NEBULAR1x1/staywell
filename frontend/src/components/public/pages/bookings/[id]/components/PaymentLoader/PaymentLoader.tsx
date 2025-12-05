import { Loader } from "lucide-react";
import Link from "next/link";
import classes from "./PaymentLoader.module.scss";

export const PaymentLoader = ({ booking_id }: { booking_id: string }) => (
  <div className={classes.loader}>
    <div className={classes.loader_icon}>
      <Loader size={80} />
    </div>
    <h3 className={classes.loader_title}>Loading Booking data...</h3>
    <p className={classes.loader_description}>
      Please wait while we process your booking.
    </p>
    <Link href={`/bookings/${booking_id}`} className={classes.primary_button}>
      View Booking Details
    </Link>
    <Link href="/bookings" className={classes.secondary_button}>
      Back to My Bookings
    </Link>
  </div>
);
