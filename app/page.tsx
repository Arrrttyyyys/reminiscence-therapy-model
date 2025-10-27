'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Sparkles, Camera, Music, BookOpen, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { generateSuggestions } from '@/lib/utils';
import { storage } from '@/lib/storage';

export default function Home() {
  const [suggestion, setSuggestion] = useState('');
  const [memoryCount, setMemoryCount] = useState(0);

  useEffect(() => {
    setSuggestion(generateSuggestions());
    setMemoryCount(storage.getMemories().length);
  }, []);

  const quickActions = [
    { href: '/memories', icon: Camera, title: 'View Memories', desc: 'Explore your collection', color: 'from-pink-500 to-rose-500' },
    { href: '/quizzes', icon: Sparkles, title: 'Memory Games', desc: 'Test your recall', color: 'from-purple-500 to-pink-500' },
    { href: '/journal', icon: BookOpen, title: 'Write Journal', desc: 'Share your thoughts', color: 'from-blue-500 to-cyan-500' },
    { href: '/progress', icon: TrendingUp, title: 'See Progress', desc: 'Track your journey', color: 'from-green-500 to-teal-500' },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-pink-100">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-400 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Memory Lane</h2>
              <p className="text-gray-600 mb-3">
                Your companion for cherished memories and gentle mental exercises.
              </p>
              <div className="bg-pink-50 border border-pink-200 rounded-xl p-3">
                <p className="text-sm text-pink-700">
                  <span className="font-semibold">💡 Suggestion:</span> {suggestion}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-md p-5 border border-purple-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{memoryCount}</p>
                <p className="text-sm text-gray-500">Memories</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5 border border-blue-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">Daily</p>
                <p className="text-sm text-gray-500">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 border border-gray-100 hover:scale-105"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1">{action.title}</h4>
                  <p className="text-sm text-gray-500">{action.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Encouragement */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl p-6 text-white shadow-lg">
          <h3 className="text-xl font-bold mb-2">Remember</h3>
          <p className="text-sm opacity-90">
            Every memory is precious, and every moment matters. Take your time, explore at your own pace, and enjoy the journey back to cherished times.
          </p>
        </div>
      </div>
    </Layout>
  );
}
