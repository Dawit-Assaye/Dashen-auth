import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import React from "react";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      experimental_prefetchInRender: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
    },
  },
});
interface Props {
  children: ReactNode;
}
export default function TanstackReactQueryProvider({ children }: Props) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
