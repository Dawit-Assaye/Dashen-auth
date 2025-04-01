"use client";

import TanstackReactQueryProvider from "./tanstack-react-query/TanstackReactQueryProvider";
export function Providers({ children }: { children: React.ReactNode }) {
  return <TanstackReactQueryProvider>{children}</TanstackReactQueryProvider>;
}
