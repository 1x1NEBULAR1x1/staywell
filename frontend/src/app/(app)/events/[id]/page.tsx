import { notFound } from "next/navigation";
import { Event } from "@/components/public/pages/events/[id]";
import { GetApi } from "@/lib/api";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) return notFound();
  const api = new GetApi("EVENT");
  const initial_data = (await api.find(id)).data;
  return <Event initial_data={initial_data} />;
}
