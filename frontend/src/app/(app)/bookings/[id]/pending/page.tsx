import { AxiosHeaders } from "axios";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Pending } from "@/components/public/pages/bookings/[id]/pending";
import { GetApi } from "@/lib/api/services/get.api";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const get_api = new GetApi("BOOKING");
  const cookie_store = await cookies();
  if (!cookie_store.get("access_token")) return notFound();
  const response = await get_api.find(
    id,
    new AxiosHeaders({
      Authorization: `Bearer ${cookie_store.get("access_token")?.value}`,
    }),
  );
  if (!response.data) return notFound();

  return <Pending booking_id={id} initial_data={response.data} />;
}
