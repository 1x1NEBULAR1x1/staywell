import { AxiosHeaders } from "axios";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Bookings } from "@/components/public/pages/bookings";
import { GetApi } from "@/lib/api/services/get.api";

export default async function page() {
  const cookie_store = await cookies();
  const get_api = new GetApi("BOOKING");
  if (!cookie_store.get("access_token")) return notFound();
  const response = await get_api.get(
    { take: 1000, skip: 0 },
    new AxiosHeaders({
      Authorization: `Bearer ${cookie_store.get("access_token")?.value}`,
    }),
  );
  if (!response.data) return notFound();

  return <Bookings initial_data={response.data} />;
}
