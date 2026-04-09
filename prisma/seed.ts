/**
 * Seed script — crée 2 comptes de test pour démarrer rapidement.
 *
 * Lancer avec : npm run db:seed
 *
 * Comptes créés :
 *   - proprietaire@demo.com  (rôle OWNER)  — mot de passe : Demo1234!
 *   - bizdev@snapdesk.com    (rôle BIZDEV) — mot de passe : Demo1234!
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = "Demo1234!";
  const passwordHash = await bcrypt.hash(password, 10);

  const owner = await prisma.user.upsert({
    where: { email: "proprietaire@demo.com" },
    update: { passwordHash },
    create: {
      email: "proprietaire@demo.com",
      name: "Jean-Marc Dupont",
      passwordHash,
      role: "OWNER",
      company: "Immobilier Dupont SAS",
    },
  });

  const bizdev = await prisma.user.upsert({
    where: { email: "bizdev@snapdesk.com" },
    update: { passwordHash },
    create: {
      email: "bizdev@snapdesk.com",
      name: "Claire Lambert",
      passwordHash,
      role: "BIZDEV",
    },
  });

  console.log("✅ Seed terminé :");
  console.log(`   OWNER  → ${owner.email}  /  ${password}`);
  console.log(`   BIZDEV → ${bizdev.email}  /  ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
