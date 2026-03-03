import { MOCK_USERS } from "./mock-data";

// Simple mock auth - in production replace with NextAuth + DB
export interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    role: "proprietaire" | "entreprise";
    company?: string;
  };
}

export const MOCK_CREDENTIALS: Record<string, string> = {
  "proprietaire@demo.com": "demo1234",
  "entreprise@demo.com": "demo1234",
};

export function authenticateUser(email: string, password: string) {
  if (MOCK_CREDENTIALS[email] === password) {
    return MOCK_USERS.find((u) => u.email === email) ?? null;
  }
  return null;
}
