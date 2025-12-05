import { Home } from "@/components/public/pages/home/Home";
import { GetApi } from "@/lib/api/services/get.api";

export default async function page() {
  const get_api = new GetApi("APARTMENT");
  const response = await get_api.get({ take: 12, is_available: true, skip: 0 });
  return <Home initial_data={response.data} />;
}
