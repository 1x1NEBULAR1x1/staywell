"use client";

import type { ExtendedTransaction } from "@shared/src/types";
import { format } from "date-fns";
import Image from "next/image";
import no_image from "@/../public/common/no-image.jpeg";
import classes from "./BookingTab.module.scss";

export const BookingTab = ({
  transaction,
}: {
  transaction: ExtendedTransaction;
}) => {
  if (!transaction.booking && !transaction.booking_event) {
    return (
      <div className={classes.booking_tab}>
        <div className={classes.empty_state}>
          <h3 className={classes.empty_title}>No Booking Associated</h3>
          <p className={classes.empty_description}>
            This transaction is not associated with any booking or booking
            event.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.booking_tab}>
      {/* Booking Information */}
      {transaction.booking && (
        <div className={classes.section}>
          <h3 className={classes.section_title}>Booking Details</h3>

          <div className={classes.booking_card}>
            <div className={classes.booking_header}>
              <div className={classes.apartment_info}>
                <Image
                  src={
                    transaction.booking.booking_variant.apartment.image ||
                    no_image.src
                  }
                  alt={
                    transaction.booking.booking_variant.apartment.name ||
                    "Apartment"
                  }
                  width={60}
                  height={60}
                  className={classes.apartment_image}
                />
                <div className={classes.apartment_details}>
                  <h4 className={classes.apartment_name}>
                    {transaction.booking.booking_variant.apartment.name ||
                      `Room ${transaction.booking.booking_variant.apartment.number}`}
                  </h4>
                  <p className={classes.apartment_location}>
                    Floor {transaction.booking.booking_variant.apartment.floor},
                    Room {transaction.booking.booking_variant.apartment.number}
                  </p>
                </div>
              </div>
              <span
                className={`${classes.status_badge} ${classes[transaction.booking.status.toLowerCase()]}`}
              >
                {transaction.booking.status.toLowerCase()}
              </span>
            </div>

            <div className={classes.booking_details}>
              <div className={classes.detail_grid}>
                <div className={classes.detail_item}>
                  <span className={classes.detail_label}>Booking ID</span>
                  <span className={classes.detail_value}>
                    {transaction.booking.id}
                  </span>
                </div>
                <div className={classes.detail_item}>
                  <span className={classes.detail_label}>Check-in</span>
                  <span className={classes.detail_value}>
                    {format(new Date(transaction.booking.start), "PPP")}
                  </span>
                </div>
                <div className={classes.detail_item}>
                  <span className={classes.detail_label}>Check-out</span>
                  <span className={classes.detail_value}>
                    {format(new Date(transaction.booking.end), "PPP")}
                  </span>
                </div>
                <div className={classes.detail_item}>
                  <span className={classes.detail_label}>Guests</span>
                  <span className={classes.detail_value}>
                    {transaction.booking.booking_variant.capacity}
                  </span>
                </div>
                <div className={classes.detail_item}>
                  <span className={classes.detail_label}>Price per night</span>
                  <span className={classes.detail_value}>
                    ${transaction.booking.booking_variant.price.toFixed(2)}
                  </span>
                </div>
                <div className={classes.detail_item}>
                  <span className={classes.detail_label}>Total Amount</span>
                  <span className={classes.detail_value}>
                    ${transaction.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {transaction.booking.message && (
              <div className={classes.booking_message}>
                <h5 className={classes.message_title}>Special Request</h5>
                <p className={classes.message_text}>
                  {transaction.booking.message}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booking Event Information */}
      {transaction.booking_event && (
        <div className={classes.section}>
          <h3 className={classes.section_title}>Event Booking Details</h3>

          <div className={classes.event_card}>
            <div className={classes.event_header}>
              <div className={classes.event_info}>
                <Image
                  src={transaction.booking_event.event.image || no_image.src}
                  alt={transaction.booking_event.event.name}
                  width={60}
                  height={60}
                  className={classes.event_image}
                />
                <div className={classes.event_details}>
                  <h4 className={classes.event_name}>
                    {transaction.booking_event.event.name}
                  </h4>
                  <p className={classes.event_description}>
                    {transaction.booking_event.event.description}
                  </p>
                </div>
              </div>
            </div>

            <div className={classes.event_details_grid}>
              <div className={classes.detail_item}>
                <span className={classes.detail_label}>Event ID</span>
                <span className={classes.detail_value}>
                  {transaction.booking_event.event.id}
                </span>
              </div>
              <div className={classes.detail_item}>
                <span className={classes.detail_label}>Start Date</span>
                <span className={classes.detail_value}>
                  {format(
                    new Date(transaction.booking_event.event.start),
                    "PPP p",
                  )}
                </span>
              </div>
              <div className={classes.detail_item}>
                <span className={classes.detail_label}>End Date</span>
                <span className={classes.detail_value}>
                  {format(
                    new Date(transaction.booking_event.event.end),
                    "PPP p",
                  )}
                </span>
              </div>
              <div className={classes.detail_item}>
                <span className={classes.detail_label}>Number of People</span>
                <span className={classes.detail_value}>
                  {transaction.booking_event.number_of_people}
                </span>
              </div>
              <div className={classes.detail_item}>
                <span className={classes.detail_label}>Capacity</span>
                <span className={classes.detail_value}>
                  {transaction.booking_event.event.capacity}
                </span>
              </div>
              <div className={classes.detail_item}>
                <span className={classes.detail_label}>Price</span>
                <span className={classes.detail_value}>
                  ${transaction.booking_event.event.price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
