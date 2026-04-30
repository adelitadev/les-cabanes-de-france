import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import MapView from '../components/Map/MapView';
import Sidebar from '../components/Sidebar/Sidebar';
import AddCabaneModal from '../components/AddCabane/AddCabaneModal';
import SuccessAnimation from '../components/SuccessAnimation';
import { useGeolocation } from '../hooks/useGeolocation';
import { FilterType, NewCabane, Cabane } from '../types/cabane';
import { isSupabaseConfigured } from '../lib/supabase';

interface Props {
  cabanes: ReturnType<typeof import('../hooks/useCabanes').useCabanes>;
}

export default function Carte({ cabanes: { cabanes, loading, addCabane } }: Props) {
  const { location: userLocation, loading: locating, locate } = useGeolocation();

  const [filter, setFilter] = useState<FilterType>('tous');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pinnedLocation, setPinnedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
  const [demoBanner, setDemoBanner] = useState(!isSupabaseConfigured());

  /* Voler vers position utilisateur */
  useEffect(() => {
    if (userLocation) setFlyTo([userLocation.lat, userLocation.lng]);
  }, [userLocation]);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    if (!isModalOpen) return;
    setPinnedLocation({ lat, lng });
  }, [isModalOpen]);

  const handleSubmit = useCallback(async (newCabane: NewCabane) => {
    const added = await addCabane(newCabane);
    if (added) {
      setShowSuccess(true);
      setFlyTo([added.latitude, added.longitude]);
    }
  }, [addCabane]);

  const handleCabaneCardClick = useCallback((cabane: Cabane) => {
    setFlyTo([cabane.latitude, cabane.longitude]);
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ minHeight: 0 }}>

      {/* ── Bannière mode démo ── */}
      {demoBanner && (
        <div className="flex-shrink-0 px-4 py-2 flex items-center justify-between text-xs"
             style={{
               background: 'rgba(254,243,199,0.88)',
               backdropFilter: 'blur(10px)',
               borderBottom: '1px solid rgba(245,158,11,0.2)',
               color: '#92400e',
             }}>
          <span>🎭 <strong>Mode démo</strong> — Données fictives. Configurez Supabase pour activer la persistance.</span>
          <button onClick={() => setDemoBanner(false)} className="ml-4 font-bold text-amber-500 hover:text-amber-700 text-base leading-none">×</button>
        </div>
      )}

      {/* ── Corps : carte + sidebar ── */}
      <div className="relative flex-1 overflow-hidden">

        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-4 px-10 py-8 rounded-3xl"
                 style={{
                   background: 'rgba(255,255,255,0.72)',
                   backdropFilter: 'blur(20px)',
                   border: '1px solid rgba(255,255,255,0.55)',
                   boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                 }}>
              <div className="text-4xl animate-bounce">🏡</div>
              <div className="w-7 h-7 border-[3px] border-moss-200 border-t-moss-600 rounded-full animate-spin" />
              <span className="text-sm font-medium text-moss-700">Chargement des cabanes…</span>
            </div>
          </div>
        ) : (
          <>
            {/* Carte plein espace */}
            <div className="absolute inset-0">
              <MapView
                cabanes={cabanes}
                filter={filter}
                onFilterChange={setFilter}
                userLocation={userLocation}
                onMapClick={handleMapClick}
                onReport={() => {}}
                flyToTarget={flyTo}
              />
            </div>

            {/* Sidebar */}
            <Sidebar
              cabanes={cabanes}
              userLocation={userLocation}
              locating={locating}
              onLocate={locate}
              onCabaneClick={handleCabaneCardClick}
              isOpen={sidebarOpen}
              onToggle={() => setSidebarOpen((o) => !o)}
            />

            {/* Bouton "Ajouter une cabane" flottant */}
            <motion.button
              whileHover={{ scale: 1.06, boxShadow: '0 8px 30px rgba(45,90,61,0.45)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setPinnedLocation(null); setIsModalOpen(true); }}
              className="absolute bottom-6 left-6 z-[1000] flex items-center gap-2 px-5 py-3 rounded-2xl text-white text-sm font-bold shadow-xl"
              style={{ background: 'linear-gradient(135deg,#4a7c59,#2d5a3d)' }}
            >
              <Plus size={16} strokeWidth={2.5} />
              Ajouter une cabane
            </motion.button>

            {/* Indication clic sur carte */}
            {isModalOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[999] text-white text-sm px-5 py-2.5 rounded-full pointer-events-none"
                style={{ background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(12px)' }}
              >
                📍 Cliquez sur la carte pour placer le repère
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Modal ajout */}
      <AddCabaneModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setPinnedLocation(null); }}
        onSubmit={handleSubmit}
        pinnedLocation={pinnedLocation}
      />

      <SuccessAnimation show={showSuccess} onDone={() => setShowSuccess(false)} />
    </div>
  );
}
