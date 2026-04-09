-- ============================================================================
-- Seed SQL — Phase 7 — équipe BizDev + compte admin
-- À exécuter dans Supabase SQL Editor APRÈS avoir appliqué la migration
-- 20260409120000_sheet_imports/migration.sql.
--
-- Mot de passe pour les 7 comptes : Snapdesk2026!
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
) VALUES
-- Admin
(
    gen_random_uuid()::text,
    'admin@snapdesk.co',
    '$2b$10$OxHOLzt0s/n.DLDLiQ3.Su5umnxnPi9lUTdhKXI1/6X9jxNBWp6b.',
    'Admin Snapdesk',
    'ADMIN',
    NULL,
    now(),
    now()
),
-- BizDevs
(
    gen_random_uuid()::text,
    'mvisiedo@snapdesk.co',
    '$2b$10$OxHOLzt0s/n.DLDLiQ3.Su5umnxnPi9lUTdhKXI1/6X9jxNBWp6b.',
    'Mélanie Visiedo',
    'BIZDEV',
    NULL,
    now(),
    now()
),
(
    gen_random_uuid()::text,
    'ffourquemin@snapdesk.co',
    '$2b$10$OxHOLzt0s/n.DLDLiQ3.Su5umnxnPi9lUTdhKXI1/6X9jxNBWp6b.',
    'Florian Fourquemin',
    'BIZDEV',
    NULL,
    now(),
    now()
),
(
    gen_random_uuid()::text,
    'tmartins@snapdesk.co',
    '$2b$10$OxHOLzt0s/n.DLDLiQ3.Su5umnxnPi9lUTdhKXI1/6X9jxNBWp6b.',
    'Tomas Martins',
    'BIZDEV',
    NULL,
    now(),
    now()
),
(
    gen_random_uuid()::text,
    'mrumeau@snapdesk.co',
    '$2b$10$OxHOLzt0s/n.DLDLiQ3.Su5umnxnPi9lUTdhKXI1/6X9jxNBWp6b.',
    'Martin Rumeau',
    'BIZDEV',
    NULL,
    now(),
    now()
),
(
    gen_random_uuid()::text,
    'mparmentelot@snapdesk.co',
    '$2b$10$OxHOLzt0s/n.DLDLiQ3.Su5umnxnPi9lUTdhKXI1/6X9jxNBWp6b.',
    'Maxence Parmentelot',
    'BIZDEV',
    NULL,
    now(),
    now()
),
(
    gen_random_uuid()::text,
    'rherfort@snapdesk.co',
    '$2b$10$OxHOLzt0s/n.DLDLiQ3.Su5umnxnPi9lUTdhKXI1/6X9jxNBWp6b.',
    'Rémy Herfort',
    'BIZDEV',
    NULL,
    now(),
    now()
)
ON CONFLICT ("email") DO UPDATE
SET "passwordHash" = EXCLUDED."passwordHash",
    "name"         = EXCLUDED."name",
    "role"         = EXCLUDED."role",
    "updatedAt"    = now();
