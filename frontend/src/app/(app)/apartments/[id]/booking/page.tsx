import { notFound, redirect } from "next/navigation";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) notFound();
  // Redirect to the first step of the booking process
  return redirect(`/apartments/${id}/booking/0`);
}