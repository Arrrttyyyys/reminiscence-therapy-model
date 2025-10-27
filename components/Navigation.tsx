'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Images, Brain, BookOpen, BarChart3, Settings, Users, Heart } from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/memories', icon: Images, label: 'Memories' },
  { href: '/quizzes', icon: Brain, label: 'Memory Games' },
  { href: '/journal', icon: BookOpen, label: 'Mood Tracker' },
  { href: '/caregiver-insights', icon: Users, label: 'Caregiver' },
  { href: '/progress', icon: BarChart3, label: 'Progress' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function Navigation() {
  const pathname = usePathname();
  
  // Only show navigation on authenticated pages
  const authPages = ['/dashboard', '/memories', '/quizzes', '/journal', '/caregiver-insights', '/progress', '/settings'];
  const shouldShow = authPages.some(page => pathname?.startsWith(page));

  if (!shouldShow) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-teal-500/30 shadow-lg z-50">
      <div className="flex justify-around items-center h-20 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-b from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30'
                  : 'text-gray-400 hover:text-teal-400 hover:bg-teal-500/10'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

