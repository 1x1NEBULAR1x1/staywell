"use client";

import { useCallback, useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import { useToast } from "@/hooks/common/useToast";
import { getAccessToken } from ".";

interface UseWebSocketConnectionOptions {
  onConnect?: (getChats?: () => void) => void;
  onDisconnect?: (reason: string) => void;
  onConnectError?: (error: Error) => void;
  onAuthenticated?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

interface UseWebSocketConnectionReturn {
  socket: Socket | null;
  is_connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshTokenAndReconnect: () => Promise<void>;
}

export const useWebSocketConnection = (
  options: UseWebSocketConnectionOptions = {},
): UseWebSocketConnectionReturn => {
  const { onConnect, onDisconnect, onConnectError, onAuthenticated, onError } =
    options;

  const socketRef = useRef<Socket | null>(null);
  const isConnectedRef = useRef(false);
  const isRefreshingTokenRef = useRef(false);
  const toast = useToast();
  const connectRef = useRef<(() => Promise<void>) | null>(null);

  // Refresh token and reconnect
  const refreshTokenAndReconnect = useCallback(async () => {
    if (isRefreshingTokenRef.current) return;
    isRefreshingTokenRef.current = true;

    try {
      const authApi = (await import("@/lib/api/services")).AuthApi;
      const api = new authApi();
      // Try to refresh token by making a request that will trigger the axios interceptor
      await api.getProfile();

      console.log("Token refreshed, reconnecting to chat...");

      // Disconnect current socket
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      // Reconnect with new token
      setTimeout(() => connectRef.current?.().catch(console.error), 1000);
    } catch (error) {
      console.error("Failed to refresh token:", error);
      toast.error("Session expired. Please login again.");
    } finally {
      isRefreshingTokenRef.current = false;
    }
  }, [toast]);

  // Connect to WebSocket
  const connect = useCallback(async () => {
    connectRef.current = connect;
    if (socketRef.current?.connected) return;

    // Get token for authentication
    const token = await getAccessToken();
    if (!token) {
      console.error(
        "WebSocket: No token available for WebSocket authentication",
      );
      return;
    }

    // WebSocket connects to the base API URL without /api prefix
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
      "http://localhost:3001";
    const socketUrl = `${baseUrl}/chat`;

    const socket = io(socketUrl, {
      auth: {
        token,
      },
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      forceNew: false,
    });

    socket.on("connect", () => {
      console.log("WebSocket connected");
      isConnectedRef.current = true;
      onConnect?.();
    });

    socket.on("disconnect", (reason) => {
      isConnectedRef.current = false;

      // If disconnected due to authentication error, try to refresh token
      if (
        reason === "io server disconnect" ||
        reason === "io client disconnect"
      ) {
        // This might be due to token expiration, try to refresh
        refreshTokenAndReconnect().catch(console.error);
      }

      onDisconnect?.(reason);
    });

    socket.on("connect_error", (error) => {
      console.log("WebSocket connect_error", error);
      // If it's an authentication error, try to refresh token
      if (
        error.message?.includes("authentication") ||
        error.message?.includes("token")
      ) {
        refreshTokenAndReconnect();
      } else {
        toast.error("Chat connection error");
      }

      onConnectError?.(error);
    });

    socket.on("connected", (data) => {
      // Connection confirmed
      onAuthenticated?.(data);
    });

    socket.on("error", (error) => {
      toast.error(error.message || "Chat error");
      onError?.(error);
    });

    socketRef.current = socket;
  }, [
    toast,
    onConnect,
    onDisconnect,
    onConnectError,
    onAuthenticated,
    onError,
    refreshTokenAndReconnect,
  ]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      isConnectedRef.current = false;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    socket: socketRef.current,
    is_connected: isConnectedRef.current,
    connect,
    disconnect,
    refreshTokenAndReconnect,
  };
};
