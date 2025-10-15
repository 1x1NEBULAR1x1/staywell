import { BaseFiltersOptions } from "../../common";
import { Prisma, User as PrismaUser, User } from "../../database";

export interface UserWithoutPassword extends Omit<PrismaUser, 'password_hash'> { }

export const SAFE_USER_SELECT: Prisma.UserSelect = {
  id: true,
  email: true,
  first_name: true,
  last_name: true,
  image: true,
  is_active: true,
}

export const USER_WITHOUT_PASSWORD_SELECT: Prisma.UserSelect = {
  ...SAFE_USER_SELECT,
  email_verified: true,
  phone_verified: true,
  role: true,
  created: true,
  updated: true,
  phone_number: true,
}

export interface SafeUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  image: string | null;
  is_active: boolean,
}


export interface SessionData extends Omit<PrismaUser, 'password_hash' | 'id'> {
  id: string;
  user_id: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
}

export interface SessionsFilters extends BaseFiltersOptions<SessionData> {
  user_id?: string;
  is_active?: boolean;
  ip_address?: string;
  user_agent?: string;
}

export interface RequestWithCookies extends Request {
  cookies: {
    refresh_token?: string;
    access_token?: string;
  };
}

export type AuthenticatedRequest = Request & {
  user: PrismaUser & { session_id: string };
}

export type AuthResponse = {
  user: User;
  session: SessionData;
  message: string;
}