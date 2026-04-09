import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

/**
 * Config NextAuth complète (server-side uniquement).
 * Importe Prisma + bcrypt → ne doit JAMAIS être importée par le middleware.
 * Utilisée par :
 *   - src/app/api/auth/[...nextauth]/route.ts  (handlers)
 *   - les Server Components / Server Actions    (auth, signIn, signOut)
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const email = (credentials?.email as string | undefined)?.toLowerCase();
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          company: user.company ?? undefined,
        };
      },
    }),
  ],
});
