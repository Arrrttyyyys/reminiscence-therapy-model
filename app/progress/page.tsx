'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Brain, Calendar, Award, Lightbulb, TrendingDown, BarChart3, Sparkles } from 'lucide-react';
import { ProgressData } from '@/types';
import { storage } from '@/lib/storage';
import { calculateSentimentScore, calculateEngagementScore, getWeeklyProgress } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useMLService } from '@/lib/ml/hooks';
import { insightsGenerator, ProgressInsight } from '@/lib/insights';

export default function ProgressPage() {
  const [progress, setProgress] = useState<ProgressData[]>([]);
  const [sentimentScore, setSentimentScore] = useState(0);
  const [engagementScore, setEngagementScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const { mlService, recommendation } = useMLService();
  const [insights, setInsights] = useState<ProgressInsight | null>(null);

  useEffect(() => {
    loadProgress();
  }, []);

  useEffect(() => {
    if (progress.length > 0) {
      updateScores();
      generateInsights();
    }
    setLoading(false);
  }, [progress]);

  const generateInsights = () => {
    const progressData = progress;
    const journalEntries = storage.getJournalEntries();
    const quizResults = storage.getQuizResults();
    const generatedInsights = insightsGenerator.generateInsights(progressData, journalEntries, quizResults);
    setInsights(generatedInsights);
  };

  const loadProgress = () => {
    try {
      let savedProgress = storage.getProgressData();
      
      // If no progress data exists, create sample data
      if (savedProgress.length === 0) {
        savedProgress = generateSampleData();
        savedProgress.forEach(p => storage.saveProgressData(p));
      }
      
      setProgress(savedProgress);
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  const generateSampleData = () => {
    const data: ProgressData[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString(),
        quizScore: Math.floor(Math.random() * 40) + 60, // 60-100
        engagementTime: Math.floor(Math.random() * 30) + 10, // 10-40 minutes
        sentimentScore: Math.floor(Math.random() * 30) + 50, // 50-80
        recognitions: Math.floor(Math.random() * 3) + 4, // 4-7
      });
    }
    
    return data;
  };

  const updateScores = () => {
    try {
      setSentimentScore(calculateSentimentScore());
      setEngagementScore(calculateEngagementScore());
    } catch (error) {
      console.error('Failed to calculate scores:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (error) {
      return dateStr;
    }
  };

  const avgQuizScore = progress.length > 0
    ? Math.round(progress.reduce((sum, p) => sum + p.quizScore, 0) / progress.length)
    : 0;

  const avgEngagement = progress.length > 0
    ? Math.round(progress.reduce((sum, p) => sum + p.engagementTime, 0) / progress.length)
    : 0;

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" text="Loading your progress..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6 pb-32 fade-in">
        {/* Header */}
        <div className="mb-6 slide-up">
          <h2 className="text-3xl font-bold text-white mb-2">Your Progress</h2>
          <p className="text-gray-400">Track your journey and improvements</p>
        </div>

        {/* ML Recommendation Card */}
        {recommendation && (
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-3xl p-6 slide-up hover-lift mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">AI-Powered Insight</h3>
                <p className="text-gray-300 mb-3">
                  <strong className="text-purple-300">{recommendation.activity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</strong>
                </p>
                <p className="text-sm text-gray-400 italic mb-3">"{recommendation.reason}"</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-800 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                      style={{ width: `${recommendation.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{Math.round(recommendation.confidence * 100)}% confidence</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900/50 border border-purple-500/30 rounded-2xl shadow-md p-6 slide-up hover-pop">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-400 mb-1">Quiz Performance</p>
                <p className="text-3xl font-bold text-white">{avgQuizScore}%</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-medium">Improving</span>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-blue-500/30 rounded-2xl shadow-md p-6 slide-up hover-pop">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-400 mb-1">Daily Engagement</p>
                <p className="text-3xl font-bold text-white">{avgEngagement} min</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Award className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 font-medium">Good</span>
            </div>
          </div>
        </div>

        {/* Sentiment & Engagement */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900/50 border border-green-500/30 rounded-2xl shadow-md p-6 slide-up hover-pop">
            <p className="text-sm text-gray-400 mb-2">Sentiment Score</p>
            <p className="text-4xl font-bold text-white mb-2">{sentimentScore}/100</p>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full transition-all"
                style={{ width: `${sentimentScore}%` }}
              />
            </div>
          </div>

          <div className="bg-gray-900/50 border border-purple-500/30 rounded-2xl shadow-md p-6 slide-up hover-pop">
            <p className="text-sm text-gray-400 mb-2">Engagement Level</p>
            <p className="text-4xl font-bold text-white mb-2">{engagementScore}/100</p>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                style={{ width: `${engagementScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="bg-gray-900/50 border border-teal-500/30 rounded-3xl shadow-lg p-6 slide-up hover-lift">
          <h3 className="text-xl font-semibold text-white mb-6">Quiz Performance Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progress.map(p => ({ date: formatDate(p.date), score: p.quizScore }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <YAxis stroke="#9ca3af" domain={[0, 100]} tick={{ fill: '#9ca3af' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#111827', 
                  border: '1px solid #374151', 
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Area type="monotone" dataKey="score" stroke="#14b8a6" fill="#14b8a620" />
              <Line type="monotone" dataKey="score" stroke="#14b8a6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900/50 border border-teal-500/30 rounded-3xl shadow-lg p-6 slide-up hover-lift">
          <h3 className="text-xl font-semibold text-white mb-6">Daily Engagement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={progress.map(p => ({ date: formatDate(p.date), time: p.engagementTime }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#111827', 
                  border: '1px solid #374151', 
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Area type="monotone" dataKey="time" stroke="#14b8a6" fill="#14b8a620" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-3xl shadow-lg p-6 slide-up">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Activity Summary</h3>
          <div className="space-y-3">
            {progress.slice(-7).reverse().map((p, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-teal-500/50 transition-colors">
                <div className="flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-teal-400" />
                  <span className="text-white">{formatDate(p.date)}</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-gray-400">Quiz: <strong className="text-white">{p.quizScore}%</strong></span>
                  <span className="text-gray-400">Time: <strong className="text-white">{p.engagementTime} min</strong></span>
                  <span className="text-gray-400">Recognitions: <strong className="text-white">{p.recognitions}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Encouragement */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-6 border border-teal-500/30 slide-up hover-lift">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Keep Going!</h4>
              <p className="text-sm text-gray-100">
                Your consistent engagement shows improvement. Remember, every small step counts! 🌟
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
