"use client";

import type { ExtendedTransaction } from "@shared/src";
import { format } from "date-fns";
import { Calendar, CreditCard, User } from "lucide-react";
import type { TransactionTab } from "../../Transaction";
import classes from "./TransactionSidebar.module.scss";

interface TransactionSidebarProps {
  transaction: ExtendedTransaction;
  activeTab: TransactionTab;
  setActiveTab: (tab: TransactionTab) => void;
}

const navItems = [
  { id: "general", label: "General Info", icon: CreditCard },
  { id: "user", label: "User", icon: User },
  { id: "booking", label: "Booking", icon: Calendar },
] as const;

export const TransactionSidebar = ({
  transaction,
  activeTab,
  setActiveTab,
}: TransactionSidebarProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "#10b981"; // green
      case "pending":
        return "#f59e0b"; // yellow
      case "failed":
        return "#ef4444"; // red
      case "canceled":
        return "#ef4444"; // red
      default:
        return "#6b7280"; // gray
    }
  };

  return (
    <div className={classes.sidebar}>
      <div className={classes.transaction_info}>
        <div className={classes.header}>
          <div className={classes.amount_section}>
            <h2 className={classes.amount}>${transaction.amount.toFixed(2)}</h2>
            <span
              className={classes.status_badge}
              style={{
                backgroundColor: getStatusColor(transaction.transaction_status),
              }}
            >
              {transaction.transaction_status.toLowerCase()}
            </span>
          </div>

          <div className={classes.transaction_details}>
            <p className={classes.transaction_type}>
              {transaction.transaction_type.toLowerCase().replace("_", " ")}
            </p>
            <p className={classes.payment_method}>
              {transaction.payment_method.toLowerCase()}
            </p>
          </div>
        </div>

        <div className={classes.info_grid}>
          <div className={classes.info_item}>
            <span className={classes.info_label}>Transaction ID</span>
            <span className={classes.info_value}>
              {transaction.id.slice(0, 8)}...
            </span>
          </div>
          <div className={classes.info_item}>
            <span className={classes.info_label}>Created</span>
            <span className={classes.info_value}>
              {format(new Date(transaction.created), "MMM dd, yyyy")}
            </span>
          </div>
          <div className={classes.info_item}>
            <span className={classes.info_label}>Type</span>
            <span className={classes.info_value}>
              {transaction.transaction_type}
            </span>
          </div>
          <div className={classes.info_item}>
            <span className={classes.info_label}>Method</span>
            <span className={classes.info_value}>
              {transaction.payment_method}
            </span>
          </div>
        </div>
      </div>

      <nav className={classes.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              type="button"
              key={item.id}
              className={`${classes.nav_button} ${activeTab === item.id ? classes.active : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className={classes.nav_icon} />
              <span className={classes.nav_label}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
