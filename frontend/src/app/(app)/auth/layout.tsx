import { AccountProvider } from '@/components/common/providers/AccountContext'


export default async function layout({ children }: { children: React.ReactNode }) {
  return (
    <AccountProvider>
      {children}
    </AccountProvider>
  );
}