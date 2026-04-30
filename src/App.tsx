import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import Navigation from './components/Navigation';
import HeroBackground from './components/HeroBackground';
import SuccessAnimation from './components/SuccessAnimation';
import Accueil from './pages/Accueil';
import Carte from './pages/Carte';
import LesCabanes from './pages/LesCabanes';
import Philosophie from './pages/Philosophie';
import CoupDeCoeur from './pages/CoupDeCoeur';
import { useCabanes } from './hooks/useCabanes';

/* ── Transition de page ── */
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit:    { opacity: 0, y: -8,  transition: { duration: 0.18, ease: 'easeIn' } },
};

function Router() {
  const { page, searchQuery } = useNavigation();
  const cabanes = useCabanes();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={page}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex-1 overflow-hidden flex flex-col"
        style={{ minHeight: 0 }}
      >
        {page === 'accueil'       && <Accueil      cabanes={cabanes} />}
        {page === 'carte'         && <Carte         cabanes={cabanes} />}
        {page === 'cabanes'       && <LesCabanes    cabanes={cabanes} initialSearch={searchQuery} />}
        {page === 'philosophie'   && <Philosophie />}
        {page === 'coup-de-coeur' && <CoupDeCoeur   cabanes={cabanes} />}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <NavigationProvider>
      <div className="relative flex flex-col h-screen overflow-hidden">
        <HeroBackground />
        <Navigation />
        <Router />
      </div>
    </NavigationProvider>
  );
}
