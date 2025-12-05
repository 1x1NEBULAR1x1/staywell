import type { ExtendedBooking } from "@shared/src";
import { format } from "date-fns";
import {
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Hash,
  XCircle,
} from "lucide-react";
import { Shimmer } from "@/components/styles/ui";
import classes from "./BookingSummary.module.scss";

export const BookingSummary = ({ booking }: { booking?: ExtendedBooking }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle size={24} className={classes.status_confirmed} />;
      case "pending":
        return <Clock size={24} className={classes.status_pending} />;
      case "cancelled":
        return <XCircle size={24} className={classes.status_cancelled} />;
      default:
        return <Clock size={24} className={classes.status_default} />;
    }
  };

  const calculateNights = () => {
    const checkIn = new Date(booking?.start ?? new Date());
    const checkOut = new Date(booking?.end ?? new Date());
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return !booking ? (
    <BookingSummaryShimmer />
  ) : (
    <div className={classes.summary}>
      <h3 className={classes.title}>Booking Summary</h3>

      <div className={classes.info_grid}>
        <div className={classes.info_item}>
          <div className={classes.icon_wrapper}>
            <Hash size={24} />
          </div>
          <div className={classes.item_content}>
            <span className={classes.label}>Booking ID</span>
            <span className={classes.value}>#{booking.id}</span>
          </div>
        </div>

        <div className={classes.info_item}>
          <div className={classes.icon_wrapper}>
            {getStatusIcon(booking.status)}
          </div>
          <div className={classes.item_content}>
            <span className={classes.label}>Status</span>
            <span
              className={`${classes.value} ${classes.status_badge}`}
              data-status={booking.status}
            >
              {booking.status.toLowerCase()}
            </span>
          </div>
        </div>

        <div className={classes.info_item}>
          <div className={classes.icon_wrapper}>
            <Calendar size={24} />
          </div>
          <div className={classes.item_content}>
            <span className={classes.label}>Booking Dates</span>
            <span className={classes.value}>
              {format(new Date(booking.start), "dd MMMM yyyy")} -{" "}
              {format(new Date(booking.end), "dd MMMM yyyy")}
            </span>
            <span className={classes.nights}>{calculateNights()} nights</span>
          </div>
        </div>

        {booking.transaction && (
          <div className={classes.info_item}>
            <div className={classes.icon_wrapper}>
              <CreditCard size={24} />
            </div>
            <div className={classes.item_content}>
              <span className={classes.label}>Total Amount</span>
              <span className={classes.price}>
                ${booking.transaction.amount}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className={classes.variant_info}>
        <span className={classes.variant_name}>
          {booking.booking_variant.apartment.name}
        </span>
        <span className={classes.variant_price}>
          ${booking.booking_variant.price} per night
        </span>
      </div>
    </div>
  );
};

const BookingSummaryShimmer = () => (
  <div className={classes.summary}>
    <Shimmer
      className={classes.shimmer_title}
      style={{ height: "32px", width: "180px", marginBottom: "24px" }}
    />

    <div className={classes.info_grid}>
      <div className={classes.info_item}>
        <Shimmer
          className={classes.shimmer_icon}
          style={{ width: "40px", height: "40px", borderRadius: "50%" }}
        />
        <div className={classes.item_content}>
          <Shimmer
            className={classes.shimmer_label}
            style={{ height: "14px", width: "80px", marginBottom: "8px" }}
          />
          <Shimmer
            className={classes.shimmer_value}
            style={{ height: "20px", width: "60px" }}
          />
        </div>
      </div>

      <div className={classes.info_item}>
        <Shimmer
          className={classes.shimmer_icon}
          style={{ width: "40px", height: "40px", borderRadius: "50%" }}
        />
        <div className={classes.item_content}>
          <Shimmer
            className={classes.shimmer_label}
            style={{ height: "14px", width: "60px", marginBottom: "8px" }}
          />
          <Shimmer
            className={classes.shimmer_value}
            style={{ height: "20px", width: "90px" }}
          />
        </div>
      </div>

      <div className={classes.info_item}>
        <Shimmer
          className={classes.shimmer_icon}
          style={{ width: "40px", height: "40px", borderRadius: "50%" }}
        />
        <div className={classes.item_content}>
          <Shimmer
            className={classes.shimmer_label}
            style={{ height: "14px", width: "120px", marginBottom: "8px" }}
          />
          <Shimmer
            className={classes.shimmer_value}
            style={{ height: "20px", width: "160px" }}
          />
          <Shimmer
            className={classes.shimmer_nights}
            style={{ height: "16px", width: "60px", marginTop: "8px" }}
          />
        </div>
      </div>

      <div className={classes.info_item}>
        <Shimmer
          className={classes.shimmer_icon}
          style={{ width: "40px", height: "40px", borderRadius: "50%" }}
        />
        <div className={classes.item_content}>
          <Shimmer
            className={classes.shimmer_label}
            style={{ height: "14px", width: "100px", marginBottom: "8px" }}
          />
          <Shimmer
            className={classes.shimmer_price}
            style={{ height: "28px", width: "80px" }}
          />
        </div>
      </div>
    </div>

    <div className={classes.variant_info}>
      <Shimmer
        className={classes.shimmer_variant_name}
        style={{ height: "20px", width: "150px" }}
      />
      <Shimmer
        className={classes.shimmer_variant_price}
        style={{ height: "20px", width: "100px" }}
      />
    </div>
  </div>
);
