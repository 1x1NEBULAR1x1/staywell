import { usePathname, useRouter } from "next/navigation";
import { compile } from 'path-to-regexp';
import type { ProfileTabConfig } from "@/components/public/pages/profile/config";

export const useProfileNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const profileTabPath = compile("/profile/:active_tab");

  const isActiveTab = (tab: ProfileTabConfig) => {
    if (tab.href === "profile") return pathname === "/profile";
    return pathname === profileTabPath({ active_tab: tab.href });
  };

  const handleNavigate = (tab: ProfileTabConfig) => {
    router.push(tab.href === "profile" ? "/profile" : `/profile/${tab.href}`);
  };

  return {
    isActiveTab,
    handleNavigate,
  };
};
