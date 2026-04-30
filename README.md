# 🏡 Les Cabanes de France

Carte collaborative pour recenser et trouver les cabanes à dons et à livres partout en France.

## Stack technique

- **Frontend** : React 18 + TypeScript + Vite
- **Styles** : Tailwind CSS
- **Carte** : Leaflet.js + react-leaflet
- **Animations** : Framer Motion
- **Icônes** : Lucide React
- **Base de données** : Supabase (PostgreSQL)
- **Géocodage** : Nominatim (OpenStreetMap) — gratuit, aucune clé requise

---

## Installation rapide

```bash
# 1. Cloner / ouvrir le dossier
cd les-cabanes-de-france

# 2. Installer les dépendances
npm install

# 3. Copier et remplir les variables d'environnement
cp .env.example .env

# 4. Lancer en développement
npm run dev
```

L'application s'ouvre sur `http://localhost:5173`.

> **Mode démo** : Sans Supabase configuré, l'app fonctionne avec des données fictives. Les ajouts persistent en mémoire uniquement (rechargement = réinitialisation).

---

## Configuration Supabase

### 1. Créer un projet

1. Rendez-vous sur [app.supabase.com](https://app.supabase.com) et créez un compte/projet
2. Notez l'**URL** et la clé **anon (publique)** : *Project Settings → API*

### 2. Créer la base de données

Dans l'éditeur SQL de Supabase (*SQL Editor → New query*), copiez-collez le contenu de [`supabase/schema.sql`](supabase/schema.sql) et exécutez-le.

### 3. Remplir le `.env`

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

Relancez `npm run dev` — la bannière de mode démo disparaît.

---

## Variables d'environnement

| Variable | Obligatoire | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | Non* | URL du projet Supabase |
| `VITE_SUPABASE_ANON_KEY` | Non* | Clé publique anon Supabase |

*Sans ces variables, l'app tourne en mode démo avec des données locales.

---

## Structure du projet

```
src/
├── types/
│   └── cabane.ts           # Types TypeScript (Cabane, FilterType…)
├── lib/
│   ├── supabase.ts         # Client Supabase
│   ├── geocoding.ts        # Géocodage Nominatim
│   └── mockData.ts         # Données de démo
├── hooks/
│   ├── useCabanes.ts       # CRUD cabanes (Supabase ou mock)
│   └── useGeolocation.ts   # Géolocalisation navigateur
├── components/
│   ├── Header.tsx           # Header + compteur + CTA
│   ├── HeroBackground.tsx   # Fond animé (éléments flottants)
│   ├── SuccessAnimation.tsx # Confettis après ajout
│   ├── Map/
│   │   ├── MapView.tsx      # Conteneur Leaflet
│   │   ├── markers.ts       # Icônes SVG personnalisées
│   │   ├── MapFilters.tsx   # Filtres flottants (Tous/Livres/Dons/Mixte)
│   │   └── CabanePopup.tsx  # Popup au clic sur un marqueur
│   ├── Sidebar/
│   │   ├── Sidebar.tsx      # Panel liste des cabanes
│   │   └── CabaneCard.tsx   # Carte individuelle
│   └── AddCabane/
│       ├── AddCabaneModal.tsx  # Modal d'ajout
│       └── TypeSelector.tsx    # Sélecteur visuel du type
├── App.tsx                  # Composant racine
├── main.tsx                 # Point d'entrée
└── index.css                # Styles globaux + overrides Leaflet
supabase/
└── schema.sql               # Schéma PostgreSQL complet
```

---

## Fonctionnalités

- **Carte interactive** centrée sur la France, fond CartoDB Voyager
- **3 types de marqueurs SVG** : livres (bleu), dons (ambre), mixte (violet)
- **Filtres animés** par type (Tous / Livres / Dons / Mixte)
- **Formulaire d'ajout** avec géocodage automatique ou clic sur la carte
- **Géolocalisation** pour afficher les cabanes proches triées par distance
- **Partage par URL** (`?lat=…&lng=…`) pour pointer vers une cabane
- **Confettis** et message de remerciement après ajout
- **Mode démo** sans backend

---

## Déploiement

```bash
npm run build
# Les fichiers sont dans dist/
```

Compatible Netlify, Vercel, GitHub Pages. Ajoutez les variables d'environnement dans les paramètres de la plateforme.

---

## Licence

MIT — Partagez, adaptez, améliorez ! 🌿
