export interface GeocodingResult {
  lat: number;
  lon: number;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
    country?: string;
    postcode?: string;
    suburb?: string;
    quarter?: string;
    neighbourhood?: string;
    road?: string;
  };
}

/* Tableau de correspondances noms anglais → français pour les régions
   et entités géographiques que Nominatim peut retourner en anglais. */
const FR_OVERRIDES: Record<string, string> = {
  'Brittany': 'Bretagne',
  'Normandy': 'Normandie',
  'Occitanie': 'Occitanie',
  'New Aquitaine': 'Nouvelle-Aquitaine',
  'Hauts-de-France': 'Hauts-de-France',
  'Auvergne-Rhône-Alpes': 'Auvergne-Rhône-Alpes',
  'Provence-Alpes-Côte d\'Azur': 'Provence-Alpes-Côte d\'Azur',
  'Grand Est': 'Grand Est',
  'Centre-Val de Loire': 'Centre-Val de Loire',
  'Île-de-France': 'Île-de-France',
  'Corsica': 'Corse',
  'Pays de la Loire': 'Pays de la Loire',
  'Bourgogne-Franche-Comté': 'Bourgogne-Franche-Comté',
  'Metropolitan France': 'France métropolitaine',
  'France': 'France',
};

function frenchify(name: string): string {
  return FR_OVERRIDES[name] ?? name;
}

const NOMINATIM_HEADERS = {
  'Accept-Language': 'fr,fr-FR;q=0.9',
  'User-Agent': 'LesCabanesDeFrance/1.0 (contact@cabanes-de-france.fr)',
};

export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  try {
    const encoded = encodeURIComponent(`${address}, France`);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=1&addressdetails=1&countrycodes=fr&accept-language=fr`,
      { headers: NOMINATIM_HEADERS }
    );
    const data = await res.json();
    if (!data || data.length === 0) return null;
    return normalizeResult(data[0]);
  } catch {
    return null;
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<GeocodingResult | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&accept-language=fr`,
      { headers: NOMINATIM_HEADERS }
    );
    const data = await res.json();
    if (!data || data.error) return null;
    return normalizeResult(data, lat, lon);
  } catch {
    return null;
  }
}

function normalizeResult(data: Record<string, unknown>, lat?: number, lon?: number): GeocodingResult {
  const addr = (data.address as Record<string, string>) || {};

  // Appliquer les surcharges françaises sur chaque champ
  const normalized: GeocodingResult['address'] = {};
  for (const [k, v] of Object.entries(addr)) {
    (normalized as Record<string, string>)[k] = frenchify(v);
  }

  return {
    lat: lat ?? parseFloat(data.lat as string),
    lon: lon ?? parseFloat(data.lon as string),
    display_name: data.display_name as string,
    address: normalized,
  };
}

/* Extrait le nom de ville en français — préfère les noms les plus précis */
export function extractCity(result: GeocodingResult): string {
  const a = result.address;
  if (!a) return '';
  // Ordre de préférence : ville > quartier > commune > canton > département
  const raw =
    a.city ||
    a.town ||
    a.village ||
    a.municipality ||
    a.suburb ||
    a.quarter ||
    a.county ||
    a.state ||
    '';
  return frenchify(raw);
}

/* Construit une adresse courte lisible en français */
export function formatShortAddress(result: GeocodingResult): string {
  const a = result.address;
  if (!a) return result.display_name;

  const city = extractCity(result);
  const postcode = a.postcode ? `${a.postcode} ` : '';
  const road = a.road ? `${a.road}, ` : '';

  if (city) return `${road}${postcode}${city}`;
  return result.display_name.split(',').slice(0, 3).join(',');
}
