import type { DefaultSession } from "next-auth";
import type { UserRole } from "@prisma/client";

/**
 * Augmentation des types NextAuth pour inclure `id`, `role` et `company`
 * dans la session et le JWT.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      company?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    role: UserRole;
    company?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    company?: string;
  }
}
