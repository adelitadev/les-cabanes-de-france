import { useState, useEffect, useCallback } from 'react';
import { Cabane, NewCabane } from '../types/cabane';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MOCK_CABANES } from '../lib/mockData';

export function useCabanes() {
  const [cabanes, setCabanes] = useState<Cabane[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCabanes = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      await new Promise((r) => setTimeout(r, 400));
      setCabanes(MOCK_CABANES);
      setLoading(false);
      return;
    }

    const { data, error: err } = await supabase
      .from('cabanes')
      .select('*')
      .order('created_at', { ascending: false });

    if (err) {
      setError('Impossible de charger les cabanes.');
      setCabanes(MOCK_CABANES);
    } else {
      setCabanes(data as Cabane[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchCabanes(); }, [fetchCabanes]);

  const addCabane = useCallback(async (newCabane: NewCabane): Promise<Cabane | null> => {
    if (!isSupabaseConfigured()) {
      const mock: Cabane = {
        ...newCabane,
        id: Date.now().toString(),
        signalements: 0,
        featured: false,
        created_at: new Date().toISOString(),
      };
      setCabanes((prev) => [mock, ...prev]);
      return mock;
    }

    const { data, error: err } = await supabase
      .from('cabanes')
      .insert([newCabane])
      .select()
      .single();

    if (err) { setError("Erreur lors de l'ajout."); return null; }
    const added = data as Cabane;
    setCabanes((prev) => [added, ...prev]);
    return added;
  }, []);

  const reportCabane = useCallback(async (id: string) => {
    if (!isSupabaseConfigured()) return;
    await supabase.rpc('increment_signalements', { cabane_id: id });
    setCabanes((prev) => prev.map((c) => c.id === id ? { ...c, signalements: c.signalements + 1 } : c));
  }, []);

  return { cabanes, loading, error, addCabane, reportCabane, refetch: fetchCabanes };
}
