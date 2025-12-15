"use client";

import type { Role } from "@shared/src/database";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useAccount } from "@/components/common/providers/AccountContext";
import classes from "./RoleGuard.module.scss";

interface RoleGuardProps {
  children: ReactNode;
  required_roles: Role[];
  redirect_to?: string;
  fallback?: ReactNode;
  require_auth?: boolean;
}

/**
 * Check if current page is authentication page
 */
const isAuthPage = (pathname: string): boolean => {
  // Check if path contains /auth
  return pathname.includes("/auth");
};

/**
 * Component for checking user roles
 * @param children - Child components shown when access is granted
 * @param required_role - Required role or array of roles
 * @param redirect_to - Path to redirect when access is denied
 * @param fallback - Component to display when access is denied (instead of redirect)
 * @param require_auth - Whether authentication is required (default true)
 */
export const RoleGuard = ({
  children,
  required_roles,
  redirect_to = "/auth/login",
  fallback,
  require_auth = true,
}: RoleGuardProps) => {
  const { user, is_loading, is_authenticated } = useAccount();
  const router = useRouter();
  const pathname = usePathname();

  // If on auth page, just render children without checks
  const isOnAuthPage = isAuthPage(pathname);

  useEffect(() => {
    // Skip checks on auth pages
    if (isOnAuthPage) return;
    // Wait for user data loading to complete
    if (is_loading) return;

    // Check authentication
    if (require_auth && !is_authenticated) {
      if (fallback) return;
      return router.push(redirect_to);
    }

    // Check role if specified
    if (required_roles && user) {
      if (!required_roles.includes(user.role)) {
        if (fallback) return;
        return router.push(redirect_to);
      }
    }
  }, [
    user,
    is_loading,
    is_authenticated,
    required_roles,
    redirect_to,
    fallback,
    require_auth,
    router,
    isOnAuthPage,
  ]);

  // Always render children on auth pages
  if (isOnAuthPage) return <>{children}</>;

  // Show loading indicator
  if (is_loading) {
    return (
      <div className={classes.loading_container}>
        <div className={classes.loading_container_spinner}></div>
      </div>
    );
  }

  // Check authentication
  if (require_auth && !is_authenticated) return fallback;

  // Check role if specified
  if (required_roles && user) {
    if (!required_roles.includes(user.role)) return fallback;
  }

  // Check if user is blocked
  if (!user?.is_active) {
    return (
      fallback || (
        <div className={classes.banned_container}>
          <div className={classes.banned_container_content}>
            <h1 className={classes.banned_container_content_title}>
              Account Blocked
            </h1>
            <p className={classes.banned_container_content_description}>
              Your account has been blocked by administrator.
            </p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
};
