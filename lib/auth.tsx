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
    email: 'admin@memorylane.com',
    password: 'admin123',
    role: 'admin' as const,
  },
  patient: {
    email: 'patient@memorylane.com',
    password: 'patient123',
    role: 'patient' as const,
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('memory-lane-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const initializePatientData = async () => {
    // Check if this is the first time logging in as patient
    const patientDataKey = 'patient-data-initialized';
    const wasInitialized = localStorage.getItem(patientDataKey) === 'true';
    
    // If patient data was already initialized, don't reinitialize
    if (wasInitialized) {
      return;
    }

    // Import and initialize sample data
    try {
      const { getPatientSampleData } = await import('@/lib/sampleData');
      const sampleData = getPatientSampleData();
      
      // Save all data
      localStorage.setItem('memory-lane-memories', JSON.stringify(sampleData.memories));
      localStorage.setItem('memory-lane-journal', JSON.stringify(sampleData.journalEntries));
      localStorage.setItem('memory-lane-progress', JSON.stringify(sampleData.progressData));
      localStorage.setItem('memory-lane-quiz-results', JSON.stringify(sampleData.quizResults));
      
      // Mark as initialized
      localStorage.setItem(patientDataKey, 'true');
      
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
      localStorage.setItem('memory-lane-user', JSON.stringify(userData));
      return true;
    }
    
    // Check patient credentials
    if (email === CREDENTIALS.patient.email && password === CREDENTIALS.patient.password) {
      const userData: User = { email, role: 'patient' };
      setUser(userData);
      localStorage.setItem('memory-lane-user', JSON.stringify(userData));
      
      // Initialize sample data for patient account (async)
      initializePatientData().catch(console.error);
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('memory-lane-user');
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
