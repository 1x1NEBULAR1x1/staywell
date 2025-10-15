import { AccountProvider } from '@/components/common/providers';
import { Header, Footer } from './components';
import { ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode;
}

export const Layout = async ({ children }: LayoutProps) => (
  <AccountProvider>
    <Header />
    {children}
    <Footer />
  </AccountProvider>
);