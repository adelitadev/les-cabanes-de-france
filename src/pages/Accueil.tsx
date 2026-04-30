import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, ChevronDown, ArrowRight } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { Cabane } from '../types/cabane';

const TYPE_COLOR = {
  livres: { bg: 'rgba(14,165,233,0.12)', text: '#0284c7', border: 'rgba(14,165,233,0.2)', label: 'Livres', dot: '#38bdf8' },
  dons:   { bg: 'rgba(245,158,11,0.12)',  text: '#b45309', border: 'rgba(245,158,11,0.2)',  label: 'Dons',   dot: '#fbbf24' },
  mixte:  { bg: 'rgba(139,92,246,0.12)',  text: '#7c3aed', border: 'rgba(139,92,246,0.2)',  label: 'Mixte',  dot: '#a78bfa' },
};

const STEPS = [
  { emoji: '🔍', title: 'Trouvez', desc: 'Cherchez une cabane près de chez vous sur la carte ou dans la liste par région.' },
  { emoji: '📦', title: 'Prenez & donnez', desc: 'Livres, vêtements, jouets, conserves… Pas de règles : prenez ce dont vous avez besoin, laissez ce que vous pouvez.' },
  { emoji: '🏡', title: 'Signalez', desc: 'Vous avez découvert une cabane que nous n\'avons pas encore ? Ajoutez-la en deux clics pour que tout le monde en profite.' },
];

/* Hook scroll-fade léger */
function useFadeIn(ref: React.RefObject<HTMLElement | null>, threshold = 0.15) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('fade-visible'); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
}

function FadeSection({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useFadeIn(ref as React.RefObject<HTMLElement>);
  return (
    <div ref={ref} className={`fade-section ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

interface Props {
  cabanes: ReturnType<typeof import('../hooks/useCabanes').useCabanes>;
}

export default function Accueil({ cabanes: { cabanes, loading } }: Props) {
  const { navigate } = useNavigation();
  const [search, setSearch] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  /* Stats */
  const villes  = new Set(cabanes.map((c) => c.ville)).size;
  const regions = new Set(cabanes.map((c) => c.region).filter(Boolean)).size;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('cabanes', { search: search.trim() });
  };

  const recentCabanes = cabanes.slice(0, 3);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* ═══════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════ */}
      <section className="relative min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-4 py-16">

        {/* Carte glass centrée */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0,  scale: 1 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-2xl rounded-3xl px-8 py-10 text-center"
          style={{
            background: 'rgba(255,255,255,0.68)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(255,255,255,0.65)',
            boxShadow: '0 8px 48px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          {/* Étiquet "Nouvelle cabane !" */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full mb-5"
            style={{ background: 'rgba(74,124,89,0.12)', color: '#2d5a3d', border: '1px solid rgba(74,124,89,0.2)' }}
          >
            ✨ Carte collaborative &amp; participative
          </motion.div>

          {/* Titre */}
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-moss-900 leading-tight mb-3">
            Les Cabanes<br/>
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #4a7c59, #2d5a3d)' }}
            >
              de France
            </span>
          </h1>

          <p className="text-gray-600 text-base sm:text-lg max-w-md mx-auto leading-relaxed mb-8">
            Trouvez une cabane à livres ou à dons près de chez vous, ou signalez-en une nouvelle.
          </p>

          {/* Barre de recherche */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par ville, nom…"
                className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm font-medium focus:outline-none transition-shadow"
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="px-5 py-3 rounded-2xl text-white text-sm font-bold flex items-center gap-1.5 shadow-md"
              style={{ background: 'linear-gradient(135deg,#4a7c59,#2d5a3d)' }}
            >
              <Search size={15} />
              <span className="hidden sm:inline">Chercher</span>
            </motion.button>
          </form>

          {/* CTA secondaires */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('carte')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md"
              style={{ background: 'linear-gradient(135deg,#4a7c59,#2d5a3d)' }}
            >
              🗺️ Explorer la carte
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('cabanes')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
              style={{
                background: 'rgba(74,124,89,0.08)',
                border: '1px solid rgba(74,124,89,0.22)',
                color: '#2d5a3d',
              }}
            >
              📖 Parcourir les cabanes
            </motion.button>
          </div>

          {/* Stats */}
          {!loading && (
            <div className="flex items-center justify-center gap-6 pt-4"
                 style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              {[
                { val: cabanes.length, label: 'cabanes' },
                { val: villes,  label: 'villes'   },
                { val: regions || 8, label: 'régions' },
              ].map(({ val, label }) => (
                <div key={label} className="text-center">
                  <div className="font-bold text-2xl text-moss-700 leading-none">{val}</div>
                  <div className="text-[11px] text-gray-400 font-medium mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          onClick={() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' })}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 6, 0] }}
          transition={{ delay: 1.2, y: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white/90 transition-colors"
        >
          <ChevronDown size={28} strokeWidth={1.5} />
        </motion.button>
      </section>

      {/* ═══════════════════════════════════════════════
          COMMENT ÇA MARCHE
      ═══════════════════════════════════════════════ */}
      <section ref={scrollRef} className="px-4 py-20 max-w-5xl mx-auto">
        <FadeSection className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl text-moss-900 mb-3">Comment ça marche ?</h2>
          <p className="text-gray-500 text-base max-w-lg mx-auto">
            Simple comme un bonjour — aucune inscription, aucune règle compliquée.
          </p>
        </FadeSection>

        <div className="grid sm:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <FadeSection key={step.title} delay={i * 100}>
              <div
                className="h-full rounded-3xl p-6 text-center"
                style={{
                  background: 'rgba(255,255,255,0.58)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.55)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                }}
              >
                <div className="text-5xl mb-4">{step.emoji}</div>
                <h3 className="font-display font-bold text-moss-800 text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </FadeSection>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          DERNIÈRES CABANES
      ═══════════════════════════════════════════════ */}
      {recentCabanes.length > 0 && (
        <section className="px-4 py-12 pb-24 max-w-5xl mx-auto">
          <FadeSection className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display font-bold text-2xl text-moss-900 mb-1">
                Dernières cabanes ajoutées
              </h2>
              <p className="text-gray-400 text-sm">Découvrez les nouvelles pépites de la communauté</p>
            </div>
            <button
              onClick={() => navigate('cabanes')}
              className="flex items-center gap-1.5 text-moss-600 hover:text-moss-800 text-sm font-semibold transition-colors"
            >
              Voir tout <ArrowRight size={14} />
            </button>
          </FadeSection>

          <div className="grid sm:grid-cols-3 gap-4">
            {recentCabanes.map((c, i) => (
              <FadeSection key={c.id} delay={i * 80}>
                <MiniCabaneCard cabane={c} onClick={() => navigate('carte')} />
              </FadeSection>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          CTA FINAL
      ═══════════════════════════════════════════════ */}
      <FadeSection>
        <section className="mx-4 mb-16 rounded-3xl overflow-hidden"
                 style={{ background: 'linear-gradient(135deg,#2d5a3d,#4a7c59)' }}>
          <div className="px-8 py-12 text-center text-white">
            <div className="text-4xl mb-4">🏡</div>
            <h2 className="font-display font-bold text-2xl mb-3">
              Vous connaissez une cabane ?
            </h2>
            <p className="text-white/75 text-sm max-w-md mx-auto mb-6">
              Signalez-la sur la carte et aidez des centaines de personnes à la découvrir.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('carte')}
              className="inline-flex items-center gap-2 bg-white text-moss-800 font-bold px-6 py-3 rounded-2xl text-sm shadow-lg"
            >
              Ajouter une cabane <ArrowRight size={15} />
            </motion.button>
          </div>
        </section>
      </FadeSection>
    </div>
  );
}

/* Carte mini pour la section "Dernières ajoutées" */
function MiniCabaneCard({ cabane, onClick }: { cabane: Cabane; onClick: () => void }) {
  const cfg = TYPE_COLOR[cabane.type];
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
      whileTap={{ scale: 0.98 }}
      className="w-full text-left rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.65)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid rgba(255,255,255,0.6)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
      }}
    >
      <div className="h-1.5" style={{ background: cfg.dot }} />
      <div className="p-4">
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full mb-2"
              style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}>
          {cabane.type === 'livres' ? '📚' : cabane.type === 'dons' ? '🎁' : '✨'} {cfg.label}
        </span>
        <h3 className="font-display font-semibold text-gray-800 text-sm leading-tight mb-1 line-clamp-1">
          {cabane.nom}
        </h3>
        <p className="text-[11px] text-gray-400 flex items-center gap-1 mb-2">
          <MapPin size={9} /> {cabane.ville}
        </p>
        {cabane.description && (
          <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{cabane.description}</p>
        )}
      </div>
    </motion.button>
  );
}
