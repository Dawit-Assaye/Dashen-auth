"use client";

import { SessionProvider } from "next-auth/react";
import TanstackReactQueryProvider from "./tanstack-react-query/TanstackReactQueryProvider";
import { AuthProvider } from "@/context/AuthContext";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TanstackReactQueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </TanstackReactQueryProvider>
    </SessionProvider>
  );
}
