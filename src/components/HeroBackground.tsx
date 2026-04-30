import React from 'react';

/* ------------------------------------------------------------------
   Silhouettes SVG de livres et pages qui dérivent du bas vers le haut.
   Chaque item a sa propre vitesse, opacité et rotation aléatoire.
------------------------------------------------------------------ */

interface BookItem {
  id: number;
  shape: 'open' | 'closed' | 'page' | 'stack';
  left: string;
  delay: string;
  duration: string;
  scale: number;
  opacity: number;
  tint: string;
}

const BOOKS: BookItem[] = [
  { id: 1,  shape: 'open',   left: '5%',  delay: '0s',   duration: '28s', scale: 0.9, opacity: 0.18, tint: '#fff' },
  { id: 2,  shape: 'page',   left: '12%', delay: '4s',   duration: '22s', scale: 0.7, opacity: 0.14, tint: '#f0fdf4' },
  { id: 3,  shape: 'closed', left: '20%', delay: '8s',   duration: '32s', scale: 1.1, opacity: 0.16, tint: '#fff' },
  { id: 4,  shape: 'stack',  left: '30%', delay: '2s',   duration: '26s', scale: 0.8, opacity: 0.12, tint: '#fef9c3' },
  { id: 5,  shape: 'open',   left: '40%', delay: '12s',  duration: '24s', scale: 1.3, opacity: 0.20, tint: '#fff' },
  { id: 6,  shape: 'page',   left: '50%', delay: '6s',   duration: '19s', scale: 0.6, opacity: 0.13, tint: '#f0fdf4' },
  { id: 7,  shape: 'closed', left: '58%', delay: '16s',  duration: '30s', scale: 1.0, opacity: 0.17, tint: '#fff' },
  { id: 8,  shape: 'open',   left: '67%', delay: '10s',  duration: '25s', scale: 0.85,opacity: 0.15, tint: '#fef9c3' },
  { id: 9,  shape: 'page',   left: '75%', delay: '3s',   duration: '21s', scale: 0.65,opacity: 0.12, tint: '#fff' },
  { id: 10, shape: 'stack',  left: '83%', delay: '18s',  duration: '35s', scale: 1.2, opacity: 0.19, tint: '#f0fdf4' },
  { id: 11, shape: 'closed', left: '90%', delay: '7s',   duration: '27s', scale: 0.95,opacity: 0.14, tint: '#fff' },
  { id: 12, shape: 'open',   left: '25%', delay: '20s',  duration: '31s', scale: 1.05,opacity: 0.16, tint: '#fef9c3' },
  { id: 13, shape: 'page',   left: '47%', delay: '14s',  duration: '20s', scale: 0.55,opacity: 0.11, tint: '#fff' },
  { id: 14, shape: 'stack',  left: '63%', delay: '1s',   duration: '29s', scale: 0.9, opacity: 0.13, tint: '#f0fdf4' },
  { id: 15, shape: 'open',   left: '95%', delay: '9s',   duration: '23s', scale: 0.75,opacity: 0.15, tint: '#fff' },
];

/* SVG inline pour chaque forme */
function BookSVG({ shape, tint }: { shape: BookItem['shape']; tint: string }) {
  switch (shape) {
    case 'open':
      return (
        <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Livre ouvert vu de face */}
          <path d="M2 8C2 6.9 2.9 6 4 6H29C30.1 6 31 6.9 31 8V42C31 43.1 30.1 44 29 44H4C2.9 44 2 43.1 2 42V8Z" fill={tint} fillOpacity="0.9"/>
          <path d="M33 8C33 6.9 33.9 6 35 6H60C61.1 6 62 6.9 62 8V42C62 43.1 61.1 44 60 44H35C33.9 44 33 43.1 33 42V8Z" fill={tint} fillOpacity="0.9"/>
          {/* Spine central */}
          <rect x="29" y="4" width="6" height="42" rx="1" fill={tint} fillOpacity="0.7"/>
          {/* Lignes de texte gauche */}
          <line x1="8" y1="14" x2="25" y2="14" stroke={tint} strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="8" y1="19" x2="25" y2="19" stroke={tint} strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="8" y1="24" x2="25" y2="24" stroke={tint} strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="8" y1="29" x2="20" y2="29" stroke={tint} strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round"/>
          {/* Lignes de texte droite */}
          <line x1="39" y1="14" x2="56" y2="14" stroke={tint} strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="39" y1="19" x2="56" y2="19" stroke={tint} strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="39" y1="24" x2="56" y2="24" stroke={tint} strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="39" y1="29" x2="50" y2="29" stroke={tint} strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );

    case 'closed':
      return (
        <svg viewBox="0 0 32 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Dos du livre */}
          <rect x="2" y="2" width="28" height="40" rx="3" fill={tint} fillOpacity="0.85"/>
          {/* Spine */}
          <rect x="2" y="2" width="5" height="40" rx="2" fill={tint} fillOpacity="0.5"/>
          {/* Pages */}
          <rect x="7" y="4" width="22" height="36" rx="1" fill={tint} fillOpacity="0.3"/>
          {/* Titre simulé */}
          <rect x="10" y="12" width="14" height="2" rx="1" fill={tint} fillOpacity="0.6"/>
          <rect x="11" y="16" width="10" height="1.5" rx="0.75" fill={tint} fillOpacity="0.4"/>
        </svg>
      );

    case 'page':
      return (
        <svg viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Page qui s'envole, légèrement courbée */}
          <path d="M4 2C4 2 6 4 18 3C30 2 34 6 34 6L30 44C30 44 28 46 16 46C4 46 2 42 2 42L4 2Z"
                fill={tint} fillOpacity="0.8"/>
          {/* Pli en haut à droite */}
          <path d="M26 2L34 10L26 10L26 2Z" fill={tint} fillOpacity="0.5"/>
          {/* Lignes */}
          <line x1="8" y1="16" x2="26" y2="15" stroke={tint} strokeOpacity="0.45" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="8" y1="21" x2="27" y2="20" stroke={tint} strokeOpacity="0.45" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="8" y1="26" x2="25" y2="25" stroke={tint} strokeOpacity="0.45" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="8" y1="31" x2="20" y2="30" stroke={tint} strokeOpacity="0.45" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      );

    case 'stack':
      return (
        <svg viewBox="0 0 48 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Pile de livres vue de côté */}
          <rect x="2"  y="28" width="44" height="8" rx="2" fill={tint} fillOpacity="0.85"/>
          <rect x="4"  y="19" width="40" height="9" rx="2" fill={tint} fillOpacity="0.75"/>
          <rect x="6"  y="11" width="36" height="8" rx="2" fill={tint} fillOpacity="0.65"/>
          <rect x="10" y="4"  width="28" height="7" rx="2" fill={tint} fillOpacity="0.55"/>
          {/* Contours subtils */}
          <rect x="2"  y="28" width="44" height="8" rx="2" stroke={tint} strokeOpacity="0.3" strokeWidth="0.5"/>
          <rect x="4"  y="19" width="40" height="9" rx="2" stroke={tint} strokeOpacity="0.3" strokeWidth="0.5"/>
          <rect x="6"  y="11" width="36" height="8" rx="2" stroke={tint} strokeOpacity="0.3" strokeWidth="0.5"/>
        </svg>
      );
  }
}

export default function HeroBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{
        background:
          'linear-gradient(155deg, #2d5a3d 0%, #3d7a52 18%, #5a9e6f 38%, #8bbf85 58%, #c8ddb0 75%, #e8dfc4 88%, #f4ece0 100%)',
      }}
    >
      {/* Grille de points subtile - texture papier */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Lueurs ambiantes */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 60% 40% at 15% 85%, rgba(255,255,255,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 50% 35% at 85% 15%, rgba(255,255,255,0.12) 0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 50% 50%, rgba(255,253,235,0.08) 0%, transparent 50%)
          `,
        }}
      />

      {/* Livres flottants */}
      {BOOKS.map((book) => (
        <div
          key={book.id}
          className="absolute bottom-0"
          style={{
            left: book.left,
            width: `${book.scale * 64}px`,
            animationName: book.shape === 'page' ? 'floatUpWobble' : 'floatUpSpin',
            animationDuration: book.duration,
            animationDelay: book.delay,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            opacity: 0,
          }}
        >
          <div style={{ opacity: book.opacity }}>
            <BookSVG shape={book.shape} tint={book.tint} />
          </div>
        </div>
      ))}

      <style>{`
        @keyframes floatUpSpin {
          0%   { transform: translateY(0)      rotate(-8deg)  scale(1);    opacity: 0; }
          5%   {                                                             opacity: 1; }
          30%  { transform: translateY(-30vh)  rotate(4deg)   scale(1.05); }
          60%  { transform: translateY(-65vh)  rotate(-6deg)  scale(0.98); }
          90%  {                                                             opacity: 1; }
          100% { transform: translateY(-108vh) rotate(10deg)  scale(0.9);  opacity: 0; }
        }
        @keyframes floatUpWobble {
          0%   { transform: translateY(0)      rotate(-15deg) scale(1);    opacity: 0; }
          5%   {                                                             opacity: 1; }
          25%  { transform: translateY(-25vh)  rotate(12deg)  scale(1.08); }
          50%  { transform: translateY(-52vh)  rotate(-10deg) scale(0.95); }
          75%  { transform: translateY(-78vh)  rotate(8deg)   scale(1.02); }
          95%  {                                                             opacity: 0.8; }
          100% { transform: translateY(-108vh) rotate(-5deg)  scale(0.88); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
