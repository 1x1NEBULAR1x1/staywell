import { Layout } from '@/components/public/common/Layout';

export default async function layout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>
}