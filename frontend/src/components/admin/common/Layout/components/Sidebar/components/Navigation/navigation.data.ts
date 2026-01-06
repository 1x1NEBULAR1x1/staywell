import { GETTABLE_ICONS } from "@shared/src/models/icons";
import { Command, LayoutList, MessageSquare } from "lucide-react";

export type NavButtonProps = {
  icon: typeof Command;
  label: string;
  href: string;
};

export const main_buttons: NavButtonProps[] = [
  {
    icon: Command,
    label: "Dashboard",
    href: "/admin",
  },
  {
    icon: GETTABLE_ICONS.APARTMENT,
    label: "Apartments",
    href: "/admin/apartments",
  },
  {
    icon: GETTABLE_ICONS.EVENT,
    label: "Events",
    href: "/admin/events",
  },
  {
    icon: GETTABLE_ICONS.BOOKING,
    label: "Bookings",
    href: "/admin/bookings",
  },
  {
    icon: LayoutList,
    label: "Management",
    href: "/admin/management",
  },
];

export const secondary_buttons: NavButtonProps[] = [
  {
    icon: GETTABLE_ICONS.USER,
    label: "Users",
    href: "/admin/users",
  },
  {
    icon: MessageSquare,
    label: "Chat",
    href: "/admin/chat",
  },
];
