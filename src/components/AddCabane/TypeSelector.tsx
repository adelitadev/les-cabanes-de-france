import React from 'react';
import { motion } from 'framer-motion';
import { CabaneType } from '../../types/cabane';

interface TypeSelectorProps {
  value: CabaneType;
  onChange: (type: CabaneType) => void;
}

const TYPES: { value: CabaneType; emoji: string; label: string; sub: string; ring: string; bg: string }[] = [
  {
    value: 'livres',
    emoji: '📚',
    label: 'Livres',
    sub: 'Boîte à livres',
    ring: 'ring-sky-400',
    bg: 'bg-sky-50',
  },
  {
    value: 'dons',
    emoji: '🎁',
    label: 'Dons',
    sub: 'Objets & nourriture',
    ring: 'ring-amber-400',
    bg: 'bg-amber-50',
  },
  {
    value: 'mixte',
    emoji: '✨',
    label: 'Les deux',
    sub: 'Livres & dons',
    ring: 'ring-purple-400',
    bg: 'bg-purple-50',
  },
];

export default function TypeSelector({ value, onChange }: TypeSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {TYPES.map((t) => {
        const selected = value === t.value;
        return (
          <motion.button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            whileTap={{ scale: 0.95 }}
            className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
              selected
                ? `${t.bg} border-transparent ring-2 ${t.ring} shadow-sm`
                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span className="text-2xl">{t.emoji}</span>
            <span className={`text-xs font-bold ${selected ? 'text-gray-800' : 'text-gray-600'}`}>
              {t.label}
            </span>
            <span className="text-[10px] text-gray-400 leading-tight text-center">{t.sub}</span>
            {selected && (
              <motion.div
                layoutId="type-check"
                className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-moss-500 flex items-center justify-center"
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
