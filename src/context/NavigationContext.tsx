import React, { createContext, useContext, useState, useCallback } from 'react';
import { PageId } from '../types/cabane';

interface NavState {
  page: PageId;
  searchQuery: string;
}

interface NavigationContextType extends NavState {
  navigate: (page: PageId, opts?: { search?: string }) => void;
}

const NavigationContext = createContext<NavigationContextType>({
  page: 'accueil',
  searchQuery: '',
  navigate: () => {},
});

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<NavState>({ page: 'accueil', searchQuery: '' });

  const navigate = useCallback((page: PageId, opts?: { search?: string }) => {
    setState({ page, searchQuery: opts?.search ?? '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <NavigationContext.Provider value={{ ...state, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  return useContext(NavigationContext);
}
