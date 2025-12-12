"use client";
import { example_booking } from "@shared/src";
import { ListPage } from "../../common/AdminPage";
import { BookingCard, BookingCardShimmer } from "./components";
import { columns_config, filters_config } from "./config";

export const Bookings = () => (
  <ListPage
    model="BOOKING"
    type="cards"
    filters_config={filters_config}
    render_item={(booking) => (
      <BookingCard key={booking.id} booking={booking} />
    )}
    shimmer_item={(key) => <BookingCardShimmer key={key} />}
    columns={columns_config}
    sort_by_list={Object.keys(example_booking)
      .filter((key) => !["transaction_id"].includes(key))
      .sort()}
  />
);
