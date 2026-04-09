"use client";

import { SessionProvider } from "next-auth/react";

/**
 * Wrapper client-side pour fournir le contexte NextAuth aux hooks
 * `useSession`, `signIn`, `signOut` côté client.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
