'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, Heart, Users, Sparkles, Camera, BookOpen, BarChart3 } from 'lucide-react';

const Navbar = dynamic(() => import('@/components/Navbar'), {
  ssr: false,
});

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Remove auto-redirect - let users choose to go to dashboard

  const features = [
    {
      icon: Brain,
      title: 'Memory Games',
      description: 'Engaging cognitive exercises to help maintain and strengthen memory',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Camera,
      title: 'Memory Collection',
      description: 'Preserve and revisit cherished moments through photos and stories',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: BookOpen,
      title: 'Mood Tracker',
      description: 'Voice or text journaling to track emotions and daily experiences',
      color: 'from-green-500 to-teal-500',
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Monitor cognitive health and emotional wellbeing over time',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Users,
      title: 'Caregiver Insights',
      description: 'Share and receive personalized care strategies from family and caregivers',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Heart,
      title: 'Compassionate Care',
      description: 'Designed with empathy for individuals and their loved ones',
      color: 'from-pink-500 to-rose-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center fade-in">
            <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
              Memory Lane
            </h1>
            <p className="text-2xl text-gray-300 mb-4">
              Your Compassionate Digital Companion for Memory Care
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
              Empowering individuals with memory challenges through personalized reminiscence therapy, 
              cognitive exercises, and supportive tools designed with empathy and understanding.
            </p>
            <div className="flex gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    prefetch={false}
                    className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl font-semibold text-lg hover:from-teal-600 hover:to-cyan-700 transition-all shadow-lg shadow-teal-500/30 hover:scale-105"
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    href="/about"
                    prefetch={false}
                    className="px-8 py-4 bg-gray-800 text-white rounded-xl font-semibold text-lg hover:bg-gray-700 transition-all border border-teal-500/30 hover:scale-105"
                  >
                    Learn More
                  </Link>
                </>
              ) : (
                  <>
                    <Link
                      href="/login"
                      prefetch={false}
                      className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl font-semibold text-lg hover:from-teal-600 hover:to-cyan-700 transition-all shadow-lg shadow-teal-500/30 hover:scale-105"
                    >
                      Get Started
                    </Link>
                    <Link
                      href="/about"
                      prefetch={false}
                      className="px-8 py-4 bg-gray-800 text-white rounded-xl font-semibold text-lg hover:bg-gray-700 transition-all border border-teal-500/30 hover:scale-105"
                    >
                      Learn More
                    </Link>
                  </>
                )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Comprehensive Memory Care Solutions
          </h2>
          <p className="text-center text-gray-400 mb-12">
            Everything you need in one compassionate platform
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-gray-900/50 border border-teal-500/30 rounded-2xl p-6 hover:border-teal-500/60 hover:scale-105 transition-all duration-300 slide-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-gradient-to-r from-teal-900/20 to-cyan-900/20 border border-teal-500/30 rounded-3xl p-12 text-center">
            <Sparkles className="w-16 h-16 text-teal-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Built with Compassion and Science
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Our platform combines evidence-based memory care techniques with intuitive design, 
              creating a safe and supportive environment for both patients and their families.
            </p>
            <Link
              href="/solutions"
              prefetch={false}
              className="inline-block px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-cyan-700 transition-all shadow-lg shadow-teal-500/30"
            >
              Explore Our Solutions
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-teal-500/30 mt-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="text-xl font-bold text-white">Memory Lane</span>
            </div>
            <div className="flex gap-6">
              <Link href="/about" prefetch={false} className="text-gray-400 hover:text-teal-400 transition-colors">
                About Us
              </Link>
              <Link href="/solutions" prefetch={false} className="text-gray-400 hover:text-teal-400 transition-colors">
                Solutions
              </Link>
              <Link href="/login" prefetch={false} className="text-gray-400 hover:text-teal-400 transition-colors">
                Login
              </Link>
            </div>
          </div>
          <p className="text-center text-gray-500 mt-8">
            © 2024 Memory Lane. All rights reserved.
          </p>
        </div>
      </footer>
      </div>
  );
}