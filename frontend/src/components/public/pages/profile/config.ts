import {
  ArrowLeftRight,
  Bell,
  CreditCard,
  Headset,
  History,
  Settings,
  User,
} from "lucide-react";

export const profile_tabs = [
  "settings",
  "notification",
  "cards",
  "transfers",
  "history",
  "support",
] as const;

export type ProfileTab = (typeof profile_tabs)[number];

export const isProfileTab = (tab: string): tab is ProfileTab => {
  return profile_tabs.some((t) => t === tab);
};

export type ProfileTabConfig = {
  href: ProfileTab | "profile";
  label: string;
  icon: React.ElementType;
};

export const profile_tabs_config: ProfileTabConfig[] = [
  {
    href: "profile",
    label: "My Profile",
    icon: User,
  },
  {
    href: "notification",
    label: "Notification",
    icon: Bell,
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
