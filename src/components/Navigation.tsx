import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { PageId } from '../types/cabane';
import { useNavigation } from '../context/NavigationContext';

const NAV_ITEMS: { id: PageId; emoji: string; label: string }[] = [
  { id: 'accueil',       emoji: '🏠', label: 'Accueil'        },
  { id: 'carte',         emoji: '🗺️', label: 'Carte'          },
  { id: 'cabanes',       emoji: '📖', label: 'Les Cabanes'    },
  { id: 'philosophie',   emoji: '🌿', label: 'La Philosophie' },
  { id: 'coup-de-coeur', emoji: '🏅', label: 'Coup de cœur'  },
];

export default function Navigation() {
  const { page, navigate } = useNavigation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (id: PageId) => {
    navigate(id);
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        className="relative z-30 flex-shrink-0"
        style={{
          background: 'rgba(255,255,255,0.78)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          borderBottom: '1px solid rgba(255,255,255,0.55)',
          boxShadow: '0 2px 24px rgba(0,0,0,0.07)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

          {/* ── Logo ── */}
          <button
            onClick={() => go('accueil')}
            className="flex items-center gap-2.5 flex-shrink-0 group"
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow"
                 style={{ background: 'linear-gradient(135deg,#4a7c59,#2d5a3d)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L3 9.5V21H9V15H15V21H21V9.5L12 3Z" stroke="white" strokeWidth="1.6" strokeLinejoin="round" fill="white" fillOpacity="0.2"/>
                <path d="M9 12C9 12 10.5 11.5 12 12C13.5 11.5 15 12 15 12V17C15 17 13.5 16.5 12 17C10.5 16.5 9 17 9 17V12Z" fill="white" fillOpacity="0.9"/>
                <line x1="12" y1="12" x2="12" y2="17" stroke="#4a7c59" strokeWidth="0.8"/>
              </svg>
            </div>
            <span className="font-display font-bold text-moss-900 text-[15px] hidden sm:block leading-tight">
              Les Cabanes<br/>
              <span className="text-moss-600 text-[11px] font-medium tracking-wide">de France</span>
            </span>
          </button>

          {/* ── Liens desktop ── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = page === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors duration-150 ${
                    active ? 'text-moss-800' : 'text-gray-500 hover:text-gray-800 hover:bg-white/60'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: 'rgba(74,124,89,0.10)', border: '1px solid rgba(74,124,89,0.18)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative text-base leading-none">{item.emoji}</span>
                  <span className="relative">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* ── Burger mobile ── */}
          <button
            className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-white/60 transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* ── Menu mobile overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm"
            />
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 35 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 flex flex-col py-6 px-5 gap-2"
              style={{
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderLeft: '1px solid rgba(255,255,255,0.6)',
                boxShadow: '-12px 0 40px rgba(0,0,0,0.12)',
              }}
            >
              {/* En-tête drawer */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-display font-bold text-moss-800 text-lg">Navigation</span>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-full hover:bg-gray-100">
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              {NAV_ITEMS.map((item, i) => {
                const active = page === item.id;
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => go(item.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-sm font-semibold transition-all ${
                      active
                        ? 'text-moss-800'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    style={active ? { background: 'rgba(74,124,89,0.10)', border: '1px solid rgba(74,124,89,0.18)' } : {}}
                  >
                    <span className="text-xl">{item.emoji}</span>
                    {item.label}
                  </motion.button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
