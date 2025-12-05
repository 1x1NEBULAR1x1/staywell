"use client";

import type { ExtendedTransaction } from "@shared/src/types";
import { format } from "date-fns";
import classes from "./GeneralTab.module.scss";

export const GeneralTab = ({
  transaction,
}: {
  transaction: ExtendedTransaction;
}) => {
  return (
    <div className={classes.general_tab}>
      {/* Transaction Details */}
      <div className={classes.section}>
        <h3 className={classes.section_title}>Transaction Details</h3>
        <div className={classes.details_grid}>
          <div className={classes.detail_item}>
            <span className={classes.detail_label}>Transaction ID</span>
            <span className={classes.detail_value}>{transaction.id}</span>
          </div>
          <div className={classes.detail_item}>
            <span className={classes.detail_label}>Amount</span>
            <span className={classes.detail_value}>
              ${transaction.amount.toFixed(2)}
            </span>
          </div>
          <div className={classes.detail_item}>
            <span className={classes.detail_label}>Status</span>
            <span className={classes.detail_value}>
              <span
                className={`${classes.status_badge} ${classes[transaction.transaction_status.toLowerCase()]}`}
              >
                {transaction.transaction_status.toLowerCase()}
              </span>
            </span>
          </div>
          <div className={classes.detail_item}>
            <span className={classes.detail_label}>Type</span>
            <span className={classes.detail_value}>
              {transaction.transaction_type.toLowerCase().replace("_", " ")}
            </span>
          </div>
          <div className={classes.detail_item}>
            <span className={classes.detail_label}>Payment Method</span>
            <span className={classes.detail_value}>
              {transaction.payment_method.toLowerCase()}
            </span>
          </div>
          <div className={classes.detail_item}>
            <span className={classes.detail_label}>Created</span>
            <span className={classes.detail_value}>
              {format(new Date(transaction.created), "PPP p")}
            </span>
          </div>
          <div className={classes.detail_item}>
            <span className={classes.detail_label}>Updated</span>
            <span className={classes.detail_value}>
              {format(new Date(transaction.updated), "PPP p")}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      {transaction.description && (
        <div className={classes.section}>
          <h3 className={classes.section_title}>Description</h3>
          <p className={classes.description}>{transaction.description}</p>
        </div>
      )}

      {/* Related Entities */}
      {(transaction.booking || transaction.booking_event) && (
        <div className={classes.section}>
          <h3 className={classes.section_title}>Related Entities</h3>
          <div className={classes.related_entities}>
            {transaction.booking && (
              <div className={classes.entity_item}>
                <span className={classes.entity_type}>Booking</span>
                <span className={classes.entity_id}>
                  {transaction.booking.id}
                </span>
                <span className={classes.entity_status}>
                  {transaction.booking.status.toLowerCase()}
                </span>
              </div>
            )}
            {transaction.booking_event && (
              <div className={classes.entity_item}>
                <span className={classes.entity_type}>Booking Event</span>
                <span className={classes.entity_id}>
                  {transaction.booking_event.id}
                </span>
                <span className={classes.entity_status}>active</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
