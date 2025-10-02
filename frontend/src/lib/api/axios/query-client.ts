import { QueryClient } from "@tanstack/react-query";

export const query_client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 минута
    },
  },
});