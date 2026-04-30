import React from 'react';
import { Cabane } from '../../types/cabane';
import { AlertTriangle, Calendar, User, Share2 } from 'lucide-react';

interface CabanePopupProps {
  cabane: Cabane;
  onReport: (id: string) => void;
}

const TYPE_CONFIG = {
  livres: {
    label: 'Cabane à livres',
    gradient: 'from-sky-400 to-cyan-500',
    badgeBg: 'rgba(14,165,233,0.10)',
    badgeColor: '#0284c7',
    badgeBorder: 'rgba(14,165,233,0.2)',
    icon: '📚',
  },
  dons: {
    label: 'Cabane à dons',
    gradient: 'from-amber-400 to-orange-400',
    badgeBg: 'rgba(245,158,11,0.10)',
    badgeColor: '#b45309',
    badgeBorder: 'rgba(245,158,11,0.2)',
    icon: '🎁',
  },
  mixte: {
    label: 'Livres & Dons',
    gradient: 'from-violet-400 to-purple-500',
    badgeBg: 'rgba(139,92,246,0.10)',
    badgeColor: '#7c3aed',
    badgeBorder: 'rgba(139,92,246,0.2)',
    icon: '✨',
  },
};

export default function CabanePopup({ cabane, onReport }: CabanePopupProps) {
  const cfg = TYPE_CONFIG[cabane.type];
  const date = new Date(cabane.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const shareUrl = `${window.location.origin}${window.location.pathname}?lat=${cabane.latitude}&lng=${cabane.longitude}&id=${cabane.id}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: cabane.nom, url: shareUrl });
      } catch { /* annulé par l'utilisateur */ }
    } else {
      await navigator.clipboard?.writeText(shareUrl);
    }
  };

  return (
    <div className="w-64 font-body">
      {/* Bandeau coloré en haut */}
      <div className={`-mx-4 -mt-3 mb-3 h-1.5 bg-gradient-to-r ${cfg.gradient} rounded-t-lg`} />

      {/* Photo optionnelle */}
      {cabane.photo_url && (
        <div className="-mx-4 mb-3 overflow-hidden h-28">
          <img src={cabane.photo_url} alt={cabane.nom} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Badge type */}
      <span
        className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full mb-2"
        style={{
          background: cfg.badgeBg,
          color: cfg.badgeColor,
          border: `1px solid ${cfg.badgeBorder}`,
        }}
      >
        {cfg.icon} {cfg.label}
      </span>

      {/* Nom */}
      <h3 className="font-display font-bold text-gray-900 text-[15px] leading-tight mb-0.5">
        {cabane.nom}
      </h3>

      {/* Ville */}
      {cabane.ville && (
        <p className="text-xs text-gray-400 mb-2.5">📍 {cabane.ville}</p>
      )}

      {/* Description */}
      {cabane.description && (
        <p className="text-[12px] text-gray-600 leading-relaxed mb-3 pb-3"
           style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          {cabane.description}
        </p>
      )}

      {/* Meta contrib / date */}
      <div className="flex items-center justify-between text-[11px] text-gray-400 mb-3">
        <span className="flex items-center gap-1 font-medium">
          <User size={10} strokeWidth={2} />
          {cabane.contributeur}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={10} strokeWidth={2} />
          {date}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-semibold py-2 rounded-xl transition-colors"
          style={{
            background: 'rgba(74,124,89,0.08)',
            border: '1px solid rgba(74,124,89,0.18)',
            color: '#2d5a3d',
          }}
        >
          <Share2 size={11} />
          Partager
        </button>
        <button
          onClick={() => onReport(cabane.id)}
          className="flex items-center gap-1.5 text-[11px] font-semibold py-2 px-3 rounded-xl transition-colors"
          style={{
            background: 'rgba(239,68,68,0.07)',
            border: '1px solid rgba(239,68,68,0.15)',
            color: '#dc2626',
          }}
        >
          <AlertTriangle size={11} />
          Signaler
        </button>
      </div>
    </div>
  );
}
