/**
 * Seed script — crée les comptes internes Snapdesk.
 *
 * Lancer avec : npm run db:seed
 *
 * Comptes créés :
 *   - 1 admin  (admin@snapdesk.co)
 *   - 6 BizDev (mvisiedo / ffourquemin / tmartins / mrumeau / mparmentelot / rherfort @snapdesk.co)
 *   - 1 propriétaire de démo (proprietaire@demo.com)
 *
 * Mot de passe initial pour tous : Snapdesk2026!
 * (à changer à la première connexion en prod)
 */
import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SEED_PASSWORD = "Snapdesk2026!";

const BIZDEV_TEAM: Array<{ email: string; name: string }> = [
  { email: "mvisiedo@snapdesk.co", name: "Mélanie Visiedo" },
  { email: "ffourquemin@snapdesk.co", name: "Florian Fourquemin" },
  { email: "tmartins@snapdesk.co", name: "Tomas Martins" },
  { email: "mrumeau@snapdesk.co", name: "Martin Rumeau" },
  { email: "mparmentelot@snapdesk.co", name: "Maxence Parmentelot" },
  { email: "rherfort@snapdesk.co", name: "Rémy Herfort" },
];

async function main() {
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@snapdesk.co" },
    update: { passwordHash },
    create: {
      email: "admin@snapdesk.co",
      name: "Admin Snapdesk",
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  // BizDevs
  const bizdevs = [];
  for (const bd of BIZDEV_TEAM) {
    const user = await prisma.user.upsert({
      where: { email: bd.email },
      update: { passwordHash, name: bd.name },
      create: {
        email: bd.email,
        name: bd.name,
        passwordHash,
        role: UserRole.BIZDEV,
      },
    });
    bizdevs.push(user);
  }

  // Propriétaire de démo
  const owner = await prisma.user.upsert({
    where: { email: "proprietaire@demo.com" },
    update: {},
    create: {
      email: "proprietaire@demo.com",
      name: "Jean-Marc Dupont",
      passwordHash: await bcrypt.hash("Demo1234!", 10),
      role: UserRole.OWNER,
      company: "Immobilier Dupont SAS",
    },
  });

  console.log("✅ Seed terminé :");
  console.log(`   ADMIN  → ${admin.email}  /  ${SEED_PASSWORD}`);
  bizdevs.forEach((b) =>
    console.log(`   BIZDEV → ${b.email}  /  ${SEED_PASSWORD}`),
  );
  console.log(`   OWNER  → ${owner.email}  /  Demo1234!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
