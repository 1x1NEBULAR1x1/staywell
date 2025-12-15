"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";
import { query_client } from "@/lib/api";

/**
 * Component for wrapping application with necessary providers
 * @param children - Child components
 * @returns Components wrapped with providers
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={query_client}>
      <ReactQueryDevtools client={query_client} />
      {children}
    </QueryClientProvider>
  );
}
