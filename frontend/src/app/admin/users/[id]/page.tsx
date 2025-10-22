import { User } from "@/components/admin/pages/users/[id]/User";
import { notFound } from "next/navigation";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) notFound();
  return <User id={id} />
}