'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  role: 'patient' | 'caregiver' | 'family' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded credentials for testing
const CREDENTIALS = {
  admin: {
    email: 'admin@reminoracare.com',
    password: 'admin123',
    role: 'admin' as const,
  },
  patient: {
    email: 'patient@reminoracare.com',
    password: 'patient123',
    role: 'patient' as const,
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('reminoracare-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const initializePatientData = async () => {
    // Always initialize/reinitialize patient data for testing
    // In production, you might want to check if it's already initialized

    // Clear existing data first to ensure fresh initialization
    localStorage.removeItem('reminoracare-memories');
    localStorage.removeItem('reminoracare-albums');
    localStorage.removeItem('reminoracare-journal');
    localStorage.removeItem('reminoracare-progress');
    localStorage.removeItem('reminoracare-quiz-results');
    localStorage.removeItem('reminoracare-medicines');
    localStorage.removeItem('patient-data-initialized');

    // Import and initialize sample data
    try {
      const { getPatientSampleData } = await import('@/lib/sampleData');
      const sampleData = getPatientSampleData();
      
      console.log('Sample data loaded:', {
        hasMemories: !!sampleData.memories,
        hasAlbums: !!sampleData.albums,
        hasMedicines: !!sampleData.medicines,
        albumsCount: sampleData.albums?.length || 0,
        medicinesCount: sampleData.medicines?.length || 0,
      });
      
      // Save all data
      localStorage.setItem('reminoracare-memories', JSON.stringify(sampleData.memories));
      localStorage.setItem('reminoracare-journal', JSON.stringify(sampleData.journalEntries));
      localStorage.setItem('reminoracare-progress', JSON.stringify(sampleData.progressData));
      localStorage.setItem('reminoracare-quiz-results', JSON.stringify(sampleData.quizResults));
      
      // Save albums - always save even if empty array
      console.log('Albums data:', {
        exists: !!sampleData.albums,
        isArray: Array.isArray(sampleData.albums),
        length: sampleData.albums?.length || 0,
        first: sampleData.albums?.[0] || null,
      });
      if (sampleData.albums) {
        console.log('Saving albums:', sampleData.albums.length);
        localStorage.setItem('reminoracare-albums', JSON.stringify(sampleData.albums));
        console.log('Albums saved to localStorage');
        // Verify it was saved
        const saved = localStorage.getItem('reminoracare-albums');
        const parsed = saved ? JSON.parse(saved) : [];
        console.log('Verified albums in localStorage:', parsed.length);
      } else {
        console.error('No albums in sampleData!');
      }
      
      // Save medicines - always save even if empty array
      console.log('Medicines data:', {
        exists: !!sampleData.medicines,
        isArray: Array.isArray(sampleData.medicines),
        length: sampleData.medicines?.length || 0,
        first: sampleData.medicines?.[0] || null,
      });
      if (sampleData.medicines) {
        console.log('Saving medicines:', sampleData.medicines.length);
        localStorage.setItem('reminoracare-medicines', JSON.stringify(sampleData.medicines));
        console.log('Medicines saved to localStorage');
        // Verify it was saved
        const saved = localStorage.getItem('reminoracare-medicines');
        const parsed = saved ? JSON.parse(saved) : [];
        console.log('Verified medicines in localStorage:', parsed.length);
      } else {
        console.error('No medicines in sampleData!');
      }
      
      console.log('Patient data initialized successfully:', {
        memories: sampleData.memories.length,
        journal: sampleData.journalEntries.length,
        albums: sampleData.albums?.length || 0,
        medicines: sampleData.medicines?.length || 0,
      });
      
      // Don't mark as initialized - always refresh on login for testing
      
      // Reload page to show new data
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error('Failed to initialize patient data:', error);
    }
  };

  const login = (email: string, password: string): boolean => {
    // Check admin credentials
    if (email === CREDENTIALS.admin.email && password === CREDENTIALS.admin.password) {
      const userData: User = { email, role: 'admin' };
      setUser(userData);
      localStorage.setItem('reminoracare-user', JSON.stringify(userData));
      return true;
    }
    
    // Check patient credentials
    if (email === CREDENTIALS.patient.email && password === CREDENTIALS.patient.password) {
      const userData: User = { email, role: 'patient' };
      setUser(userData);
      localStorage.setItem('reminoracare-user', JSON.stringify(userData));
      
      // Initialize sample data for patient account (async)
      initializePatientData().catch(console.error);
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('reminoracare-user');
    // Note: We keep the data so it persists across logins
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
