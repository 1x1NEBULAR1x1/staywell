'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { query_client } from '@/lib/api';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

/**
 * Компонент для обертывания приложения необходимыми провайдерами
 * @param children - Дочерние компоненты
 * @returns Обернутые провайдерами компоненты
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={query_client}>
      <ReactQueryDevtools client={query_client} />
      {children}
    </QueryClientProvider >
  );
}