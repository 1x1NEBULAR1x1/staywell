import { UserWithoutPassword } from "./extended.types";
import { BaseFiltersOptions, CreativeOmit } from "../../common";
import { Role, User, Message, Notification, NotificationAction } from "../../database";


export type Login = {
  email: string;
  password: string;
}

export type Register = Login & {
  first_name: string;
  last_name: string;
  phone_number?: string;
}

export interface UsersFilters extends BaseFiltersOptions<UserWithoutPassword> {
  role?: Role;
  phone_verified?: boolean;
  email_verified?: boolean;
  email?: string;
  phone_number?: string;
  is_active?: boolean;
}

export type UpdateUser = Partial<CreativeOmit<Omit<User, "password_hash" | "email_verified" | "phone_verified" | "is_active" | "role" | "email" | "image">>> & {
  password?: string;
}

export type AdminUpdateUser = UpdateUser & {
  role?: Role;
  is_active?: boolean;
  email?: string;
  phone_verified?: boolean;
  email_verified?: boolean;
}

export type MessagesFilters = BaseFiltersOptions<Message> & {
  sender_id?: string;
  receiver_id?: string;
  chat_partner_id?: string
  is_read?: boolean;
  booking_id?: string;
}

export type CreateMessage = Omit<CreativeOmit<Message>, 'booking_id' | 'sender_id' | 'is_read'> & { booking_id?: string }
export type UpdateMessage = Partial<CreateMessage>

export type CreateNotification = Omit<CreativeOmit<Notification>, 'message' | 'user_id' | 'object_id' | 'is_read'> & { message?: string; user_id?: string; object_id?: string; is_read?: boolean }
export type UpdateNotification = Partial<CreateNotification>

export type NotificationsFilters = BaseFiltersOptions<Notification> & {
  user_id?: string;
  is_read?: boolean;
  type?: string;
  object_id?: string;
  action?: NotificationAction;
}