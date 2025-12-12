import { api } from "./axios";

/**
 * Function to refresh tokens on the client side
 */
export async function refreshTokensClient(): Promise<boolean> {
  try {
    return (await api.post("/auth/refresh")).status === 200;
  } catch {
    return false;
  }
}

/**
 * Function to check the validity of a token
 */
export function isTokenExpired(token: string): boolean {
  try {
    // Decode JWT token (without signature verification, only for getting exp)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const current_time = Math.floor(Date.now() / 1000);

    return payload.exp < current_time;
  } catch (error) {
    console.error("Error checking token:", error);
    return true; // Consider the token expired if we can't check it
  }
}

/**
 * Function to get tokens from cookies
 */
export function getTokensFromCookies(): {
  access_token?: string;
  refresh_token?: string;
} {
  if (typeof document === "undefined") return {}; // For SSR

  const cookies = document.cookie.split(";").reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>,
  );

  return {
    access_token: cookies.access_token,
    refresh_token: cookies.refresh_token,
  };
}

/**
 * Function to clear tokens from cookies
 * Note: HttpOnly cookies cannot be deleted from the client,
 * this should happen through the server
 */
export function clearTokensCookies(): void {
  if (typeof document === "undefined") return; // For SSR
  // Clear regular cookies (not HttpOnly)
  document.cookie =
    "access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  document.cookie =
    "refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}
