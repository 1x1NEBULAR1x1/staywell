import { type Booking, BookingStatus } from "@shared/src";
import type { ColumnConfig, FiltersConfig } from "../../common/AdminPage";

export const columns_config: ColumnConfig<keyof Booking>[] = [
  { label: "Apartment", field: "booking_variant_id" },
  { label: "User", field: "user_id" },
  { label: "Status", field: "status" },
  { label: "Start", field: "start" },
  { label: "End", field: "end" },
  { label: "Created", field: "created" },
];

export const filters_config: FiltersConfig = {
  status: {
    type: "enum",
    options: Object.values(BookingStatus),
    placeholder: "All Statuses",
  },
  min_start: {
    type: "date",
    label: "Start Date From",
  },
  max_start: {
    type: "date",
    label: "Start Date To",
  },
  min_end: {
    type: "date",
    label: "End Date From",
  },
  max_end: {
    type: "date",
    label: "End Date To",
  },
};
