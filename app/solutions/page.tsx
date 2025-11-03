'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Brain, Camera, BookOpen, Users, BarChart3, Shield } from 'lucide-react';

const Navbar = dynamic(() => import('@/components/Navbar'), {
  ssr: false,
});

export default function SolutionsPage() {
  const solutions = [
    {
      icon: Brain,
      title: 'Memory Games & Exercises',
      description: 'Evidence-based cognitive exercises designed to maintain and strengthen memory function through engaging, personalized challenges.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Camera,
      title: 'Digital Memory Collection',
      description: 'Preserve and organize cherished memories with photos, videos, audio recordings, and personal stories in one secure place.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: BookOpen,
      title: 'Voice & Text Mood Tracking',
      description: 'Express your thoughts through voice (speech-to-text) or text. Track emotions, identify patterns, and gain insights into wellbeing.',
      color: 'from-green-500 to-teal-500',
    },
    {
      icon: Users,
      title: 'Caregiver Collaboration',
      description: 'Enable family members and caregivers to share insights, strategies, and observations for personalized care.',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: BarChart3,
      title: 'Progress Monitoring',
      description: 'Visualize cognitive health trends, memory performance, and emotional wellbeing over time with detailed analytics.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Your data stays with you. All information is stored locally on your device with industry-standard security measures.',
      color: 'from-teal-500 to-cyan-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Navbar />
      
      <div className="container mx-auto px-6 py-16 max-w-6xl">
        <div className="space-y-12 fade-in">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
              Our Solutions
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Comprehensive tools for memory care, designed with compassion
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((solution, idx) => {
              const Icon = solution.icon;
              return (
                <div
                  key={idx}
                  className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 hover:border-teal-500/50 hover:scale-105 transition-all duration-300 slide-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${solution.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{solution.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{solution.description}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-teal-900/20 to-cyan-900/20 border border-teal-500/30 rounded-3xl p-12 text-center slide-up">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Experience the power of personalized memory care and cognitive support.
            </p>
            <Link
              href="/login"
              prefetch={false}
              className="inline-block px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-cyan-700 transition-all shadow-lg shadow-teal-500/30 hover:scale-105"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
