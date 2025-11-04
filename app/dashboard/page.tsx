'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Sparkles, Camera, Music, BookOpen, TrendingUp, Brain, Users, BarChart3, Settings, Video, Home, Lightbulb } from 'lucide-react';
import { generateSuggestions } from '@/lib/utils';
import { storage } from '@/lib/storage';
import { useMLService } from '@/lib/ml/hooks';

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [suggestion, setSuggestion] = useState('');
  const [memoryCount, setMemoryCount] = useState(0);
  const [journalCount, setJournalCount] = useState(0);
  const [quizCount, setQuizCount] = useState(0);
  const { recommendation } = useMLService();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    setSuggestion(generateSuggestions());
    setMemoryCount(storage.getMemories().length);
    setJournalCount(storage.getJournalEntries().length);
    setQuizCount(storage.getQuizResults().length);
  }, [isAuthenticated, router]);

  const quickActions = [
    { href: '/memories', icon: Camera, title: 'View Memories', desc: 'Explore your collection', color: 'from-pink-500 to-rose-500', gradient: 'from-blue-500 to-cyan-500' },
    { href: '/quizzes', icon: Brain, title: 'Memory Games', desc: 'Test your recall', color: 'from-purple-500 to-pink-500', gradient: 'from-purple-500 to-pink-500' },
    { href: '/journal', icon: BookOpen, title: 'Mood Tracker', desc: 'Share your thoughts', color: 'from-blue-500 to-cyan-500', gradient: 'from-green-500 to-teal-500' },
    { href: '/caregiver-insights', icon: Users, title: 'Caregiver Insights', desc: 'Get personalized tips', color: 'from-indigo-500 to-purple-500', gradient: 'from-indigo-500 to-purple-500' },
    { href: '/progress', icon: TrendingUp, title: 'See Progress', desc: 'Track your journey', color: 'from-green-500 to-teal-500', gradient: 'from-orange-500 to-red-500' },
    { href: '/settings', icon: Settings, title: 'Settings', desc: 'Customize your experience', color: 'from-gray-500 to-gray-600', gradient: 'from-gray-500 to-gray-600' },
  ];

  return (
    <Layout>
      <div id="main-content" className="max-w-6xl mx-auto space-y-8 pb-32 fade-in bg-black text-white">
        {/* Back to Main Page Button */}
        <div className="flex justify-end slide-up">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500/10 border border-teal-500/30 text-teal-400 rounded-xl font-semibold hover:bg-teal-500/20 hover:border-teal-500/50 transition-all duration-300 hover:scale-105"
          >
            <Home className="w-5 h-5" />
            Back to Main Page
          </a>
        </div>

        {/* Welcome Section */}
        <div className="bg-gray-900/50 border border-teal-500/30 rounded-3xl p-8 shadow-lg slide-up hover-lift">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">Welcome to ReminoraCare</h2>
                <p className="text-gray-300 mb-4 text-lg">
                  Your companion for cherished memories and gentle mental exercises.
                </p>
                <div className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-4">
                  <p className="text-sm text-teal-300">
                    <span className="font-semibold">💡 Suggestion:</span> {suggestion}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-900/50 border border-purple-500/30 rounded-2xl p-6 shadow-md slide-up hover-pop">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{memoryCount}</p>
                  <p className="text-sm text-gray-400">Memories</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-teal-500/30 rounded-2xl p-6 shadow-md slide-up hover-pop">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{journalCount}</p>
                  <p className="text-sm text-gray-400">Entries</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-purple-500/30 rounded-2xl p-6 shadow-md slide-up hover-pop">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{quizCount}</p>
                  <p className="text-sm text-gray-400">Games</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <a
                    key={action.href}
                    href={action.href}
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(action.href);
                    }}
                    className="bg-gray-900/50 border border-gray-700 rounded-2xl shadow-md hover:border-teal-500/50 hover:shadow-xl transition-all duration-300 p-6 hover:scale-105 slide-up group card-hover cursor-pointer"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-1">{action.title}</h4>
                    <p className="text-sm text-gray-400">{action.desc}</p>
                  </a>
                );
              })}
            </div>
          </div>

          {/* AI Activity Recommendation */}
          {recommendation && (
            <div className="bg-gray-900/50 border border-purple-500/30 rounded-3xl p-6 slide-up hover-lift">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">AI Suggestion</h3>
                  <p className="text-gray-300 mb-3">{recommendation.activity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                  <p className="text-sm text-gray-400 italic">"{recommendation.reason}"</p>
                  <div className="mt-4">
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                        style={{ width: `${recommendation.confidence * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Confidence: {Math.round(recommendation.confidence * 100)}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Encouragement */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-lg hover:shadow-2xl transition-all slide-up hover-lift">
          <h3 className="text-2xl font-bold mb-2">Remember</h3>
          <p className="text-sm opacity-90">
            Every memory is precious, and every moment matters. Take your time, explore at your own pace, and enjoy the journey back to cherished times.
          </p>
          </div>
      </div>
    </Layout>
  );
}
