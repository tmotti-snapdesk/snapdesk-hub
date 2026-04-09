import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

/**
 * Middleware NextAuth edge-compatible.
 * Importe uniquement `authConfig` (pas de Prisma, pas de bcrypt).
 */
// La logique de protection est dans authConfig.callbacks.authorized ;
// quand elle renvoie `false`, NextAuth redirige vers pages.signIn.
export default NextAuth(authConfig).auth;

export const config = {
  // On matche toutes les routes SAUF : fichiers statiques, images, api/auth, favicon
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)"],
};
