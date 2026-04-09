import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@prisma/client";

/**
 * Config NextAuth edge-compatible (utilisée par le middleware).
 * Ne doit RIEN importer qui touche à Prisma / Node APIs.
 * Le tableau `providers` est vide ici — il est complété dans `src/auth.ts`.
 */
export const authConfig = {
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;

      const isOwnerPath = nextUrl.pathname.startsWith("/proprietaire");
      const isBizdevPath = nextUrl.pathname.startsWith("/bizdev");
      const isAdminPath = nextUrl.pathname.startsWith("/admin");
      const isAuthPage =
        nextUrl.pathname.startsWith("/signin") ||
        nextUrl.pathname.startsWith("/signup");

      // Si connecté et sur une page d'auth → rediriger vers son dashboard
      if (isLoggedIn && isAuthPage) {
        if (role === "OWNER") {
          return Response.redirect(new URL("/proprietaire", nextUrl));
        }
        if (role === "BIZDEV") {
          return Response.redirect(new URL("/bizdev", nextUrl));
        }
        if (role === "ADMIN") {
          return Response.redirect(new URL("/admin", nextUrl));
        }
      }

      // Routes propriétaire → réservées au rôle OWNER
      if (isOwnerPath) {
        if (!isLoggedIn) return false; // redirige vers /signin
        if (role !== "OWNER") {
          return Response.redirect(new URL("/signin", nextUrl));
        }
        return true;
      }

      // Routes bizdev → BIZDEV et ADMIN
      if (isBizdevPath) {
        if (!isLoggedIn) return false;
        if (role !== "BIZDEV" && role !== "ADMIN") {
          return Response.redirect(new URL("/signin", nextUrl));
        }
        return true;
      }

      // Routes admin → ADMIN uniquement
      if (isAdminPath) {
        if (!isLoggedIn) return false;
        if (role !== "ADMIN") {
          return Response.redirect(new URL("/signin", nextUrl));
        }
        return true;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
        token.company = user.company;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.company = token.company as string | undefined;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
