import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, MapPin, Clock, SlidersHorizontal, X } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import AddCabaneModal from '../components/AddCabane/AddCabaneModal';
import SuccessAnimation from '../components/SuccessAnimation';
import { FilterType, Cabane, NewCabane } from '../types/cabane';

const REGIONS_FR = [
  'Toutes les régions',
  'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Bretagne',
  'Centre-Val de Loire', 'Corse', 'Grand Est', 'Hauts-de-France',
  'Île-de-France', 'Normandie', 'Nouvelle-Aquitaine', 'Occitanie',
  'Pays de la Loire', 'Provence-Alpes-Côte d\'Azur',
];

const TYPE_TABS: { value: FilterType; label: string; emoji: string; gradient: string }[] = [
  { value: 'tous',   label: 'Toutes',  emoji: '🗂️', gradient: 'linear-gradient(135deg,#4a7c59,#2d5a3d)' },
  { value: 'livres', label: 'Livres',  emoji: '📚', gradient: 'linear-gradient(135deg,#38bdf8,#0284c7)' },
  { value: 'dons',   label: 'Dons',    emoji: '🎁', gradient: 'linear-gradient(135deg,#fbbf24,#d97706)' },
  { value: 'mixte',  label: 'Mixte',   emoji: '✨', gradient: 'linear-gradient(135deg,#a78bfa,#7c3aed)' },
];

const TYPE_CFG = {
  livres: { bg: 'rgba(14,165,233,0.11)',  text: '#0284c7', border: 'rgba(14,165,233,0.22)', label: 'Livres',        dot: '#38bdf8'  },
  dons:   { bg: 'rgba(245,158,11,0.11)',  text: '#b45309', border: 'rgba(245,158,11,0.22)',  label: 'Dons',          dot: '#fbbf24'  },
  mixte:  { bg: 'rgba(139,92,246,0.11)',  text: '#7c3aed', border: 'rgba(139,92,246,0.22)', label: 'Livres & Dons', dot: '#a78bfa'  },
};

function formatDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Aujourd\'hui';
  if (days === 1) return 'Hier';
  if (days < 7)  return `Il y a ${days} j.`;
  if (days < 30) return `Il y a ${Math.floor(days / 7)} sem.`;
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
}

/* Carte de cabane pour la grille */
function CabaneGridCard({ cabane, index, onClick }: { cabane: Cabane; index: number; onClick: () => void }) {
  const cfg = TYPE_CFG[cabane.type];
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: Math.min(index * 0.05, 0.35), type: 'spring', stiffness: 180, damping: 22 }}
      whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }}
      onClick={onClick}
      className="group cursor-pointer rounded-3xl overflow-hidden transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.62)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.6)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
      }}
    >
      {/* Barre colorée + type */}
      <div className="px-5 pt-4 pb-0 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}>
          {cabane.type === 'livres' ? '📚' : cabane.type === 'dons' ? '🎁' : '✨'}
          {cfg.label}
        </span>
        {cabane.featured && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(251,191,36,0.15)', color: '#b45309', border: '1px solid rgba(251,191,36,0.3)' }}>
            ❤️ Coup de cœur
          </span>
        )}
      </div>

      {/* Contenu */}
      <div className="px-5 py-4">
        <h3 className="font-display font-bold text-gray-800 text-base leading-tight mb-1 group-hover:text-moss-800 transition-colors line-clamp-1">
          {cabane.nom}
        </h3>

        <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-3">
          <span className="flex items-center gap-1"><MapPin size={9} strokeWidth={2} />{cabane.ville}</span>
          {cabane.region && <span className="truncate">{cabane.region}</span>}
          <span className="flex items-center gap-1 ml-auto flex-shrink-0"><Clock size={9} strokeWidth={2} />{formatDate(cabane.created_at)}</span>
        </div>

        {cabane.description && (
          <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-3">{cabane.description}</p>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 flex items-center justify-between"
           style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <span className="text-[11px] text-gray-400">par {cabane.contributeur}</span>
        <span className="text-[11px] font-semibold text-moss-600 group-hover:underline">
          Voir sur la carte →
        </span>
      </div>
    </motion.article>
  );
}

interface Props {
  cabanes: ReturnType<typeof import('../hooks/useCabanes').useCabanes>;
  initialSearch?: string;
}

export default function LesCabanes({ cabanes: { cabanes, addCabane }, initialSearch = '' }: Props) {
  const { navigate } = useNavigation();
  const [search, setSearch] = useState(initialSearch);
  const [filterType, setFilterType] = useState<FilterType>('tous');
  const [region, setRegion] = useState('Toutes les régions');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { setSearch(initialSearch); }, [initialSearch]);

  const filtered = useMemo(() => {
    return cabanes.filter((c) => {
      const matchType   = filterType === 'tous' || c.type === filterType;
      const matchRegion = region === 'Toutes les régions' || c.region === region;
      const q = search.toLowerCase();
      const matchSearch = !q
        || c.nom.toLowerCase().includes(q)
        || c.ville.toLowerCase().includes(q)
        || c.description.toLowerCase().includes(q)
        || (c.region ?? '').toLowerCase().includes(q);
      return matchType && matchRegion && matchSearch;
    });
  }, [cabanes, filterType, region, search]);

  const handleSubmit = async (newCabane: NewCabane) => {
    await addCabane(newCabane);
    setShowSuccess(true);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* ── En-tête ── */}
      <div className="sticky top-0 z-20 px-4 sm:px-6 py-4"
           style={{
             background: 'rgba(255,255,255,0.78)',
             backdropFilter: 'blur(20px)',
             WebkitBackdropFilter: 'blur(20px)',
             borderBottom: '1px solid rgba(255,255,255,0.5)',
             boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
           }}>
        <div className="max-w-6xl mx-auto">
          {/* Titre + bouton */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="font-display font-bold text-2xl text-moss-900 leading-tight">📖 Les Cabanes</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {filtered.length} cabane{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-white text-sm font-bold shadow-md flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#4a7c59,#2d5a3d)' }}
            >
              <Plus size={15} strokeWidth={2.5} />
              <span className="hidden sm:inline">Ajouter une cabane</span>
              <span className="sm:hidden">Ajouter</span>
            </motion.button>
          </div>

          {/* Filtres type */}
          <div className="flex items-center gap-2 flex-wrap">
            {TYPE_TABS.map((t) => {
              const active = filterType === t.value;
              return (
                <motion.button
                  key={t.value}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setFilterType(t.value)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all"
                  style={active
                    ? { background: t.gradient, color: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.16)' }
                    : { background: 'rgba(0,0,0,0.04)', color: '#6b7280' }
                  }
                >
                  {t.emoji} {t.label}
                </motion.button>
              );
            })}

            {/* Bouton filtres avancés */}
            <button
              onClick={() => setShowFilters((f) => !f)}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: showFilters ? 'rgba(74,124,89,0.12)' : 'rgba(0,0,0,0.04)', color: '#6b7280' }}
            >
              <SlidersHorizontal size={13} />
              Filtres
            </button>
          </div>

          {/* Recherche + région (filtres avancés) */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-3 flex flex-wrap gap-2"
              >
                {/* Recherche texte */}
                <div className="relative flex-1 min-w-48">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Nom, ville, description…"
                    className="w-full pl-9 pr-8 py-2 rounded-xl text-sm focus:outline-none"
                    style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.07)' }}
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Sélecteur région */}
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="px-3 py-2 rounded-xl text-sm font-medium focus:outline-none cursor-pointer"
                  style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.07)', color: '#374151' }}
                >
                  {REGIONS_FR.map((r) => <option key={r}>{r}</option>)}
                </select>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Grille ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="text-5xl mb-4">🏡</div>
              <p className="font-display font-semibold text-gray-500 text-lg mb-2">Aucune cabane trouvée</p>
              <p className="text-gray-400 text-sm mb-6">Essayez d'autres critères ou ajoutez-en une nouvelle !</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold"
                style={{ background: 'linear-gradient(135deg,#4a7c59,#2d5a3d)' }}
              >
                <Plus size={14} /> Ajouter une cabane
              </button>
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((c, i) => (
                <CabaneGridCard
                  key={c.id}
                  cabane={c}
                  index={i}
                  onClick={() => navigate('carte')}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal ajout */}
      <AddCabaneModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        pinnedLocation={null}
      />
      <SuccessAnimation show={showSuccess} onDone={() => setShowSuccess(false)} />
    </div>
  );
}
