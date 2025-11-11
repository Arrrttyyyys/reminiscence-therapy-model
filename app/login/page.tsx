'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { LogIn, Mail, Lock, UserPlus, User } from 'lucide-react';

const Navbar = dynamic(() => import('@/components/Navbar'), {
  ssr: false,
});

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userRole, setUserRole] = useState<'patient' | 'caregiver' | 'family'>('patient');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isRegistering) {
      // Registration flow
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const result = register(email, password, userRole);
      if (result.success) {
        router.push('/');
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } else {
      // Login flow
      if (login(email, password)) {
        router.push('/');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Navbar />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-6">
        <div className="w-full max-w-md fade-in">
          <div className="bg-gray-900/50 border border-teal-500/30 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {isRegistering ? (
                  <UserPlus className="w-8 h-8 text-white" />
                ) : (
                  <LogIn className="w-8 h-8 text-white" />
                )}
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {isRegistering ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-gray-400">
                {isRegistering ? 'Sign up to get started with ReminoraCare' : 'Sign in to access ReminoraCare'}
              </p>
            </div>

            {/* Toggle between login and register */}
            <div className="mb-6 flex gap-2 p-1 bg-gray-800/50 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(false);
                  setError('');
                  setConfirmPassword('');
                }}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  !isRegistering
                    ? 'bg-teal-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(true);
                  setError('');
                }}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  isRegistering
                    ? 'bg-teal-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                    placeholder={isRegistering ? "At least 6 characters" : "••••••••"}
                    required
                    minLength={isRegistering ? 6 : undefined}
                  />
                </div>
              </div>

              {isRegistering && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                        placeholder="Confirm your password"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Account Type</label>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => setUserRole('patient')}
                        className={`px-4 py-3 rounded-xl font-medium transition-all ${
                          userRole === 'patient'
                            ? 'bg-teal-500 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        Patient
                      </button>
                      <button
                        type="button"
                        onClick={() => setUserRole('caregiver')}
                        className={`px-4 py-3 rounded-xl font-medium transition-all ${
                          userRole === 'caregiver'
                            ? 'bg-teal-500 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        Caregiver
                      </button>
                      <button
                        type="button"
                        onClick={() => setUserRole('family')}
                        className={`px-4 py-3 rounded-xl font-medium transition-all ${
                          userRole === 'family'
                            ? 'bg-teal-500 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        Family
                      </button>
                    </div>
                    <p className="text-xs text-gray-400">
                      {userRole === 'patient' && 'Access all features: memories, games, mood tracking, and progress'}
                      {userRole === 'caregiver' && 'Manage medications, add insights, and track patient progress'}
                      {userRole === 'family' && 'View progress, add insights, and support your loved one'}
                    </p>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-4 rounded-xl font-semibold hover:from-teal-600 hover:to-cyan-700 transition-all shadow-lg shadow-teal-500/30 hover:scale-105"
              >
                {isRegistering ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            {!isRegistering && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsRegistering(true)}
                  className="text-teal-400 hover:text-teal-300 text-sm font-medium"
                >
                  Don't have an account? Register here
                </button>
              </div>
            )}

            {!isRegistering && (
              <div className="mt-6 space-y-3">
                <div className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-xl">
                  <p className="text-sm text-teal-400 text-center mb-2">
                    <strong className="text-teal-300">Demo Admin Account</strong>
                  </p>
                  <p className="text-xs text-teal-400/80 text-center">
                    Email: admin@reminoracare.com<br />
                    Password: admin123
                  </p>
                </div>
                
                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                  <p className="text-sm text-purple-400 text-center mb-2">
                    <strong className="text-purple-300">Demo Patient Account (Sample Data)</strong>
                  </p>
                  <p className="text-xs text-purple-400/80 text-center">
                    Email: patient@reminoracare.com<br />
                    Password: patient123
                  </p>
                  <p className="text-xs text-purple-300/70 text-center mt-2 italic">
                    Includes: 7 memories, 15 journal entries, progress data, and quiz results
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
