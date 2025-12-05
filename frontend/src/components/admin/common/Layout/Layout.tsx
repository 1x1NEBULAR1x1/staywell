import { Role } from "@shared/src/database";
import type { ReactNode } from "react";
import { AccountProvider } from "@/components/common/providers";
import { ToastProvider } from "@/components/common/providers/ToastProvider";
import { RoleGuard } from "../RoleGuard";
import { Header, Sidebar } from "./components";
import classes from "./Layout.module.scss";

export const Layout = ({ children }: { children: ReactNode }) => (
  <AccountProvider>
    <ToastProvider>
      <RoleGuard redirect_to="/auth/login" required_roles={[Role.ADMIN]}>
        <div className={classes.layout}>
          <Sidebar />
          <div className={classes.content}>
            <Header />
            {children}
          </div>
        </div>
      </RoleGuard>
    </ToastProvider>
  </AccountProvider>
);
