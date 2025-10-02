import { Layout } from "@/components/admin/common/Layout/Layout";


export default async function layout({ children }: { children: React.ReactNode }) {
  return (
    <Layout>{children}</Layout>
  );
}