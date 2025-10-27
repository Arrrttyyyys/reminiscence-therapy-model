'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Images, Brain, BookOpen, BarChart3, Settings } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/memories', icon: Images, label: 'Memories' },
  { href: '/quizzes', icon: Brain, label: 'Memory Games' },
  { href: '/journal', icon: BookOpen, label: 'Journal' },
  { href: '/progress', icon: BarChart3, label: 'Progress' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-pink-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-20 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-20 h-16 rounded-t-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-b from-pink-500 to-rose-400 text-white'
                  : 'text-gray-600 hover:bg-pink-50'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

