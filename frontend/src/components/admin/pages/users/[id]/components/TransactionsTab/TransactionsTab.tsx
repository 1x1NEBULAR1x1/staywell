"use client";

import { useModelFilters } from "@/hooks/admin/actions/useModelFilters";
import { useModel } from "@/hooks/admin/queries/useModel";
import classes from "../Tab.module.scss";
import { TransactionsFiltersMenu, TransactionsList } from "./components";

export const TransactionsTab = ({ user_id }: { user_id: string }) => {
  const { filters, setFilters } = useModelFilters({
    model: "TRANSACTION",
    permanent_fields: { user_id },
  });

  const { data: transactions } = useModel("TRANSACTION").get(filters);
  return (
    <div className={classes.tab}>
      <h2 className={classes.title}>Transaction History</h2>
      <div className={classes.section}>
        <div className={classes.header}>
          <h3 className={classes.title}>Transactions History</h3>
          <TransactionsFiltersMenu filters={filters} setFilters={setFilters} />
        </div>

        <TransactionsList transactions={transactions?.items || []} />
      </div>
    </div>
  );
};
