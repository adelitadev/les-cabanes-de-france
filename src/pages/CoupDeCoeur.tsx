import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Heart, ArrowRight } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { Cabane } from '../types/cabane';

function useFade(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('fade-visible'); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
}

function FadeBlock({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useFade(ref as React.RefObject<HTMLElement>);
  return <div ref={ref} className={`fade-section ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

const TYPE_CFG = {
  livres: { bg: 'rgba(14,165,233,0.12)',  text: '#0284c7', border: 'rgba(14,165,233,0.22)', label: 'Livres',  emoji: '📚', dot: '#38bdf8'  },
  dons:   { bg: 'rgba(245,158,11,0.12)',  text: '#b45309', border: 'rgba(245,158,11,0.22)',  label: 'Dons',    emoji: '🎁', dot: '#fbbf24'  },
  mixte:  { bg: 'rgba(139,92,246,0.12)',  text: '#7c3aed', border: 'rgba(139,92,246,0.22)', label: 'Mixte',   emoji: '✨', dot: '#a78bfa'  },
};

/* Palettes de carte pour les coups de cœur */
const CARD_PALETTES = [
  { from: 'rgba(56,189,248,0.15)', to: 'rgba(255,255,255,0.65)', accent: '#0ea5e9' },
  { from: 'rgba(74,124,89,0.15)',  to: 'rgba(255,255,255,0.65)', accent: '#4a7c59' },
  { from: 'rgba(251,191,36,0.15)', to: 'rgba(255,255,255,0.65)', accent: '#f59e0b' },
  { from: 'rgba(139,92,246,0.15)', to: 'rgba(255,255,255,0.65)', accent: '#8b5cf6' },
];

function FeaturedCard({ cabane, index, onClick }: { cabane: Cabane; index: number; onClick: () => void }) {
  const cfg = TYPE_CFG[cabane.type];
  const pal = CARD_PALETTES[index % CARD_PALETTES.length];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 180, damping: 22 }}
      whileHover={{ y: -6, boxShadow: '0 20px 48px rgba(0,0,0,0.14)' }}
      onClick={onClick}
      className="group cursor-pointer rounded-3xl overflow-hidden transition-all duration-250"
      style={{
        background: `linear-gradient(135deg, ${pal.from} 0%, ${pal.to} 100%)`,
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid rgba(255,255,255,0.65)',
        boxShadow: '0 6px 28px rgba(0,0,0,0.09)',
      }}
    >
      {/* Bandeau coloré */}
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${pal.accent}, ${cfg.dot})` }} />

      <div className="p-6">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}>
            {cfg.emoji} {cfg.label}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(251,191,36,0.15)', color: '#b45309', border: '1px solid rgba(251,191,36,0.3)' }}>
            ❤️ Coup de cœur
          </span>
        </div>

        {/* Nom */}
        <h3 className="font-display font-bold text-gray-800 text-lg leading-tight mb-1 group-hover:text-moss-800 transition-colors">
          {cabane.nom}
        </h3>

        {/* Localisation */}
        <p className="flex items-center gap-1.5 text-[12px] text-gray-400 mb-4">
          <MapPin size={11} strokeWidth={2} />
          {cabane.ville}{cabane.region && ` · ${cabane.region}`}
        </p>

        {/* Description complète */}
        {cabane.description && (
          <p className="text-sm text-gray-600 leading-relaxed mb-5 pb-5"
             style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            {cabane.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-gray-400 font-medium">Proposé par {cabane.contributeur}</span>
          <span className="text-[12px] font-semibold text-moss-600 group-hover:underline flex items-center gap-1">
            Voir sur la carte <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </motion.article>
  );
}

interface Props {
  cabanes: ReturnType<typeof import('../hooks/useCabanes').useCabanes>;
}

export default function CoupDeCoeur({ cabanes: { cabanes, loading } }: Props) {
  const { navigate } = useNavigation();
  const featured = cabanes.filter((c) => c.featured);

  return (
    <div className="flex-1 overflow-y-auto">

      {/* ── Hero ── */}
      <div className="px-4 pt-16 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full mb-5"
               style={{ background: 'rgba(251,191,36,0.15)', color: '#b45309', border: '1px solid rgba(251,191,36,0.3)' }}>
            <Heart size={12} fill="currentColor" /> Sélection de la communauté
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-moss-900 mb-4 leading-tight">
            🏅 Coup de cœur
          </h1>
          <p className="text-gray-500 text-base leading-relaxed max-w-xl mx-auto">
            Ces cabanes ont été particulièrement appréciées par notre communauté — pour leur histoire, leur emplacement ou leur générosité.
          </p>
        </motion.div>
      </div>

      {/* ── Grille des coups de cœur ── */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-[3px] border-moss-200 border-t-moss-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Chargement…</p>
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏡</div>
            <p className="font-display font-semibold text-gray-400 text-lg mb-2">Aucun coup de cœur pour l'instant</p>
            <p className="text-gray-400 text-sm">Les cabanes les plus appréciées apparaîtront ici.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {featured.map((c, i) => (
              <FadeBlock key={c.id} delay={i * 60}>
                <FeaturedCard cabane={c} index={i} onClick={() => navigate('carte')} />
              </FadeBlock>
            ))}
          </div>
        )}
      </div>

      {/* ── Citation inspirante ── */}
      <FadeBlock>
        <div className="mx-4 mb-12 rounded-3xl overflow-hidden"
             style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.68),rgba(255,255,255,0.45))', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
          <div className="max-w-2xl mx-auto px-8 py-10 text-center">
            <div className="text-4xl mb-4">💬</div>
            <blockquote className="font-display italic text-lg text-gray-700 leading-relaxed mb-4">
              « On ne sait jamais quels mots on trouvera dans une cabane. C'est ça qui est beau — la surprise est toujours au rendez-vous. »
            </blockquote>
            <cite className="text-sm text-gray-400 not-italic">— Un lecteur de passage, quelque part en France</cite>
          </div>
        </div>
      </FadeBlock>

      {/* ── CTA proposer une cabane ── */}
      <FadeBlock>
        <div className="mx-4 mb-16 rounded-3xl px-8 py-10 text-center"
             style={{ background: 'linear-gradient(135deg,#2d5a3d,#4a7c59)', boxShadow: '0 8px 32px rgba(45,90,61,0.28)' }}>
          <div className="text-3xl mb-3">🏅</div>
          <h3 className="font-display font-bold text-xl text-white mb-2">
            Proposer une cabane pour le coup de cœur
          </h3>
          <p className="text-white/70 text-sm max-w-sm mx-auto mb-5 leading-relaxed">
            Vous connaissez une cabane exceptionnelle ? Signalez-la sur la carte — les meilleures rejoindront cette sélection.
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('carte')}
            className="inline-flex items-center gap-2 bg-white text-moss-800 font-bold px-5 py-2.5 rounded-2xl text-sm shadow-lg"
          >
            Ajouter une cabane <ArrowRight size={14} />
          </motion.button>
        </div>
      </FadeBlock>
    </div>
  );
}
