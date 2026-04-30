import React, { useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Locate, Loader2, ChevronRight, ChevronLeft, MapPin } from 'lucide-react';
import { Cabane } from '../../types/cabane';
import { UserLocation } from '../../hooks/useGeolocation';
import CabaneCard from './CabaneCard';

interface SidebarProps {
  cabanes: Cabane[];
  userLocation: UserLocation | null;
  locating: boolean;
  onLocate: () => void;
  onCabaneClick: (cabane: Cabane) => void;
  isOpen: boolean;
  onToggle: () => void;
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function Sidebar({
  cabanes, userLocation, locating, onLocate, onCabaneClick, isOpen, onToggle,
}: SidebarProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const cabanesWithDistance = useMemo(() => {
    return cabanes
      .map((c) => ({
        cabane: c,
        distance: userLocation
          ? haversineDistance(userLocation.lat, userLocation.lng, c.latitude, c.longitude)
          : null,
      }))
      .sort((a, b) => {
        if (a.distance != null && b.distance != null) return a.distance - b.distance;
        return new Date(b.cabane.created_at).getTime() - new Date(a.cabane.created_at).getTime();
      });
  }, [cabanes, userLocation]);

  return (
    <>
      {/* Bouton toggle */}
      <motion.button
        onClick={onToggle}
        animate={{ right: isOpen ? 320 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute top-1/2 -translate-y-1/2 z-[1001] hidden md:flex items-center justify-center w-6 h-14 rounded-l-xl text-gray-500 hover:text-moss-700 transition-colors"
        style={{
          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.55)',
          borderRight: 'none',
          boxShadow: '-4px 0 16px rgba(0,0,0,0.08)',
        }}
      >
        {isOpen ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </motion.button>

      {/* Panel principal */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="sidebar"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
            className="glass-panel absolute right-0 top-0 bottom-0 w-80 z-[1000] flex flex-col"
          >
            {/* ── En-tête ── */}
            <div
              className="p-4 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.4)' }}
            >
              {/* Titre avec compteur */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="font-display font-bold text-gray-800 text-base">
                    {userLocation ? '📍 À proximité' : '✨ Découvrir'}
                  </h2>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {userLocation ? 'Triées par distance' : 'Les plus récentes en premier'}
                  </p>
                </div>
                <div
                  className="flex flex-col items-center px-3 py-1.5 rounded-xl text-center"
                  style={{ background: 'rgba(74,124,89,0.08)', border: '1px solid rgba(74,124,89,0.15)' }}
                >
                  <span className="font-bold text-moss-700 text-lg leading-none">{cabanes.length}</span>
                  <span className="text-[9px] text-moss-500 uppercase tracking-wider font-semibold">
                    cabane{cabanes.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Bouton localisation */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onLocate}
                disabled={locating}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                style={{
                  background: userLocation
                    ? 'rgba(74,124,89,0.12)'
                    : 'linear-gradient(135deg, rgba(74,124,89,0.15), rgba(74,124,89,0.08))',
                  border: '1px solid rgba(74,124,89,0.25)',
                  color: '#2d5a3d',
                }}
              >
                {locating ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Locate size={14} strokeWidth={2} />
                )}
                {locating
                  ? 'Localisation…'
                  : userLocation
                  ? 'Actualiser ma position'
                  : 'Me localiser'}
              </motion.button>
            </div>

            {/* ── Liste scrollable ── */}
            <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
              {cabanesWithDistance.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="text-5xl mb-3">🏡</div>
                  <p className="font-display font-semibold text-gray-500 text-sm">
                    Aucune cabane encore
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Soyez le premier à en ajouter une !
                  </p>
                </motion.div>
              ) : (
                cabanesWithDistance.map(({ cabane, distance }, i) => (
                  <CabaneCard
                    key={cabane.id}
                    cabane={cabane}
                    distance={distance}
                    index={i}
                    onClick={() => onCabaneClick(cabane)}
                  />
                ))
              )}
            </div>

            {/* ── Pied — légende types ── */}
            <div
              className="px-4 py-3 flex-shrink-0 flex items-center justify-center gap-4"
              style={{ borderTop: '1px solid rgba(255,255,255,0.4)' }}
            >
              {[
                { color: 'bg-sky-400',    label: 'Livres' },
                { color: 'bg-amber-400',  label: 'Dons'   },
                { color: 'bg-violet-400', label: 'Mixte'  },
              ].map((t) => (
                <span key={t.label} className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                  <span className={`w-2 h-2 rounded-full ${t.color}`} />
                  {t.label}
                </span>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
