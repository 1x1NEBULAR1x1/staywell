import { AuthApi } from "@/lib/api/services";

/**
 * Get access token for WebSocket authentication
 * Checks cached token first, then fetches fresh one if needed
 */
export const getAccessToken = async (): Promise<string | null> => {
  const authApi = new AuthApi();
  try {
    // Check if we have a cached token that's still valid
    const cachedToken = sessionStorage.getItem("ws_token");
    const cachedExpiry = sessionStorage.getItem("ws_token_expiry");

    if (cachedToken && cachedExpiry) {
      const expiry = parseInt(cachedExpiry, 10);
      const currentTime = Date.now();

      // If token is still valid for at least 2 minutes, use it
      if (currentTime < expiry - 2 * 60 * 1000) {
        return cachedToken;
      } else {
        // Clear expired token
        sessionStorage.removeItem("ws_token");
        sessionStorage.removeItem("ws_token_expiry");
      }
    }

    // Get fresh token from API
    const token = await authApi.getWsToken();
    if (!token) return null;
    // Cache the token with expiry
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      sessionStorage.setItem("ws_token", token);
      sessionStorage.setItem("ws_token_expiry", expiry.toString());
    } catch (_e) {
      // Failed to parse token expiry, don't cache
    }
    return token;
  } catch (_error) {
    return null;
  }
};

