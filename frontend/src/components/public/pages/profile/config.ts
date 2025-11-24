import { User, Settings, Bell, CreditCard, ArrowLeftRight, History, Headset } from "lucide-react";

export const profile_tabs = ["settings", "notification", "cards", "transfers", "history", 'support'] as const;

export type ProfileTab = (typeof profile_tabs)[number];

export const isProfileTab = (tab: string): tab is ProfileTab => {
  return profile_tabs.some((t) => t === tab);
};

export type ProfileTabConfig = {
  href: ProfileTab | "profile";
  label: string;
  icon: React.ElementType;
}

export const profile_tabs_config: ProfileTabConfig[] = [
  {
    href: "profile",
    label: "My Profile",
    icon: User,
  },
  {
    href: "settings",
    label: "Settings",
    icon: Settings,
  },
  {
    href: "notification",
    label: "Notification",
    icon: Bell,
  },
  {
    href: "cards",
    label: "Cards",
    icon: CreditCard,
  },
  {
    href: "transfers",
    label: "Transfers",
    icon: ArrowLeftRight,
  },
  {
    href: "history",
    label: "History",
    icon: History,
  },
  {
    href: "support",
    label: "Support",
    icon: Headset,
  },
];