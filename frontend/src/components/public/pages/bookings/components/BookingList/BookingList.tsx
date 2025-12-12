"use client";
import type { ExtendedBooking } from "@shared/src";
import { format } from "date-fns";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  MapPin,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import no_image from "@/../public/common/no-image.jpeg";
import { getImageUrl } from "@/lib/api/utils/image-url";
import classes from "./BookingList.module.scss";

export const BookingList = ({ bookings }: { bookings: ExtendedBooking[] }) => {
  if (bookings.length === 0) {
    return (
      <div className={classes.empty_state}>
        <Calendar size={64} />
        <h3>No Bookings Yet</h3>
        <p>
          You haven't made any bookings yet. Start exploring our apartments!
        </p>
        <Link href="/apartments" className={classes.explore_button}>
          Explore Apartments
        </Link>
      </div>
    );
  }

  const active_bookings = bookings.filter((b) => b.status === "CONFIRMED");
  const other_bookings = bookings.filter((b) => b.status !== "CONFIRMED");

  const renderBookingCard = (
    booking: ExtendedBooking,
    is_active: boolean = false,
  ) => {
    const start_date = booking.start ? new Date(booking.start) : null;
    const end_date = booking.end ? new Date(booking.end) : null;
    const nights =
      start_date && end_date
        ? Math.ceil(
            (end_date.getTime() - start_date.getTime()) / (1000 * 60 * 60 * 24),
          )
        : 0;

    const status_config = {
      CONFIRMED: { icon: CheckCircle2, color: "confirmed", label: "Confirmed" },
      PENDING: {
        icon: AlertCircle,
        color: "pending",
        label: "Pending Payment",
      },
      CANCELLED: { icon: XCircle, color: "cancelled", label: "Cancelled" },
      COMPLETED: { icon: CheckCircle2, color: "completed", label: "Completed" },
    };

    const status_info = status_config[booking.status] || status_config.PENDING;
    const StatusIcon = status_info.icon;

    const total_price = useMemo(() => {
      const booking_price =
        booking.booking_variant.apartment.deposit +
        booking.booking_variant.price * nights;
      const options_price = booking.booking_additional_options.reduce(
        (total, option) =>
          total + option.additional_option.price * option.amount,
        0,
      );
      const events_price = booking.booking_events.reduce(
        (total, event) => total + event.event.price * event.number_of_people,
        0,
      );
      return booking_price + options_price + events_price;
    }, [
      booking.booking_variant.apartment.deposit,
      booking.booking_variant.price,
      nights,
      booking.booking_additional_options,
      booking.booking_events,
    ]);

    return (
      <Link
        key={booking.id}
        href={`/bookings/${booking.id}`}
        className={`${classes.booking_card} ${is_active ? classes.active_card : ""}`}
      >
        {/* Left side - Image */}
        <div className={classes.card_image}>
          <Image
            src={
              getImageUrl(booking.booking_variant.apartment.image) ??
              no_image.src
            }
            alt={booking.booking_variant.apartment.name ?? ""}
            fill
            sizes="240px"
            style={{ objectFit: "cover" }}
          />
          {is_active && (
            <div className={classes.active_badge}>
              <CheckCircle2 size={16} />
              Active
            </div>
          )}
        </div>

        {/* Middle - Main Info */}
        <div className={classes.card_content}>
          <div className={classes.card_header}>
            <div>
              <h3 className={classes.apartment_name}>
                {booking.booking_variant.apartment.name}
              </h3>
              <div className={classes.booking_number}>
                Booking #{booking.id.split("-")[0]}
              </div>
            </div>
            <div
              className={`${classes.status_badge} ${classes[status_info.color]}`}
            >
              <StatusIcon size={16} />
              {status_info.label}
            </div>
          </div>

          <div className={classes.booking_details}>
            {start_date && end_date && (
              <div className={classes.detail_item}>
                <Calendar size={18} />
                <span>
                  {format(start_date, "MMM dd")} -{" "}
                  {format(end_date, "MMM dd, yyyy")} · {nights}{" "}
                  {nights === 1 ? "night" : "nights"}
                </span>
              </div>
            )}

            <div className={classes.detail_item}>
              <MapPin size={18} />
              <span>
                Floor {booking.booking_variant.apartment.floor}, Room{" "}
                {booking.booking_variant.apartment.number}
              </span>
            </div>

            {booking.booking_additional_options &&
              booking.booking_additional_options.length > 0 && (
                <div className={classes.detail_item}>
                  <Clock size={18} />
                  <span>
                    {booking.booking_additional_options.length} additional{" "}
                    {booking.booking_additional_options.length === 1
                      ? "option"
                      : "options"}
                  </span>
                </div>
              )}
          </div>
        </div>

        {/* Right side - Price & Action */}
        <div className={classes.card_actions}>
          {total_price !== undefined && (
            <div className={classes.price_section}>
              <div className={classes.price_label}>Total Price</div>
              <div className={classes.price_amount}>
                <DollarSign size={20} />
                {total_price.toFixed(2)}
              </div>
            </div>
          )}
          <div className={classes.view_details}>
            View Details
            <ChevronRight size={20} />
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className={classes.booking_list}>
      {active_bookings.length > 0 && (
        <section className={classes.section}>
          <div className={classes.section_header}>
            <h2>Active Bookings</h2>
            <span className={classes.count_badge}>
              {active_bookings.length}
            </span>
          </div>
          <div className={classes.cards_container}>
            {active_bookings.map((booking) => renderBookingCard(booking, true))}
          </div>
        </section>
      )}

      {other_bookings.length > 0 && (
        <section className={classes.section}>
          <div className={classes.section_header}>
            <h2>All Bookings</h2>
            <span className={classes.count_badge}>{other_bookings.length}</span>
          </div>
          <div className={classes.cards_container}>
            {other_bookings.map((booking) => renderBookingCard(booking))}
          </div>
        </section>
      )}
    </div>
  );
};
