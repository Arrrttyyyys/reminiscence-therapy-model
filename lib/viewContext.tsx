'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ViewMode = 'patient' | 'caregiver';

interface ViewContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleView: () => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewModeState] = useState<ViewMode>('patient');

  // Load saved view mode from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('viewMode');
      if (saved === 'patient' || saved === 'caregiver') {
        setViewModeState(saved);
      }
    }
  }, []);

  // Save view mode to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('viewMode', viewMode);
    }
  }, [viewMode]);

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
  };

  const toggleView = () => {
    setViewModeState(prev => prev === 'patient' ? 'caregiver' : 'patient');
  };

  return (
    <ViewContext.Provider value={{ viewMode, setViewMode, toggleView }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
}

