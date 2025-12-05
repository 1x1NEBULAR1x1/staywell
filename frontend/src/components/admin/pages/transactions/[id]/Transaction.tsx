"use client";

import type { ExtendedTransaction } from "@shared/src/types";
import { useState } from "react";
import { AdminPage } from "@/components/admin/common/AdminPage";
import { useModel } from "@/hooks/admin/queries/useModel";
import { usePId } from "@/hooks/common/useId";
import {
  BookingTab,
  GeneralTab,
  PaymentTab,
  TransactionSidebar,
  UserTab,
} from "./components";
import classes from "./Transaction.module.scss";

export type TransactionTab = "general" | "user" | "booking" | "payment";

export const Transaction = () => {
  const { data: transaction } = useModel("TRANSACTION").find(usePId());
  const [activeTab, setActiveTab] = useState<TransactionTab>("general");

  const renderTabContent = (transaction: ExtendedTransaction) => {
    switch (activeTab) {
      case "general":
        return <GeneralTab transaction={transaction} />;
      case "user":
        return <UserTab transaction={transaction} />;
      case "booking":
        return <BookingTab transaction={transaction} />;
      case "payment":
        return <PaymentTab transaction={transaction} />;
      default:
        return null;
    }
  };

  return (
    !!transaction && (
      <AdminPage
        title={`Transaction ${transaction.id} - ${transaction.transaction_status}`}
      >
        <div className={classes.transaction_page}>
          <TransactionSidebar
            transaction={transaction}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <div className={classes.content}>{renderTabContent(transaction)}</div>
        </div>
      </AdminPage>
    )
  );
};
