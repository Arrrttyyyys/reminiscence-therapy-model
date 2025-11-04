'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Heart, UserCog, User, Settings } from 'lucide-react';
import { useView } from '@/lib/viewContext';
import { useRouter } from 'next/navigation';

const Navigation = dynamic(() => import('./Navigation'), {
  ssr: false,
  loading: () => null,
});

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mounted, setMounted] = useState(false);
  const { viewMode, toggleView } = useView();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-sm border-b border-teal-500/30 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">ReminoraCare</h1>
              <p className="text-xs text-teal-400">Your companion for cherished memories</p>
            </div>
          </div>
          
          {/* Right Side Actions */}
          {mounted && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/settings')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-700 transition-all duration-200 group"
                title="Settings"
              >
                <Settings className="w-4 h-4 text-gray-400 group-hover:text-white" />
              </button>
              <button
                onClick={toggleView}
                className="flex items-center gap-2 px-4 py-2 bg-teal-500/20 border border-teal-500/30 rounded-xl hover:bg-teal-500/30 transition-all duration-200 group"
                title={`Switch to ${viewMode === 'patient' ? 'Caregiver' : 'Patient'} view`}
              >
                {viewMode === 'patient' ? (
                  <>
                    <UserCog className="w-4 h-4 text-teal-400 group-hover:text-teal-300" />
                    <span className="text-sm font-medium text-teal-400 group-hover:text-teal-300">
                      Caregiver View
                    </span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 text-teal-400 group-hover:text-teal-300" />
                    <span className="text-sm font-medium text-teal-400 group-hover:text-teal-300">
                      Patient View
                    </span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 bg-black">
        {children}
      </main>

      {/* Navigation - Only render after mount */}
      {mounted && <Navigation />}
    </div>
  );
}

