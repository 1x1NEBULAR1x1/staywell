import type { UserWithoutPassword } from "@shared/src/types/users-section/extended.types";
import type { ReactNode } from "react";
import { AccountProvider } from "@/components/common/providers";
import { Footer, Header } from "./components";

type LayoutProps = {
  children: ReactNode;
  initial_data: UserWithoutPassword | null;
};

export const Layout = async ({ children, initial_data }: LayoutProps) => (
  <AccountProvider initial_data={initial_data}>
    <Header />
    {children}
    <Footer />
  </AccountProvider>
);
