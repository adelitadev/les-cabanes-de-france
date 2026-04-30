import L from 'leaflet';
import { CabaneType } from '../../types/cabane';

/* ------------------------------------------------------------------
   Marqueurs SVG expressifs — dessinés dans un viewBox 44x52
   avec pointe en bas centrée à (22, 50).
------------------------------------------------------------------ */

function createMarkerSVG(type: CabaneType): string {
  const configs: Record<CabaneType, { gradient: string[]; icon: string }> = {

    livres: {
      gradient: ['#38bdf8', '#0ea5e9'],
      icon: /* Livre ouvert clairement reconnaissable */ `
        <!-- Couverture gauche -->
        <path d="M10 14C10 12.9 10.9 12 12 12H20V32H12C10.9 32 10 31.1 10 30V14Z"
              fill="#e0f2fe" stroke="#0ea5e9" stroke-width="0.8"/>
        <!-- Couverture droite -->
        <path d="M22 12H30C31.1 12 32 12.9 32 14V30C32 31.1 31.1 32 30 32H22V12Z"
              fill="#e0f2fe" stroke="#0ea5e9" stroke-width="0.8"/>
        <!-- Spine central avec courbure -->
        <rect x="19.5" y="11" width="3" height="22" rx="1.5" fill="#0ea5e9" opacity="0.7"/>
        <!-- Pages gauches (lignes de texte) -->
        <line x1="13" y1="17" x2="19" y2="17" stroke="#7dd3fc" stroke-width="1" stroke-linecap="round"/>
        <line x1="13" y1="20" x2="18" y2="20" stroke="#7dd3fc" stroke-width="1" stroke-linecap="round"/>
        <line x1="13" y1="23" x2="19" y2="23" stroke="#7dd3fc" stroke-width="1" stroke-linecap="round"/>
        <line x1="13" y1="26" x2="17" y2="26" stroke="#7dd3fc" stroke-width="1" stroke-linecap="round"/>
        <!-- Pages droites -->
        <line x1="23" y1="17" x2="29" y2="17" stroke="#7dd3fc" stroke-width="1" stroke-linecap="round"/>
        <line x1="23" y1="20" x2="28" y2="20" stroke="#7dd3fc" stroke-width="1" stroke-linecap="round"/>
        <line x1="23" y1="23" x2="29" y2="23" stroke="#7dd3fc" stroke-width="1" stroke-linecap="round"/>
        <line x1="23" y1="26" x2="27" y2="26" stroke="#7dd3fc" stroke-width="1" stroke-linecap="round"/>
      `,
    },

    dons: {
      gradient: ['#fbbf24', '#f59e0b'],
      icon: /* Cadeau avec ruban et nœud */ `
        <!-- Boîte cadeau -->
        <rect x="10" y="20" width="22" height="14" rx="2" fill="#fef3c7" stroke="#f59e0b" stroke-width="0.8"/>
        <!-- Couvercle -->
        <rect x="9"  y="15" width="24" height="6"  rx="2" fill="#fde68a" stroke="#f59e0b" stroke-width="0.8"/>
        <!-- Ruban vertical -->
        <rect x="20" y="14" width="3"  height="21" rx="1" fill="#f59e0b" opacity="0.8"/>
        <!-- Ruban horizontal -->
        <rect x="9"  y="20" width="24" height="3"  rx="1" fill="#f59e0b" opacity="0.8"/>
        <!-- Nœud gauche -->
        <path d="M17 15C17 15 14 12 13 14C12 16 15 17 17 15Z" fill="#d97706"/>
        <!-- Nœud droite -->
        <path d="M25 15C25 15 28 12 29 14C30 16 27 17 25 15Z" fill="#d97706"/>
        <!-- Centre du nœud -->
        <circle cx="21" cy="15" r="2" fill="#f59e0b" stroke="#d97706" stroke-width="0.6"/>
      `,
    },

    mixte: {
      gradient: ['#a78bfa', '#8b5cf6'],
      icon: /* Livre avec cœur — symbolise générosité + culture */ `
        <!-- Livre fermé -->
        <rect x="11" y="11" width="20" height="22" rx="2.5" fill="#ede9fe" stroke="#8b5cf6" stroke-width="0.8"/>
        <!-- Dos du livre (spine) -->
        <rect x="11" y="11" width="4"  height="22" rx="2" fill="#8b5cf6" opacity="0.5"/>
        <!-- Pages (côté droit, effet éventail) -->
        <rect x="15" y="12" width="15" height="20" rx="1" fill="#ddd6fe" opacity="0.6"/>
        <rect x="16" y="13" width="14" height="18" rx="1" fill="#ede9fe" opacity="0.5"/>
        <!-- Cœur au centre du livre -->
        <path d="M21 19C21 19 19 17 17.5 17.5C16 18 16 20 17.5 21.5L21 25L24.5 21.5C26 20 26 18 24.5 17.5C23 17 21 19 21 19Z"
              fill="#8b5cf6" opacity="0.85"/>
        <!-- Étoile décorative (haut droite) -->
        <path d="M28 13L28.5 14.5L30 14.5L28.8 15.4L29.3 17L28 16L26.7 17L27.2 15.4L26 14.5L27.5 14.5Z"
              fill="#c4b5fd" opacity="0.9"/>
      `,
    },
  };

  const { gradient, icon } = configs[type];
  const filterId = `drop-${type}`;
  const gradId = `grad-${type}`;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="52" viewBox="0 0 44 52">
      <defs>
        <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${gradient[0]}"/>
          <stop offset="100%" stop-color="${gradient[1]}"/>
        </linearGradient>
        <filter id="${filterId}" x="-30%" y="-20%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.22)"/>
        </filter>
      </defs>

      <!-- Bulle teardrop avec dégradé -->
      <path d="M22 2C13.2 2 6 9.2 6 18C6 28.5 22 50 22 50C22 50 38 28.5 38 18C38 9.2 30.8 2 22 2Z"
            fill="url(#${gradId})" filter="url(#${filterId})"/>

      <!-- Cercle blanc intérieur -->
      <circle cx="22" cy="19" r="13" fill="white" fill-opacity="0.96"/>

      <!-- Ombre intérieure subtile -->
      <circle cx="22" cy="19" r="13" fill="none" stroke="${gradient[0]}" stroke-width="0.5" stroke-opacity="0.3"/>

      <!-- Icône -->
      ${icon}
    </svg>
  `;
}

const iconCache = new Map<CabaneType, L.DivIcon>();

export function getCabaneIcon(type: CabaneType): L.DivIcon {
  if (iconCache.has(type)) return iconCache.get(type)!;

  const icon = L.divIcon({
    html: createMarkerSVG(type),
    className: 'cabane-marker',
    iconSize: [44, 52],
    iconAnchor: [22, 50],
    popupAnchor: [0, -52],
  });
  iconCache.set(type, icon);
  return icon;
}
