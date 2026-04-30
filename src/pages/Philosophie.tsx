import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

function useFade(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('fade-visible'); obs.disconnect(); } },
      { threshold: 0.1 }
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

const SECTIONS = [
  {
    emoji: '🌱',
    title: 'L\'idée qui germait',
    color: 'rgba(74,124,89,0.10)',
    accent: '#2d5a3d',
    content: `Tout commence avec un désir simple : offrir à ses livres lus une vie après votre bibliothèque. Non pas les jeter, non pas les oublier dans un carton poussiéreux — mais les confier au hasard des rues, à la curiosité des passants, à la chance d'une rencontre.\n\nUne cabane en bois devant un portail. Un boîte peinte aux couleurs vives sur un poteau. Une ancienne cabine téléphonique reconvertie. Partout en France, ces petites maisons du partage ont fleuri, portées par la même conviction : la générosité est contagieuse.`,
    pull: '« Un livre offert, c\'est une porte ouverte sur un autre monde. »',
  },
  {
    emoji: '🤲',
    title: 'Prendre et donner sans compter',
    color: 'rgba(245,158,11,0.08)',
    accent: '#b45309',
    content: `Aucun formulaire. Aucune adhésion. Aucune condition. Vous prenez un livre qui vous attire l'œil, vous déposez celui que vous venez de finir. La confiance est le seul règlement, la générosité l'unique monnaie.\n\nAux cabanes à livres ont rejoint les cabanes à dons — ces boîtes plus larges où circulent vêtements, jouets, conserves, objets du quotidien. Tout ce qui peut encore servir, tout ce qui mérite une seconde chance plutôt que la déchetterie.`,
    pull: '« Pas de règles, pas de contrôle — juste de la confiance. »',
  },
  {
    emoji: '🌍',
    title: 'Une écologie du quotidien',
    color: 'rgba(14,165,233,0.08)',
    accent: '#0284c7',
    content: `Chaque ouvrage transmis plutôt que jeté, c'est un arbre épargné, de l'encre préservée, de l'énergie économisée. Chaque vêtement qui circule plutôt que d'être enfoui, c'est du coton, de l'eau et du travail respectés.\n\nLes cabanes participent silencieusement à l'économie du réemploi — sans application, sans algorithme, sans intermédiation. Juste la matière qui passe de main en main, à l'échelle humaine du quartier.`,
    pull: '« L\'écologie la plus efficace est celle qui se pratique au coin de la rue. »',
  },
  {
    emoji: '🤝',
    title: 'Des liens entre voisins',
    color: 'rgba(139,92,246,0.08)',
    accent: '#7c3aed',
    content: `Une cabane, c'est aussi un prétexte pour lever les yeux de son téléphone, pour croiser un regard, pour partager un sourire avec l'inconnu qui farfouille dans les mêmes rayons improvisés que vous.\n\nCes petites maisons de bois reconstituent du tissu social dans nos quartiers. Elles créent des micro-rendez-vous, des occasions manquées de solitude, des débuts d'histoires. Dans un monde qui se fragmente, elles rappellent que la rue est encore un espace commun.`,
    pull: '« Chaque cabane est un nœud dans le filet invisible qui relie les voisins. »',
  },
  {
    emoji: '🏡',
    title: 'Auto-gestion et confiance',
    color: 'rgba(74,124,89,0.08)',
    accent: '#4a7c59',
    content: `Nulle institution ne gère ces cabanes. Aucune subvention, aucun cahier des charges. Elles naissent de l'initiative d'un habitant, elles vivent de la bienveillance de ceux qui passent, elles prospèrent grâce aux petits gestes de tous — un coup de peinture par-ci, une réparation par-là, un réapprovisionnement spontané après une sortie au marché.\n\nC'est ce modèle d'auto-gestion douce, sans contrainte, qui fait leur force. Et leur fragilité aussi — une fragilité qui ressemble à celle de la confiance elle-même.`,
    pull: '« Elles vivent parce que des gens y croient — rien d\'autre. »',
  },
];

export default function Philosophie() {
  const { navigate } = useNavigation();

  return (
    <div className="flex-1 overflow-y-auto">

      {/* ── Hero ── */}
      <div className="relative px-4 py-24 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-2xl mx-auto"
        >
          <div className="text-6xl mb-6">🌿</div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-moss-900 mb-4 leading-tight">
            La Philosophie
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed max-w-xl mx-auto">
            Pourquoi des cabanes ? Qu'est-ce qui se passe vraiment quand on pose une boîte en bois au coin d'une rue ?
          </p>
        </motion.div>
      </div>

      {/* ── Sections ── */}
      <div className="max-w-3xl mx-auto px-4 pb-24 space-y-12">
        {SECTIONS.map((section, i) => (
          <FadeBlock key={section.title} delay={0}>
            <article
              className="rounded-3xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.70) 0%, ${section.color} 100%)`,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.6)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
              }}
            >
              {/* En-tête de section */}
              <div className="px-8 pt-8 pb-4 flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: section.color, border: `1px solid ${section.accent}22` }}
                >
                  {section.emoji}
                </div>
                <h2 className="font-display font-bold text-xl text-gray-800">{section.title}</h2>
              </div>

              {/* Corps */}
              <div className="px-8 pb-6">
                {section.content.split('\n\n').map((para, j) => (
                  <p key={j} className="text-gray-600 text-[15px] leading-relaxed mb-4 last:mb-0">{para}</p>
                ))}

                {/* Pull quote */}
                <blockquote
                  className="mt-6 pl-4 py-2 text-sm font-display italic font-semibold"
                  style={{ borderLeft: `3px solid ${section.accent}`, color: section.accent }}
                >
                  {section.pull}
                </blockquote>
              </div>
            </article>
          </FadeBlock>
        ))}

        {/* ── CTA ── */}
        <FadeBlock>
          <div
            className="rounded-3xl px-8 py-10 text-center"
            style={{ background: 'linear-gradient(135deg,#2d5a3d,#4a7c59)', boxShadow: '0 8px 32px rgba(45,90,61,0.3)' }}
          >
            <div className="text-4xl mb-4">✨</div>
            <h3 className="font-display font-bold text-2xl text-white mb-3">
              Rejoindre le mouvement
            </h3>
            <p className="text-white/75 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
              Signalez une cabane que vous connaissez et contribuez à cette carte vivante de la générosité française.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('carte')}
                className="flex items-center gap-2 bg-white text-moss-800 font-bold px-5 py-2.5 rounded-2xl text-sm shadow-lg"
              >
                🗺️ Explorer la carte
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('cabanes')}
                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold px-5 py-2.5 rounded-2xl text-sm border border-white/30 transition-colors"
              >
                📖 Voir les cabanes <ArrowRight size={14} />
              </motion.button>
            </div>
          </div>
        </FadeBlock>
      </div>
    </div>
  );
}
