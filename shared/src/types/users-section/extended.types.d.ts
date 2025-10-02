import { Prisma, User as PrismaUser } from "../../database";
export interface UserWithoutPassword extends Omit<PrismaUser, 'password_hash'> {
}
export interface SafeUser {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    image: string;
    is_active: boolean;
}
export declare const SAFE_USER_SELECT: Prisma.UserSelect;
export interface SessionData extends Omit<PrismaUser, 'password_hash' | 'id'> {
    id: string;
    user_id: string;
    ip_address: string;
    user_agent: string;
    created_at: string;
    expires_at: string;
    is_active: boolean;
}
export interface RequestWithCookies extends Request {
    cookies: {
        refresh_token?: string;
        access_token?: string;
    };
}
export type AuthenticatedRequest = Request & {
    user: PrismaUser & {
        session_id: string;
    };
};
