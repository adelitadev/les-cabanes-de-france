export type CabaneType = 'livres' | 'dons' | 'mixte';
export type FilterType = 'tous' | 'livres' | 'dons' | 'mixte';
export type PageId = 'accueil' | 'carte' | 'cabanes' | 'philosophie' | 'coup-de-coeur';

export interface Cabane {
  id: string;
  nom: string;
  type: CabaneType;
  description: string;
  latitude: number;
  longitude: number;
  ville: string;
  region?: string;
  photo_url?: string | null;
  contributeur: string;
  signalements: number;
  featured?: boolean;
  created_at: string;
}

export interface NewCabane {
  nom: string;
  type: CabaneType;
  description: string;
  latitude: number;
  longitude: number;
  ville: string;
  region?: string;
  photo_url?: string | null;
  contributeur: string;
}
