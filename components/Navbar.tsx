'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { LogOut, User } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, logout, user } = useAuth();

  const isPublicPage = pathname === '/' || pathname === '/login' || pathname?.startsWith('/about') || pathname?.startsWith('/solutions');
  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/memories') || pathname?.startsWith('/quizzes') || pathname?.startsWith('/journal') || pathname?.startsWith('/caregiver-insights') || pathname?.startsWith('/progress') || pathname?.startsWith('/settings');

  if (isPublicPage) {
    return (
      <nav className="bg-black/90 border-b border-teal-500/30">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white text-lg font-bold">ML</span>
            </div>
            <span className="text-xl font-bold text-white">Memory Lane</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/" className={`text-sm font-medium transition-colors hover:text-teal-400 ${pathname === '/' ? 'text-teal-400' : 'text-white'}`}>
              Home
            </Link>
            <Link href="/about" className={`text-sm font-medium transition-colors hover:text-teal-400 ${pathname?.startsWith('/about') ? 'text-teal-400' : 'text-white'}`}>
              About Us
            </Link>
            <Link href="/solutions" className={`text-sm font-medium transition-colors hover:text-teal-400 ${pathname?.startsWith('/solutions') ? 'text-teal-400' : 'text-white'}`}>
              Solutions
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className={`text-sm font-medium transition-colors hover:text-teal-400 ${pathname === '/dashboard' ? 'text-teal-400' : 'text-white'}`}>
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-500/20 border border-teal-500/30 rounded-lg">
                  <User className="w-4 h-4 text-teal-400" />
                  <span className="text-sm text-teal-400">{user?.email}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-medium hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg shadow-teal-500/20">
                Login/Register
              </Link>
            )}
          </div>
        </div>
      </nav>
    );
  }

  // Show navbar on dashboard pages too
  if (isDashboard && isAuthenticated) {
    return (
      <nav className="bg-black/90 border-b border-teal-500/30">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white text-lg font-bold">ML</span>
            </div>
            <span className="text-xl font-bold text-white">Memory Lane</span>
          </Link>

          <div className="flex items-center gap-6">
            <a href="/" className="text-sm font-medium transition-colors hover:text-teal-400 text-white">
              Back to Home
            </a>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-500/20 border border-teal-500/30 rounded-lg">
                <User className="w-4 h-4 text-teal-400" />
                <span className="text-sm text-teal-400">{user?.email}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return null;
}
