'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Images, Brain, BookOpen, BarChart3, Settings, Users } from 'lucide-react';
import { useView } from '@/lib/viewContext';

const allNavItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard', patientView: true, caregiverView: true },
  { href: '/memories', icon: Images, label: 'Memories', patientView: true, caregiverView: true },
  { href: '/quizzes', icon: Brain, label: 'Memory Games', patientView: true, caregiverView: true },
  { href: '/journal', icon: BookOpen, label: 'Mood Tracker', patientView: true, caregiverView: true },
  { href: '/caregiver-insights', icon: Users, label: 'Caregiver', patientView: false, caregiverView: true },
  { href: '/progress', icon: BarChart3, label: 'Progress', patientView: false, caregiverView: true },
];

export default function Navigation() {
  const [mounted, setMounted] = useState(false);
  const [pathname, setPathname] = useState<string | null>(null);
  const router = useRouter();
  const { viewMode } = useView();
  
  useEffect(() => {
    setMounted(true);
    // Get pathname from window location to avoid SSR issues
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
      
      // Listen for navigation changes
      const handleLocationChange = () => {
        setPathname(window.location.pathname);
      };
      
      // Listen for popstate (back/forward buttons)
      window.addEventListener('popstate', handleLocationChange);
      
      // Poll for pathname changes (for client-side navigation)
      const interval = setInterval(() => {
        if (window.location.pathname !== pathname) {
          setPathname(window.location.pathname);
        }
      }, 100);
      
      return () => {
        window.removeEventListener('popstate', handleLocationChange);
        clearInterval(interval);
      };
    }
  }, [pathname]);
  
  // Only show navigation on authenticated pages
  const authPages = ['/dashboard', '/memories', '/quizzes', '/journal', '/caregiver-insights', '/progress', '/settings'];
  const shouldShow = mounted && pathname && authPages.some(page => pathname?.startsWith(page));

  if (!mounted || !shouldShow) return null;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    router.push(href);
  };

  // Filter nav items based on view mode
  const navItems = allNavItems.filter(item => {
    return viewMode === 'patient' ? item.patientView : item.caregiverView;
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-teal-500/30 shadow-lg z-50">
      <div className="flex justify-around items-center h-20 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-b from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30'
                  : 'text-gray-400 hover:text-teal-400 hover:bg-teal-500/10'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium text-center leading-tight">{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
