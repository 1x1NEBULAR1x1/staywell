"use client";

import type { ExtendedTransaction } from "@shared/src/types";
import { Banknote, Building, CreditCard } from "lucide-react";
import classes from "./PaymentTab.module.scss";

export const PaymentTab = ({
  transaction,
}: {
  transaction: ExtendedTransaction;
}) => {
  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "card":
        return CreditCard;
      case "cash":
        return Banknote;
      case "transfer":
        return Building;
      default:
        return CreditCard;
    }
  };

  const getPaymentMethodDetails = () => {
    if (transaction.card_detail) {
      return {
        type: "Card Payment",
        details: `**** **** **** ${transaction.card_detail.number.slice(-4)}`,
        holder: transaction.card_detail.holder,
        provider: "Credit/Debit Card",
      };
    }

    if (transaction.transfer_detail) {
      return {
        type: "Bank Transfer",
        details: transaction.transfer_detail.account_number,
        holder: transaction.transfer_detail.payer_name,
        provider: `${transaction.transfer_detail.bank_name} (${transaction.transfer_detail.swift})`,
      };
    }

    return {
      type:
        transaction.payment_method.toLowerCase() === "cash"
          ? "Cash Payment"
          : "Other Payment Method",
      details: "No additional details available",
      holder: null,
      provider: transaction.payment_method,
    };
  };

  const paymentDetails = getPaymentMethodDetails();
  const PaymentIcon = getPaymentMethodIcon(transaction.payment_method);

  return (
    <div className={classes.payment_tab}>
      {/* Payment Method Overview */}
      <div className={classes.section}>
        <h3 className={classes.section_title}>Payment Method</h3>
        <div className={classes.payment_overview}>
          <div className={classes.payment_icon}>
            <PaymentIcon size={48} />
          </div>
          <div className={classes.payment_info}>
            <h4 className={classes.payment_type}>{paymentDetails.type}</h4>
            <p className={classes.payment_amount}>
              ${transaction.amount.toFixed(2)}
            </p>
            <span
              className={`${classes.status_badge} ${classes[transaction.transaction_status.toLowerCase()]}`}
            >
              {transaction.transaction_status.toLowerCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className={classes.section}>
        <h3 className={classes.section_title}>Payment Details</h3>
        <div className={classes.details_grid}>
          <div className={classes.detail_item}>
            <span className={classes.detail_label}>Payment Method</span>
            <span className={classes.detail_value}>
              {transaction.payment_method.toLowerCase()}
            </span>
          </div>
          <div className={classes.detail_item}>
            <span className={classes.detail_label}>Transaction Type</span>
            <span className={classes.detail_value}>
              {transaction.transaction_type.toLowerCase().replace("_", " ")}
            </span>
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
        </div>
      </div>

      {/* Payment Provider Details */}
      {(transaction.card_detail || transaction.transfer_detail) && (
        <div className={classes.section}>
          <h3 className={classes.section_title}>Payment Provider Details</h3>
          <div className={classes.provider_details}>
            <div className={classes.provider_grid}>
              <div className={classes.detail_item}>
                <span className={classes.detail_label}>Provider</span>
                <span className={classes.detail_value}>
                  {paymentDetails.provider}
                </span>
              </div>
              <div className={classes.detail_item}>
                <span className={classes.detail_label}>Details</span>
                <span className={classes.detail_value}>
                  {paymentDetails.details}
                </span>
              </div>
              {paymentDetails.holder && (
                <div className={classes.detail_item}>
                  <span className={classes.detail_label}>Account Holder</span>
                  <span className={classes.detail_value}>
                    {paymentDetails.holder}
                  </span>
                </div>
              )}
              {transaction.card_detail && (
                <div className={classes.detail_item}>
                  <span className={classes.detail_label}>Expiry Date</span>
                  <span className={classes.detail_value}>
                    {transaction.card_detail.expiry_month
                      .toString()
                      .padStart(2, "0")}
                    /{transaction.card_detail.expiry_year}
                  </span>
                </div>
              )}
              {transaction.transfer_detail && (
                <>
                  <div className={classes.detail_item}>
                    <span className={classes.detail_label}>SWIFT Code</span>
                    <span className={classes.detail_value}>
                      {transaction.transfer_detail.swift}
                    </span>
                  </div>
                  <div className={classes.detail_item}>
                    <span className={classes.detail_label}>Bank Name</span>
                    <span className={classes.detail_value}>
                      {transaction.transfer_detail.bank_name}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className={classes.section}>
        <div className={classes.security_notice}>
          <h4 className={classes.notice_title}>Security Information</h4>
          <p className={classes.notice_text}>
            Payment information is securely processed and stored in compliance
            with PCI DSS standards. Sensitive payment details are tokenized and
            encrypted.
          </p>
        </div>
      </div>
    </div>
  );
};
