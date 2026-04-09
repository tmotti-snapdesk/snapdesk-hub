-- ============================================================================
-- Seed SQL — à exécuter dans Supabase SQL Editor si on ne peut pas lancer
-- `npm run db:seed` depuis sa machine locale.
--
-- Mot de passe pour les 2 comptes : Demo1234!
-- Hash bcrypt (coût 10) pré-calculé ci-dessous.
-- ============================================================================

INSERT INTO "User" (
    "id",
    "email",
    "passwordHash",
    "name",
    "role",
    "company",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid()::text,
    'proprietaire@demo.com',
    '$2b$10$EWfdXLzkPmbT.rVOWTTXb.dGjbIYn7SYqanjroIbBe405N/aMXSSW',
    'Jean-Marc Dupont',
    'OWNER',
    'Immobilier Dupont SAS',
    now(),
    now()
), (
    gen_random_uuid()::text,
    'bizdev@snapdesk.com',
    '$2b$10$EWfdXLzkPmbT.rVOWTTXb.dGjbIYn7SYqanjroIbBe405N/aMXSSW',
    'Claire Lambert',
    'BIZDEV',
    NULL,
    now(),
    now()
)
ON CONFLICT ("email") DO UPDATE
SET "passwordHash" = EXCLUDED."passwordHash",
    "updatedAt"    = now();
