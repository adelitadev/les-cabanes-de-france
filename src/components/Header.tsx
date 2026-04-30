import React from 'react';
import { motion, useSpring, useMotionValue, animate } from 'framer-motion';
import { Plus, BookOpen } from 'lucide-react';
import { useEffect } from 'react';

interface HeaderProps {
  count: number;
  onAddClick: () => void;
}

/* Compteur qui s'anime de l'ancienne valeur vers la nouvelle */
function AnimatedCounter({ value }: { value: number }) {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 18 });
  const [display, setDisplay] = React.useState(0);

  useEffect(() => {
    animate(motionVal, value, { duration: 1.2, ease: 'easeOut' });
  }, [value, motionVal]);

  useEffect(() => {
    const unsub = spring.on('change', (v) => setDisplay(Math.round(v)));
    return unsub;
  }, [spring]);

  return <>{display}</>;
}

export default function Header({ count, onAddClick }: HeaderProps) {
  return (
    <header className="relative z-30 glass-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-moss-500 to-moss-700 flex items-center justify-center shadow-md">
              <LogoSVG />
            </div>
            {/* Halo animé */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-moss-400"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <div className="min-w-0">
            <h1 className="font-display font-bold text-moss-900 text-lg leading-tight truncate tracking-tight">
              Les Cabanes de France
            </h1>
            <p className="text-xs text-moss-600/80 hidden sm:block font-medium">
              Carte collaborative · cabanes à dons &amp; à livres
            </p>
          </div>
        </div>

        {/* ── Compteur ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="hidden md:flex flex-col items-center px-6 py-2 rounded-2xl glass border-moss-200/50"
          style={{ background: 'rgba(74,124,89,0.08)', borderColor: 'rgba(74,124,89,0.2)' }}
        >
          <span className="text-3xl font-bold text-moss-700 leading-none tabular-nums">
            <AnimatedCounter value={count} />
          </span>
          <span className="text-[10px] text-moss-500 font-semibold tracking-widest uppercase mt-0.5">
            cabanes recensées
          </span>
        </motion.div>

        {/* ── CTA ── */}
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: '0 8px 30px rgba(74,124,89,0.4)' }}
          whileTap={{ scale: 0.96 }}
          onClick={onAddClick}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-sm text-white shadow-lg transition-shadow"
          style={{
            background: 'linear-gradient(135deg, #4a7c59 0%, #2d5a3d 100%)',
            boxShadow: '0 4px 16px rgba(45,90,61,0.35)',
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span className="hidden sm:inline">Ajouter une cabane</span>
          <span className="sm:hidden">Ajouter</span>
        </motion.button>
      </div>
    </header>
  );
}

function LogoSVG() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      {/* Maison */}
      <path d="M12 3L3 9.5V21H9V15H15V21H21V9.5L12 3Z" fill="white" fillOpacity="0.25"/>
      <path d="M12 3L3 9.5V21H9V15H15V21H21V9.5L12 3Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
      {/* Livre ouvert dans la maison */}
      <path d="M9 12C9 12 10.5 11.5 12 12C13.5 11.5 15 12 15 12V18C15 18 13.5 17.5 12 18C10.5 17.5 9 18 9 18V12Z"
            fill="white" fillOpacity="0.8"/>
      <line x1="12" y1="12" x2="12" y2="18" stroke="#4a7c59" strokeWidth="0.8"/>
    </svg>
  );
}
