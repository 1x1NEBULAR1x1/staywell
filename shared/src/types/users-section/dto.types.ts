import { UserWithoutPassword } from "./extended.types";
import { BaseFiltersOptions, CreativeOmit } from "../../common";
import { Role, User } from "../../database";


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