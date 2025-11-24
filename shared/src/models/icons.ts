import {
  Image,
  User,
  Lock,
  Home,
  Settings,
  Bed,
  Calendar1,
  Package,
  CreditCard,
  CalendarCheck2,
  CalendarClock,
  DollarSign,
  CheckCircle,
  Layers,
  MessageSquare,
  CalendarPlus,
  Bell
} from "lucide-react";
import { GETTABLE_NAMES } from "./data";

export const GETTABLE_ICONS: Record<GETTABLE_NAMES, typeof User> = {
  APARTMENT: Home,
  APARTMENT_IMAGE: Image,
  APARTMENT_BED: Bed,
  APARTMENT_AMENITY: CheckCircle,
  AMENITY: Settings,
  BED_TYPE: Bed,
  REVIEW: MessageSquare,

  ADDITIONAL_OPTION: Package,
  BOOKING_VARIANT: Layers,
  RESERVATION: Calendar1,
  BOOKING: CalendarCheck2,
  BOOKING_ADDITIONAL_OPTION: Package,

  TRANSACTION: DollarSign,
  TRANSFER_DETAIL: CreditCard,
  CARD_DETAIL: CreditCard,

  EVENT: CalendarClock,
  EVENT_IMAGE: Image,
  BOOKING_EVENT: CalendarPlus,

  USER: User,
  SESSION: Lock,
  NOTIFICATION: Bell
} as const;
