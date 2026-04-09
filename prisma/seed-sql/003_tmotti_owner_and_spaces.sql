-- ============================================================================
-- Seed Phase 7b — Onboarding des 26 espaces réels actuellement commercialisés
-- par Snapdesk, tous liés au compte tmotti@snapdesk.co en rôle OWNER.
--
-- À exécuter dans Supabase SQL Editor.
--
-- Effets :
--   1. Upsert du compte tmotti@snapdesk.co (role OWNER, password Snapdesk2026!)
--   2. Insertion de 26 espaces en statut MARKETING
--
-- Notes :
--   - Les espaces "10 Mont Thabor" et "197 Malesherbes" n'ont pas de loyer
--     communiqué → saisis à 0 €, à mettre à jour depuis /admin plus tard.
--   - "197 Malesherbes" n'a pas de nombre de postes → saisi à 0.
--   - Si tu as déjà créé des espaces de test via /admin (ex: "Bergère R+2"),
--     ils resteront en place. Pour faire table rase AVANT d'exécuter ce
--     script, lance d'abord :
--       DELETE FROM "Space"
--       WHERE "ownerId" = (SELECT id FROM "User" WHERE email = 'tmotti@snapdesk.co');
-- ============================================================================

DO $$
DECLARE
  owner_id TEXT;
BEGIN
  -- 1. Upsert du compte propriétaire Thomas Motti
  INSERT INTO "User" (
    "id", "email", "passwordHash", "name", "role", "company", "createdAt", "updatedAt"
  )
  VALUES (
    gen_random_uuid()::text,
    'tmotti@snapdesk.co',
    '$2b$10$OxHOLzt0s/n.DLDLiQ3.Su5umnxnPi9lUTdhKXI1/6X9jxNBWp6b.', -- Snapdesk2026!
    'Thomas Motti',
    'OWNER',
    'Snapdesk',
    now(),
    now()
  )
  ON CONFLICT ("email") DO UPDATE SET
    "passwordHash" = EXCLUDED."passwordHash",
    "name"         = EXCLUDED."name",
    "role"         = EXCLUDED."role",
    "company"      = EXCLUDED."company",
    "updatedAt"    = now()
  RETURNING id INTO owner_id;

  -- 2. Insertion des 26 espaces (loyers exprimés en centimes)
  INSERT INTO "Space" (
    "id", "ownerId", "name", "address", "postalCode", "city", "floor",
    "area", "capacity", "spaceType", "amenities", "monthlyRent",
    "availabilityDate", "description", "status", "createdAt", "updatedAt"
  )
  VALUES
    (gen_random_uuid()::text, owner_id, '11 rue aux Ours',                '11 Rue aux Ours',                '75003', 'Paris', NULL,    80,   16, 'Plateau open-space', ARRAY[]::text[],   850000, now(), 'Espace de bureaux 11 Rue aux Ours, Paris 75003. Actuellement en commercialisation par Snapdesk.',                 'MARKETING', now(), now()),
    (gen_random_uuid()::text, owner_id, 'Jasmin',                         '33 rue Raffet',                  '75016', 'Paris', NULL,   117,   18, 'Plateau open-space', ARRAY[]::text[],   810000, now(), 'Espace Jasmin, 33 rue Raffet, Paris 75016. Actuellement en commercialisation par Snapdesk.',                      'MARKETING', now(), now()),
    (gen_random_uuid()::text, owner_id, '24 Poissonnière',                '24 Rue du Faubourg Poissonnière','75010', 'Paris', NULL,   101,   18, 'Plateau open-space', ARRAY[]::text[],  1100000, now(), 'Espace 24 Rue du Faubourg Poissonnière, Paris 75010. Actuellement en commercialisation par Snapdesk.',             'MARKETING', now(), now()),
    (gen_random_uuid()::text, owner_id, '55 Écuries',                     '55 Rue des Petites Écuries',     '75010', 'Paris', NULL,   132,   24, 'Plateau open-space', ARRAY[]::text[],  1490000, now(), 'Espace 55 Rue des Petites Écuries, Paris 75010. Actuellement en commercialisation par Snapdesk.',                  'MARKETING', now(), now()),
    (gen_random_uuid()::text, owner_id, '102 Réaumur',                    '102 Rue Réaumur',                '75002', 'Paris', NULL,   130,   24, 'Plateau open-space', ARRAY[]::text[],  1650000, now(), 'Espace 102 Rue Réaumur, Paris 75002. Actuellement en commercialisation par Snapdesk.',                             'MARKETING', now(), now()),
    (gen_random_uuid()::text, owner_id, '29 Petites Ecuries R+2 (new)',   '29 Rue des Petites Écuries',     '75009', 'Paris', 'R+2',  137,   24, 'Plateau open-space', ARRAY[]::text[],  1370000, now(), 'Espace 29 Rue des Petites Écuries R+2, Paris 75009. Nouveau — actuellement en commercialisation par Snapdesk.',    'MARKETING', now(), now()),
    (gen_random_uuid()::text, owner_id, '13 Turbigo',                     '13 Rue de Turbigo',              '75002', 'Paris', NULL,   192,   30, 'Plateau open-space', ARRAY[]::text[],  2000000, now(), 'Espace 13 Rue de Turbigo, Paris 75002. Actuellement en commercialisation par Snapdesk.',                           'MARKETING', now(), now()),
    (gen_random_uuid()::text, owner_id, 'Bergère R+2',                    '17 Rue Bergère',                 '75009', 'Paris', 'R+2',  190,   32, 'Plateau open-space', ARRAY[]::text[],  1990000, now(), 'Espace Bergère R+2, 17 Rue Bergère, Paris 75009. Actuellement en commercialisation par Snapdesk.',                 'MARKETING', now(), now()),
    (gen_random_uuid()::text, owner_id, 'Barbès-Marcadet',                '71 Rue Ordener',                 '75018', 'Paris', NULL,   225,   42, 'Plateau open-space', ARRAY[]::text[],  1600000, now(), 'Espace Barbès-Marcadet, 71 Rue Ordener, Paris 75018. Actuellement en commercialisation par Snapdesk.',             'MARKETING', now(), now()),
    (gen_random_uuid()::text, owner_id, '28 Sentier',                     '28 Rue du Sentier',              '75002', 'Paris', NULL,   267,   42, 'Plateau open-space', ARRAY[]::text[],  2690000, now(), 'Espace 28 Rue du Sentier, Paris 75002. Actuellement en commercialisation par Snapdesk.',                           'MARKETING', now(), now()),
    (gen_random_uuid()::text, owner_id, 'Bréguet R+2',                    '2 Rue Bréguet',                  '75011', 'Paris', 'R+2',  344,   48, 'Plateau open-space', ARRAY[]::text[],  2800000, now(), 'Espace Bréguet R+2, 2 Rue Bréguet, Paris 75011. Actuellement en commercialisation par Snapdesk.',                  'MARKETING', now(), now()),
    (gen_random_uuid()::text, owner_id, '63 Sabin',                       '63 Rue Saint Sabin',             '75011', 'Paris', NULL,   357,   52, 'Plateau open-space', ARRAY[]::text[],  2590000, now(), 'Espace 63 Rue Saint Sabin, Paris 75011. Actuellement en commercialisation par Snapdesk.',                          'MARKETING', now(), now()),
    (gen_random_uuid()::text, owner_id, '2 Bréguet',                      '2 Rue Bréguet',                  '75011', 'Paris', NULL,  1405,  168, 'Plateau open-space', ARRAY[]::text[], 10500000, now(), 'Espace 2 Bréguet (immeuble entier), 2 Rue Bréguet, Paris 75011. Actuellement en commercialisation par Snapdesk.', 'MARKETING', now(), now()),
    (gen_random_uuid()::text, owner_id, 'Castiglione',                    '4 Rue de Castiglione',           '75001', 'Paris', NULL,    80,   14, 'Plateau open-space', ARRAY[]::text[],   900000, now(), 'Espace Castiglione, 4 Rue de Castiglione, Paris 75001. Actuellement en commercialisation par Snapdesk.',           'MARKETING', now(), now()),
    (gen_random_uuid()::text, owner_id, 'Cloys',                          '7 rue des Cloÿs',                '75018', 'Paris', NULL,   154,   26, 'Plateau open-space', ARRAY[]::text[],  1040000, now(), 'Espace Cloys, 7 rue des Cloÿs, Paris 75018. Actuellement en commercialisation par Snapdesk.',                      'MARKETING', now(), now()),
    (gen_random_uuid()::text, owner_id, '68 Hauteville',                  '68 Rue d''Hauteville',           '75010', 'Paris', NULL,   160,   28, 'Plateau open-space', ARRAY[]::text[],  1800000, now(), 'Espace 68 Rue d''Hauteville, Paris 75010. Actuellement en commercialisation par Snapdesk.',                        'MARKETING', now(), now()),
    (gen_random_uuid()::text, owner_id, '38 Louvre',                      '38 Rue du Louvre',               '75001', 'Paris', NULL,   215,   34, 'Plateau open-space', ARRAY[]::text[],  2320000, now(), 'Espace 38 Rue du Louvre, Paris 75001. Actuellement en commercialisation par Snapdesk.',                            'MARKETING', now(), now()),
    (gen_random_uuid()::text, owner_id, '94 Sébastopol',                  '94 Bd de Sébastopol',            '75003', 'Paris', NULL,   220,   40, 'Plateau open-space', ARRAY[]::text[],  2360000, now(), 'Espace 94 Bd de Sébastopol, Paris 75003. Actuellement en commercialisation par Snapdesk.',                         'MARKETING', now(), now()),
    (gen_random_uuid()::text, owner_id, '10 Mont Thabor',                 '10 Rue du Mont Thabor',          '75001', 'Paris', NULL,   190,   28, 'Plateau open-space', ARRAY[]::text[],        0, now(), 'Espace 10 Rue du Mont Thabor, Paris 75001. Loyer à confirmer. Actuellement en commercialisation par Snapdesk.',    'MARKETING', now(), now()),
    (gen_random_uuid()::text, owner_id, '33 Louvre',                      '33 Rue du Louvre',               '75001', 'Paris', NULL,   331,   48, 'Plateau open-space', ARRAY[]::text[],  3500000, now(), 'Espace 33 Rue du Louvre, Paris 75001. Actuellement en commercialisation par Snapdesk.',                            'MARKETING', now(), now()),
    (gen_random_uuid()::text, owner_id, '30 Boétie',                      '30 Rue la Boétie',               '75008', 'Paris', NULL,   500,   74, 'Plateau open-space', ARRAY[]::text[],  5300000, now(), 'Espace 30 Rue la Boétie, Paris 75008. Actuellement en commercialisation par Snapdesk.',                            'MARKETING', now(), now()),
    (gen_random_uuid()::text, owner_id, '197 Malesherbes',                '197 Boulevard Malesherbes',      '75008', 'Paris', NULL,   597,    0, 'Plateau open-space', ARRAY[]::text[],        0, now(), 'Espace 197 Boulevard Malesherbes, Paris 75008. Loyer et capacité à confirmer. En commercialisation par Snapdesk.','MARKETING', now(), now()),
    (gen_random_uuid()::text, owner_id, '37 Chateaudun',                  '37 Rue de Châteaudun',           '75009', 'Paris', NULL,   615,   90, 'Plateau open-space', ARRAY[]::text[],  6200000, now(), 'Espace 37 Rue de Châteaudun, Paris 75009. Actuellement en commercialisation par Snapdesk.',                        'MARKETING', now(), now()),
    (gen_random_uuid()::text, owner_id, '62 Hauteville R+4',              '62 Rue d''Hauteville',           '75010', 'Paris', 'R+4',  379,   64, 'Plateau open-space', ARRAY[]::text[],  3950000, now(), 'Espace 62 Rue d''Hauteville, R+4, Paris 75010. Actuellement en commercialisation par Snapdesk.',                   'MARKETING', now(), now()),
    (gen_random_uuid()::text, owner_id, '62 Hauteville R+7/8',            '62 Rue d''Hauteville',           '75010', 'Paris', 'R+7/8',651,   92, 'Plateau open-space', ARRAY[]::text[],  6950000, now(), 'Espace 62 Rue d''Hauteville, R+7/8, Paris 75010. Actuellement en commercialisation par Snapdesk.',                 'MARKETING', now(), now()),
    (gen_random_uuid()::text, owner_id, '131 Aboukir',                    '131 Rue d''Aboukir',             '75002', 'Paris', NULL,   704,   90, 'Plateau open-space', ARRAY[]::text[],  7560000, now(), 'Espace 131 Rue d''Aboukir, Paris 75002. Actuellement en commercialisation par Snapdesk.',                          'MARKETING', now(), now());

  RAISE NOTICE 'Seed terminé : compte tmotti@snapdesk.co + 26 espaces insérés.';
END $$;

-- Query de vérification : liste les espaces de tmotti avec leur loyer en euros
SELECT
  s.name,
  s.city,
  s."postalCode",
  s.floor,
  s.area AS m2,
  s.capacity AS postes,
  (s."monthlyRent" / 100) AS loyer_euros,
  s.status
FROM "Space" s
JOIN "User" u ON u.id = s."ownerId"
WHERE u.email = 'tmotti@snapdesk.co'
ORDER BY s."createdAt" DESC;
