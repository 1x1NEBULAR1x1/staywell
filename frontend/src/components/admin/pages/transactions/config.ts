import {
  type Transaction,
  TransactionStatus,
  TransactionType,
} from "@shared/src/database";
import type {
  ColumnConfig,
  FiltersConfig,
} from "@/components/admin/common/AdminPage/ListPage";

export const columns: ColumnConfig<keyof Transaction>[] = [
  { label: "Type", field: "transaction_type" },
  { label: "Status", field: "transaction_status" },
  { label: "Amount", field: "amount" },
  { label: "Created", field: "created" },
];

export const filters_config: FiltersConfig = {
  type: {
    type: "enum",
    options: Object.values(TransactionType),
    placeholder: "All Types",
    label: "Type",
  },
  status: {
    type: "enum",
    options: Object.values(TransactionStatus),
    placeholder: "All Statuses",
    label: "Status",
  },
  amount: {
    type: "number",
    placeholder: "Enter amount",
    label: "Amount",
  },
  created: {
    type: "date",
    placeholder: "Enter created date",
    label: "Created",
  },
};
