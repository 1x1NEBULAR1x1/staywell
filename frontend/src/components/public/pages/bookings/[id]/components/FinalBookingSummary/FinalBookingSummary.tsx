"use client";
import type { ExtendedBooking } from "@shared/src";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  CreditCard,
  Hash,
  MapPin,
  Receipt,
  User,
} from "lucide-react";
import { useId } from "react";
import { Shimmer } from "@/components/styles/ui";
import classes from "./FinalBookingSummary.module.scss";

export const FinalBookingSummary = ({
  booking,
  nights,
}: {
  booking?: ExtendedBooking;
  nights?: number;
}) => {
  const eventsTotal =
    booking?.booking_events?.reduce(
      (total, event) => total + event.event.price,
      0,
    ) || 0;
  const optionsTotal =
    booking?.booking_additional_options?.reduce(
      (total, option) => total + option.additional_option.price,
      0,
    ) || 0;
  const apartmentTotal = (booking?.booking_variant.price ?? 0) * (nights ?? 0);
  const totalAmount = apartmentTotal + eventsTotal + optionsTotal;

  return !booking ? (
    <FinalBookingSummaryShimmer />
  ) : (
    <div className={classes.final_summary}>
      <h3 className={classes.title}>Booking Summary</h3>

      <div className={classes.summary_grid}>
        {/* Booking Details */}
        <div className={classes.details_section}>
          <h4 className={classes.section_title}>Booking Details</h4>

          <div className={classes.details_grid}>
            <div className={classes.detail_item}>
              <Hash size={16} />
              <div>
                <span className={classes.label}>Booking ID</span>
                <span className={classes.value}>#{booking.id}</span>
              </div>
            </div>

            <div className={classes.detail_item}>
              <User size={16} />
              <div>
                <span className={classes.label}>Guest</span>
                <span className={classes.value}>
                  {booking.user.first_name} {booking.user.last_name}
                </span>
              </div>
            </div>

            <div className={classes.detail_item}>
              <MapPin size={16} />
              <div>
                <span className={classes.label}>Apartment</span>
                <span className={classes.value}>
                  {booking.booking_variant.apartment.name}
                </span>
              </div>
            </div>

            <div className={classes.detail_item}>
              <Calendar size={16} />
              <div>
                <span className={classes.label}>Check-in</span>
                <span className={classes.value}>
                  {format(new Date(booking.start), "dd MMMM yyyy")}
                </span>
              </div>
            </div>

            <div className={classes.detail_item}>
              <Calendar size={16} />
              <div>
                <span className={classes.label}>Check-out</span>
                <span className={classes.value}>
                  {format(new Date(booking.end), "dd MMMM yyyy")}
                </span>
              </div>
            </div>

            <div className={classes.detail_item}>
              <Clock size={16} />
              <div>
                <span className={classes.label}>Duration</span>
                <span className={classes.value}>{nights} nights</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className={classes.transaction_section}>
          <h4 className={classes.section_title}>Transaction Details</h4>

          {booking.transaction ? (
            <div className={classes.transaction_info}>
              <div className={classes.transaction_item}>
                <Receipt size={16} />
                <div>
                  <span className={classes.label}>Transaction ID</span>
                  <span className={classes.value}>
                    #{booking.transaction.id}
                  </span>
                </div>
              </div>

              <div className={classes.transaction_item}>
                <CreditCard size={16} />
                <div>
                  <span className={classes.label}>Payment Method</span>
                  <span className={classes.value}>
                    {booking.transaction.payment_method || "Credit Card"}
                  </span>
                </div>
              </div>

              <div className={classes.transaction_item}>
                <Clock size={16} />
                <div>
                  <span className={classes.label}>Transaction Date</span>
                  <span className={classes.value}>
                    {format(
                      new Date(booking.transaction.created),
                      "dd MMMM yyyy",
                    )}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className={classes.no_transaction}>
              <span>No transaction information available</span>
            </div>
          )}
        </div>

        {/* Cost Breakdown */}
        <div className={classes.cost_section}>
          <h4 className={classes.section_title}>Cost Breakdown</h4>

          <div className={classes.cost_breakdown}>
            <div className={classes.cost_item}>
              <span className={classes.cost_label}>
                Apartment ({nights} nights × ${booking.booking_variant.price})
              </span>
              <span className={classes.cost_value}>
                ${apartmentTotal.toFixed(2)}
              </span>
            </div>

            {eventsTotal > 0 && (
              <div className={classes.cost_item}>
                <span className={classes.cost_label}>
                  Events ({booking.booking_events?.length || 0} items)
                </span>
                <span className={classes.cost_value}>
                  ${eventsTotal.toFixed(2)}
                </span>
              </div>
            )}

            {optionsTotal > 0 && (
              <div className={classes.cost_item}>
                <span className={classes.cost_label}>
                  Additional Options (
                  {booking.booking_additional_options?.length || 0} items)
                </span>
                <span className={classes.cost_value}>
                  ${optionsTotal.toFixed(2)}
                </span>
              </div>
            )}

            <div className={`${classes.cost_item} ${classes.total}`}>
              <span className={classes.cost_label}>Total Amount</span>
              <span className={classes.cost_value}>
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Meta Information */}
        <div className={classes.meta_section}>
          <h4 className={classes.section_title}>Booking Information</h4>

          <div className={classes.meta_info}>
            <div className={classes.meta_item}>
              <span className={classes.label}>Created</span>
              <span className={classes.value}>
                {format(new Date(booking.created), "dd MMMM yyyy")}
              </span>
            </div>

            <div className={classes.meta_item}>
              <span className={classes.label}>Last Updated</span>
              <span className={classes.value}>
                {format(new Date(booking.updated), "dd MMMM yyyy")}
              </span>
            </div>

            <div className={classes.meta_item}>
              <span className={classes.label}>Status</span>
              <span
                className={`${classes.value} ${classes.status_badge}`}
                data-status={booking.status}
              >
                {booking.status.charAt(0).toUpperCase() +
                  booking.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FinalBookingSummaryShimmer = () => {
  const id = useId();
  return (
    <div className={classes.final_summary}>
      <Shimmer
        className={classes.shimmer_title}
        style={{ height: "40px", width: "250px", marginBottom: "32px" }}
      />

      <div className={classes.summary_grid}>
        {/* Booking Details Section */}
        <div className={classes.details_section}>
          <Shimmer
            className={classes.shimmer_section_title}
            style={{ height: "20px", width: "140px", marginBottom: "24px" }}
          />

          <div className={classes.details_grid}>
            {Array.from({ length: 6 }).map((_) => (
              <div key={`${id}`} className={classes.detail_item}>
                <Shimmer
                  className={classes.shimmer_icon}
                  style={{ width: "16px", height: "16px", borderRadius: "50%" }}
                />
                <div>
                  <Shimmer
                    className={classes.shimmer_label}
                    style={{
                      height: "14px",
                      width: "80px",
                      marginBottom: "8px",
                    }}
                  />
                  <Shimmer
                    className={classes.shimmer_value}
                    style={{ height: "18px", width: "120px" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction Details Section */}
        <div className={classes.transaction_section}>
          <Shimmer
            className={classes.shimmer_section_title}
            style={{ height: "20px", width: "160px", marginBottom: "24px" }}
          />

          <div className={classes.transaction_info}>
            {Array.from({ length: 3 }).map((_) => (
              <div key={`${id}`} className={classes.transaction_item}>
                <Shimmer
                  className={classes.shimmer_icon}
                  style={{ width: "16px", height: "16px", borderRadius: "50%" }}
                />
                <div>
                  <Shimmer
                    className={classes.shimmer_label}
                    style={{
                      height: "14px",
                      width: "100px",
                      marginBottom: "8px",
                    }}
                  />
                  <Shimmer
                    className={classes.shimmer_value}
                    style={{ height: "18px", width: "140px" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Breakdown Section */}
        <div className={classes.cost_section}>
          <Shimmer
            className={classes.shimmer_section_title}
            style={{ height: "20px", width: "130px", marginBottom: "24px" }}
          />

          <div className={classes.cost_breakdown}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`${id}`}
                className={`${classes.cost_item} ${index === 3 ? classes.total : ""}`}
              >
                <Shimmer
                  className={classes.shimmer_cost_label}
                  style={{
                    height: "18px",
                    width: index === 3 ? "120px" : "200px",
                  }}
                />
                <Shimmer
                  className={classes.shimmer_cost_value}
                  style={{
                    height: "18px",
                    width: index === 3 ? "80px" : "60px",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Meta Information Section */}
        <div className={classes.meta_section}>
          <Shimmer
            className={classes.shimmer_section_title}
            style={{ height: "20px", width: "180px", marginBottom: "24px" }}
          />

          <div className={classes.meta_info}>
            {Array.from({ length: 3 }).map((_) => (
              <div key={`${id}`} className={classes.meta_item}>
                <Shimmer
                  className={classes.shimmer_label}
                  style={{ height: "14px", width: "70px" }}
                />
                <Shimmer
                  className={classes.shimmer_value}
                  style={{ height: "18px", width: "140px" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
