'use client';

import dynamic from 'next/dynamic';
import { Heart, Target, Users, Award } from 'lucide-react';

const Navbar = dynamic(() => import('@/components/Navbar'), {
  ssr: false,
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Navbar />
      
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="space-y-12 fade-in">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
              About Memory Lane
            </h1>
            <p className="text-xl text-gray-300">
              Empowering memory care through technology and compassion
            </p>
          </div>

          <div className="bg-gray-900/50 border border-teal-500/30 rounded-3xl p-8 slide-up">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">Our Mission</h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  At Memory Lane, we believe that every memory is precious and that technology should serve 
                  humanity with empathy and understanding. Our platform provides a safe, supportive environment 
                  for individuals experiencing memory challenges, their families, and caregivers.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-purple-500/30 rounded-3xl p-8 slide-up">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">What We Do</h2>
                <p className="text-gray-300 mb-4 text-lg">
                  Memory Lane combines evidence-based reminiscence therapy with intuitive design to create 
                  meaningful experiences:
                </p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                    Cognitive exercises and memory games
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                    Digital memory preservation and organization
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                    Mood and emotion tracking
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                    Progress monitoring and insights
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                    Caregiver and family collaboration tools
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-indigo-500/30 rounded-3xl p-8 slide-up">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">Our Values</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <h3 className="font-semibold text-teal-400 mb-2">Compassion</h3>
                    <p className="text-gray-300 text-sm">We approach every feature with empathy and understanding.</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <h3 className="font-semibold text-purple-400 mb-2">Privacy</h3>
                    <p className="text-gray-300 text-sm">Your data and memories are secure and private.</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <h3 className="font-semibold text-cyan-400 mb-2">Simplicity</h3>
                    <p className="text-gray-300 text-sm">Intuitive design that anyone can use with ease.</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <h3 className="font-semibold text-pink-400 mb-2">Innovation</h3>
                    <p className="text-gray-300 text-sm">Latest research-backed techniques and technologies.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-3xl p-8 text-white text-center slide-up">
            <Award className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Join Us</h2>
            <p className="text-gray-100 mb-6">
              Together, we're making memory care more accessible, effective, and compassionate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
