import { Events } from "@/components/public/pages/events/Events";
import { GetApi } from "@/lib/api";

export default async function page() {
  const api = new GetApi("EVENT");
  const response = await api.get({
    take: 12,
    skip: 0,
    min_start: new Date(Date.now()).toISOString() as unknown as Date,
  });
  return <Events initial_data={response.data} />;
}
