import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Loader2, Search } from 'lucide-react';
import { CabaneType, NewCabane } from '../../types/cabane';
import { geocodeAddress, reverseGeocode, extractCity, formatShortAddress } from '../../lib/geocoding';
import TypeSelector from './TypeSelector';

interface AddCabaneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (cabane: NewCabane) => Promise<void>;
  pinnedLocation: { lat: number; lng: number } | null;
}

interface FormState {
  nom: string;
  type: CabaneType;
  description: string;
  adresse: string;
  contributeur: string;
}

interface Errors {
  nom?: string;
  adresse?: string;
  contributeur?: string;
  location?: string;
}

export default function AddCabaneModal({ isOpen, onClose, onSubmit, pinnedLocation }: AddCabaneModalProps) {
  const [form, setForm] = useState<FormState>({
    nom: '',
    type: 'livres',
    description: '',
    adresse: '',
    contributeur: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [location, setLocation] = useState<{ lat: number; lng: number; ville: string } | null>(null);
  const [geocoding, setGeocoding] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Quand l'utilisateur a cliqué sur la carte
  useEffect(() => {
    if (!pinnedLocation || !isOpen) return;
    const resolve = async () => {
      setGeocoding(true);
      const result = await reverseGeocode(pinnedLocation.lat, pinnedLocation.lng);
      const ville = result ? extractCity(result) : '';
      const display = result ? formatShortAddress(result) : `${pinnedLocation.lat.toFixed(4)}, ${pinnedLocation.lng.toFixed(4)}`;
      setLocation({ lat: pinnedLocation.lat, lng: pinnedLocation.lng, ville });
      setForm((f) => ({ ...f, adresse: display }));
      setGeocoding(false);
    };
    resolve();
  }, [pinnedLocation, isOpen]);

  const handleGeocodeAddress = async () => {
    if (!form.adresse.trim()) return;
    setGeocoding(true);
    const result = await geocodeAddress(form.adresse);
    if (result) {
      const ville = extractCity(result);
      setLocation({ lat: result.lat, lng: result.lon, ville });
      setForm((f) => ({ ...f, adresse: formatShortAddress(result) }));
      setErrors((e) => ({ ...e, location: undefined, adresse: undefined }));
    } else {
      setErrors((e) => ({ ...e, location: 'Adresse introuvable. Essayez d\'être plus précis.' }));
    }
    setGeocoding(false);
  };

  const validate = (): boolean => {
    const errs: Errors = {};
    if (!form.nom.trim()) errs.nom = 'Le nom est obligatoire.';
    if (!form.contributeur.trim()) errs.contributeur = 'Votre pseudo est obligatoire.';
    if (!location) errs.location = 'Veuillez localiser la cabane (adresse ou clic sur la carte).';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !location) return;
    setSubmitting(true);
    await onSubmit({
      nom: form.nom.trim(),
      type: form.type,
      description: form.description.trim(),
      latitude: location.lat,
      longitude: location.lng,
      ville: location.ville,
      contributeur: form.contributeur.trim(),
    });
    setSubmitting(false);
    // Reset
    setForm({ nom: '', type: 'livres', description: '', adresse: '', contributeur: '' });
    setLocation(null);
    setErrors({});
    onClose();
  };

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
                 style={{
                   background: 'rgba(255,255,255,0.92)',
                   backdropFilter: 'blur(24px)',
                   WebkitBackdropFilter: 'blur(24px)',
                   border: '1px solid rgba(255,255,255,0.6)',
                   boxShadow: '0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)',
                 }}>
              {/* Header */}
              <div className="sticky top-0 px-6 py-4 flex items-center justify-between rounded-t-3xl"
                   style={{ background: 'rgba(255,255,255,0.95)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <div>
                  <h2 className="font-display font-bold text-gray-800 text-lg">Ajouter une cabane</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Partagez un trésor avec la communauté 🏡</p>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Nom */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Nom de la cabane <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.nom}
                    onChange={set('nom')}
                    placeholder="Ex : La Boîte à Rêves du Marché"
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-moss-400 transition-shadow ${
                      errors.nom ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  />
                  {errors.nom && <p className="text-xs text-red-500 mt-1">{errors.nom}</p>}
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Type de cabane <span className="text-red-400">*</span>
                  </label>
                  <TypeSelector
                    value={form.type}
                    onChange={(t) => setForm((f) => ({ ...f, type: t }))}
                  />
                </div>

                {/* Localisation */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Localisation <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.adresse}
                      onChange={set('adresse')}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleGeocodeAddress())}
                      placeholder="Adresse ou lieu-dit..."
                      className={`flex-1 px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-moss-400 transition-shadow ${
                        errors.location ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleGeocodeAddress}
                      disabled={geocoding}
                      className="px-3 py-2.5 rounded-xl bg-moss-100 hover:bg-moss-200 text-moss-700 transition-colors disabled:opacity-50"
                    >
                      {geocoding ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                    </button>
                  </div>

                  {location && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1.5 mt-1.5 text-xs text-moss-600 bg-moss-50 px-2.5 py-1.5 rounded-lg"
                    >
                      <MapPin size={11} />
                      <span>
                        {location.ville && `${location.ville} · `}
                        {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                      </span>
                    </motion.div>
                  )}

                  {!location && (
                    <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                      <MapPin size={10} />
                      Ou cliquez directement sur la carte pour placer le repère
                    </p>
                  )}
                  {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={set('description')}
                    rows={3}
                    placeholder="Décrivez la cabane, son emplacement précis, ce qu'on y trouve..."
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-moss-400 resize-none transition-shadow"
                  />
                </div>

                {/* Pseudo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Votre pseudo <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.contributeur}
                    onChange={set('contributeur')}
                    placeholder="Ex : Marie de Lyon"
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-moss-400 transition-shadow ${
                      errors.contributeur ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  />
                  {errors.contributeur && <p className="text-xs text-red-500 mt-1">{errors.contributeur}</p>}
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-xl bg-moss-600 hover:bg-moss-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Ajout en cours…
                    </>
                  ) : (
                    '🏡 Ajouter cette cabane'
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
