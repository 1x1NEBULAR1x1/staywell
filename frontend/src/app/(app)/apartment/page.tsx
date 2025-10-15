import { Apartment } from "@/components/public/pages/apartment/[id]";
import { GetApi } from "@/lib/api/services/get.api";
import { notFound } from "next/navigation";

export default async function page({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  if (!id) notFound();

  const get_api = new GetApi('APARTMENT');
  const response = await get_api.find(id);
  if (!response.data) notFound();

  return (
    <Apartment id={id} initial_data={response.data} />
  );
}
