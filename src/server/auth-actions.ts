"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";

export type RegisterOwnerInput = {
  name: string;
  email: string;
  password: string;
  company: string;
};

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Crée un compte propriétaire puis connecte l'utilisateur.
 * Appelée depuis la page /signup.
 */
export async function registerOwnerAction(
  input: RegisterOwnerInput,
): Promise<ActionResult> {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  const company = input.company.trim();
  const password = input.password;

  if (!email || !name || !password) {
    return { ok: false, error: "Tous les champs sont requis." };
  }
  if (password.length < 8) {
    return {
      ok: false,
      error: "Le mot de passe doit faire au moins 8 caractères.",
    };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, error: "Un compte existe déjà avec cet email." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      company: company || null,
      role: "OWNER",
    },
  });

  // Connexion automatique après inscription
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/proprietaire",
    });
  } catch (error) {
    // NextAuth lance une redirection via une exception spéciale — il faut la laisser passer
    if (error instanceof AuthError) {
      return { ok: false, error: "Échec de la connexion automatique." };
    }
    throw error;
  }

  return { ok: true };
}

/**
 * Connecte un utilisateur existant.
 * Appelée depuis la page /signin.
 */
export async function signInAction(
  email: string,
  password: string,
): Promise<ActionResult> {
  try {
    await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirectTo: "/proprietaire", // le middleware redirige si le rôle est BIZDEV
    });
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { ok: false, error: "Email ou mot de passe incorrect." };
      }
      return { ok: false, error: "Erreur de connexion." };
    }
    throw error;
  }
}
