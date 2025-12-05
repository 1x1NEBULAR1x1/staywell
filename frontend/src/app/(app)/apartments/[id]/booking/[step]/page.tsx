import { notFound } from "next/navigation";
import { Booking } from "@/components/public/pages/apartments/[id]/booking";
import { isBookingStep } from "@/components/public/pages/apartments/[id]/booking/config";
import { GetApi } from "@/lib/api/services/get.api";

export default async function page({
  params,
}: {
  params: Promise<{ id: string; step: string }>;
}) {
  const { id, step } = await params;

  if (!id || !step) return notFound();

  if (!isBookingStep(step)) return notFound();

  const get_api = new GetApi("APARTMENT");
  try {
    const response = await get_api.find(id);
    if (!response.data) return notFound();
    return <Booking id={id} initial_data={response.data} current_step={step} />;
  } catch (error) {
    console.error(error);
    return notFound();
  }
}
