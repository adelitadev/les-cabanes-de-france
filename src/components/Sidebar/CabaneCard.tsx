import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import { Cabane } from '../../types/cabane';

interface CabaneCardProps {
  cabane: Cabane;
  distance?: number | null;
  onClick: () => void;
  index?: number;
}

const TYPE_CONFIG = {
  livres: {
    badge: 'text-sky-700',
    badgeBg: 'rgba(14,165,233,0.12)',
    badgeBorder: 'rgba(14,165,233,0.25)',
    dot: 'bg-sky-400',
    icon: (
      <svg viewBox="0 0 20 20" width="13" height="13" fill="none">
        <path d="M3 4C3 3.4 3.4 3 4 3H9V17H4C3.4 17 3 16.6 3 16V4Z" fill="currentColor" opacity="0.8"/>
        <path d="M11 3H16C16.6 3 17 3.4 17 4V16C17 16.6 16.6 17 16 17H11V3Z" fill="currentColor" opacity="0.8"/>
        <rect x="9" y="2.5" width="2" height="15" rx="1" fill="currentColor"/>
      </svg>
    ),
    label: 'Livres',
  },
  dons: {
    badge: 'text-amber-700',
    badgeBg: 'rgba(245,158,11,0.12)',
    badgeBorder: 'rgba(245,158,11,0.25)',
    dot: 'bg-amber-400',
    icon: (
      <svg viewBox="0 0 20 20" width="13" height="13" fill="none">
        <rect x="3" y="9" width="14" height="9" rx="1.5" fill="currentColor" opacity="0.8"/>
        <rect x="2.5" y="6" width="15" height="4" rx="1" fill="currentColor" opacity="0.9"/>
        <rect x="9" y="5.5" width="2" height="13" rx="1" fill="white" opacity="0.7"/>
        <path d="M10 6C10 6 8 4 7 5C6 6 7.5 7 10 6Z" fill="white" opacity="0.8"/>
        <path d="M10 6C10 6 12 4 13 5C14 6 12.5 7 10 6Z" fill="white" opacity="0.8"/>
      </svg>
    ),
    label: 'Dons',
  },
  mixte: {
    badge: 'text-violet-700',
    badgeBg: 'rgba(139,92,246,0.12)',
    badgeBorder: 'rgba(139,92,246,0.25)',
    dot: 'bg-violet-400',
    icon: (
      <svg viewBox="0 0 20 20" width="13" height="13" fill="none">
        <path d="M3 3.5C3 2.9 3.4 2.5 4 2.5H9.5V15.5H4C3.4 15.5 3 15.1 3 14.5V3.5Z" fill="currentColor" opacity="0.7"/>
        <path d="M10.5 2.5H16C16.6 2.5 17 2.9 17 3.5V14.5C17 15.1 16.6 15.5 16 15.5H10.5V2.5Z" fill="currentColor" opacity="0.7"/>
        <rect x="9" y="2" width="2" height="14" rx="1" fill="currentColor"/>
        <path d="M10 9.5C10 9.5 8.5 8 7.5 8.5C6.5 9 7 10.5 10 12.5C13 10.5 13.5 9 12.5 8.5C11.5 8 10 9.5 10 9.5Z" fill="white" opacity="0.85"/>
      </svg>
    ),
    label: 'Livres & Dons',
  },
};

function formatDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return 'Hier';
  if (days < 7) return `Il y a ${days} j.`;
  if (days < 30) return `Il y a ${Math.floor(days / 7)} sem.`;
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function formatDistance(m: number): string {
  if (m < 100) return `${Math.round(m)} m`;
  if (m < 1000) return `${Math.round(m / 10) * 10} m`;
  return `${(m / 1000).toFixed(1)} km`;
}

export default function CabaneCard({ cabane, distance, onClick, index = 0 }: CabaneCardProps) {
  const cfg = TYPE_CONFIG[cabane.type];

  return (
    <motion.button
      data-fade
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), type: 'spring', stiffness: 200, damping: 22 }}
      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.10)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full text-left rounded-2xl overflow-hidden group transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.58)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.55)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      {/* Barre colorée en haut */}
      <div
        className={`h-0.5 w-full ${cfg.dot}`}
        style={{ background: cfg.badgeBg.replace('0.12', '0.6') }}
      />

      <div className="p-3">
        <div className="flex items-start gap-2 mb-1.5">
          {/* Badge type */}
          <span
            className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.badge}`}
            style={{ background: cfg.badgeBg, border: `1px solid ${cfg.badgeBorder}` }}
          >
            <span className={cfg.badge}>{cfg.icon}</span>
            {cfg.label}
          </span>
          {distance != null && (
            <span className="ml-auto text-[11px] font-semibold text-moss-600 bg-moss-50/80 px-2 py-0.5 rounded-full flex-shrink-0">
              {formatDistance(distance)}
            </span>
          )}
        </div>

        <h3 className="font-display font-semibold text-gray-800 text-sm leading-tight group-hover:text-moss-800 transition-colors mb-1">
          {cabane.nom}
        </h3>

        <div className="flex items-center justify-between text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <MapPin size={9} strokeWidth={2} />
            {cabane.ville || '—'}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={9} strokeWidth={2} />
            {formatDate(cabane.created_at)}
          </span>
        </div>

        {cabane.description && (
          <p className="text-[11px] text-gray-500 mt-2 line-clamp-2 leading-relaxed border-t border-gray-100/80 pt-1.5">
            {cabane.description}
          </p>
        )}
      </div>
    </motion.button>
  );
}
