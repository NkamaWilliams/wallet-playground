'use client'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
    mutations: {
      networkMode: 'online',
    },
  },
})

export default function QueryProvider({ children }: { children: ReactNode }) {
  // ensure a single client per component tree
  const [client] = useState(() => queryClient)

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
