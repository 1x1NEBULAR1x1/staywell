"use client";

import { example_transaction } from "@shared/src";
import { ListPage } from "@/components/admin/common/AdminPage";
import { TransactionCard, TransactionCardShimmer } from "./components";
import { columns, filters_config } from "./config";

export const Transactions = () => (
  <ListPage
    model="TRANSACTION"
    filters_config={filters_config}
    render_item={(transaction) => (
      <TransactionCard key={transaction.id} transaction={transaction} />
    )}
    shimmer_item={(key) => <TransactionCardShimmer key={key} />}
    columns={columns}
    sort_by_list={Object.keys(example_transaction)
      .filter((key) => !["image", "rules"].includes(key))
      .sort()}
  />
);
