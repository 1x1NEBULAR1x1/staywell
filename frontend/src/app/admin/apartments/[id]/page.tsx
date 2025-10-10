import { Apartment } from '@/components/admin/pages/apartments/[id]';
import { GetApi } from '@/lib/api/services/get.api';
import { notFound } from 'next/navigation';

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const getApi = new GetApi('APARTMENT');
  const response = await getApi.find(id);
  if (!response.data) notFound();
  return (<Apartment id={id} initial_data={response.data} />);
}