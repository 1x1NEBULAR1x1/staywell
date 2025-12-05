import type { UserWithoutPassword } from "@shared/src/types/users-section/extended.types";
import { AxiosHeaders } from "axios";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Layout } from "@/components/public/common/Layout";
import { UsersApi } from "@/lib/api/services/users.api";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookie_store = await cookies();
  const access_token = cookie_store.get("access_token")?.value;
  const user: UserWithoutPassword | null = access_token
    ? await (async () => {
        try {
          const get_api = new UsersApi();
          const response = await get_api.me(
            new AxiosHeaders({ Authorization: `Bearer ${access_token}` }),
          );
          if (!response.data) return notFound();
          return response.data;
        } catch (_error) {
          return null;
        }
      })()
    : null;

  return <Layout initial_data={user}>{children}</Layout>;
}
