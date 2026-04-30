-- ============================================================
-- Les Cabanes de France — Schéma Supabase (PostgreSQL)
-- Exécutez ce fichier dans l'éditeur SQL de Supabase
-- ============================================================

-- 1. Enum pour le type de cabane
CREATE TYPE cabane_type AS ENUM ('livres', 'dons', 'mixte');

-- 2. Table principale
CREATE TABLE IF NOT EXISTS cabanes (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  nom           TEXT          NOT NULL CHECK (char_length(nom) BETWEEN 2 AND 120),
  type          cabane_type   NOT NULL DEFAULT 'livres',
  description   TEXT          NOT NULL DEFAULT '',
  latitude      FLOAT8        NOT NULL,
  longitude     FLOAT8        NOT NULL,
  ville         TEXT          NOT NULL DEFAULT '',
  photo_url     TEXT,
  contributeur  TEXT          NOT NULL CHECK (char_length(contributeur) BETWEEN 1 AND 80),
  signalements  INT           NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- 3. Index pour les requêtes géographiques et par type
CREATE INDEX IF NOT EXISTS idx_cabanes_type        ON cabanes (type);
CREATE INDEX IF NOT EXISTS idx_cabanes_created_at  ON cabanes (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cabanes_location    ON cabanes (latitude, longitude);

-- 4. Row Level Security
ALTER TABLE cabanes ENABLE ROW LEVEL SECURITY;

-- Lecture publique (tout le monde peut voir les cabanes)
CREATE POLICY "Lecture publique des cabanes"
  ON cabanes FOR SELECT
  USING (true);

-- Insertion publique (sans authentification pour commencer)
CREATE POLICY "Insertion publique des cabanes"
  ON cabanes FOR INSERT
  WITH CHECK (true);

-- 5. Fonction pour incrémenter les signalements
CREATE OR REPLACE FUNCTION increment_signalements(cabane_id UUID)
RETURNS VOID AS $$
  UPDATE cabanes SET signalements = signalements + 1 WHERE id = cabane_id;
$$ LANGUAGE SQL SECURITY DEFINER;

-- 6. Données de démonstration (optionnel — supprimez ce bloc en prod)
INSERT INTO cabanes (nom, type, description, latitude, longitude, ville, contributeur) VALUES
  ('La Petite Bibliothèque du Marais',  'livres', 'Pleine de romans et BD pour tous les âges.',                  48.856,  2.354,  'Paris',    'Marie'),
  ('Cabane Solidaire Place Bellecour',  'dons',   'Vêtements, jouets et conserves. Prenez et donnez !',          45.757,  4.832,  'Lyon',     'Julien'),
  ('Le Coffre aux Trésors',             'mixte',  'Livres et objets divers, entretenu par les voisins.',          43.296,  5.381,  'Marseille','Sophie'),
  ('Boîte à Livres du Capitole',        'livres', 'Dans une vieille cabine téléphonique rénovée.',               43.605,  1.444,  'Toulouse', 'Pierre'),
  ('La Ruche Généreuse',                'dons',   'Conserves et produits ménagers du quartier Saint-Michel.',    44.838, -0.579,  'Bordeaux', 'Amandine');
