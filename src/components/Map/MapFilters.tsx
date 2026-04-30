import React from 'react';
import { motion } from 'framer-motion';
import { FilterType } from '../../types/cabane';

interface MapFiltersProps {
  active: FilterType;
  onChange: (filter: FilterType) => void;
}

const FILTERS: {
  value: FilterType;
  label: string;
  icon: React.ReactNode;
  activeGradient: string;
}[] = [
  {
    value: 'tous',
    label: 'Toutes',
    icon: (
      <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor">
        <circle cx="5" cy="5" r="3" opacity="0.6"/>
        <circle cx="11" cy="5" r="3" opacity="0.6"/>
        <circle cx="8" cy="11" r="3" opacity="0.6"/>
      </svg>
    ),
    activeGradient: 'linear-gradient(135deg, #4a7c59, #2d5a3d)',
  },
  {
    value: 'livres',
    label: 'Livres',
    icon: (
      <svg viewBox="0 0 16 16" width="13" height="13" fill="none">
        <rect x="1.5" y="1.5" width="5" height="13" rx="1" fill="currentColor" opacity="0.85"/>
        <rect x="9.5" y="1.5" width="5" height="13" rx="1" fill="currentColor" opacity="0.85"/>
        <rect x="6"   y="1"   width="4" height="14" rx="1.5" fill="currentColor"/>
      </svg>
    ),
    activeGradient: 'linear-gradient(135deg, #38bdf8, #0284c7)',
  },
  {
    value: 'dons',
    label: 'Dons',
    icon: (
      <svg viewBox="0 0 16 16" width="13" height="13" fill="none">
        <rect x="1" y="7.5" width="14" height="7.5" rx="1.5" fill="currentColor" opacity="0.8"/>
        <rect x="0.5" y="4.5" width="15" height="4" rx="1" fill="currentColor"/>
        <rect x="7" y="4" width="2" height="11" rx="1" fill="white" opacity="0.65"/>
        <path d="M8 4.5C8 4.5 6 2 4.5 3C3 4 5 5.5 8 4.5Z" fill="white" opacity="0.65"/>
        <path d="M8 4.5C8 4.5 10 2 11.5 3C13 4 11 5.5 8 4.5Z" fill="white" opacity="0.65"/>
      </svg>
    ),
    activeGradient: 'linear-gradient(135deg, #fbbf24, #d97706)',
  },
  {
    value: 'mixte',
    label: 'Mixte',
    icon: (
      <svg viewBox="0 0 16 16" width="13" height="13" fill="none">
        <rect x="0.5" y="1.5" width="7" height="10" rx="1" fill="currentColor" opacity="0.7"/>
        <rect x="0.5" y="1.5" width="2.5" height="10" rx="1" fill="currentColor" opacity="0.45"/>
        <path d="M8 7.5C8 7.5 6.5 6 5.5 6.5C4.5 7 5 8.5 8 10.5C11 8.5 11.5 7 10.5 6.5C9.5 6 8 7.5 8 7.5Z" fill="currentColor" opacity="0.9"/>
        <path d="M11.5 1L12.8 3L15 2.5L13.5 4L14.5 6L12.5 5L11 6.5L11.5 4.5L10 3.5L12 3L11.5 1Z" fill="currentColor" opacity="0.8"/>
      </svg>
    ),
    activeGradient: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
  },
];

export default function MapFilters({ active, onChange }: MapFiltersProps) {
  return (
    <div
      className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-1 px-1.5 py-1.5 rounded-2xl"
      style={{
        background: 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.6)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      {FILTERS.map((f) => {
        const isActive = active === f.value;
        return (
          <motion.button
            key={f.value}
            onClick={() => onChange(f.value)}
            whileTap={{ scale: 0.92 }}
            className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[13px] font-semibold transition-colors duration-150"
            style={
              isActive
                ? {
                    background: f.activeGradient,
                    color: 'white',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.16)',
                  }
                : {
                    color: '#6b7280',
                  }
            }
          >
            <span style={{ color: isActive ? 'rgba(255,255,255,0.9)' : '#9ca3af' }}>
              {f.icon}
            </span>
            {f.label}
          </motion.button>
        );
      })}
    </div>
  );
}
