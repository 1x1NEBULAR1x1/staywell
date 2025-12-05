"use client";
import { AdminPage } from "@/components/admin/common/AdminPage";
import { useModel } from "@/hooks/admin/queries/useModel";
import { BookingData } from "./components";

export const Booking = ({ id }: { id: string }) => {
  const { data: booking, refetch } = useModel("BOOKING").find(id);
  if (!booking) return null;

  return (
    <AdminPage title="Booking Details">
      <BookingData booking={booking} refetch={refetch} />
    </AdminPage>
  );
};
