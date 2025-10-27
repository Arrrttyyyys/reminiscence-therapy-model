'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Brain, Calendar, Award } from 'lucide-react';
import { ProgressData } from '@/types';
import { storage } from '@/lib/storage';
import { calculateSentimentScore, calculateEngagementScore, getWeeklyProgress } from '@/lib/utils';

export default function ProgressPage() {
  const [progress, setProgress] = useState<ProgressData[]>([]);
  const [sentimentScore, setSentimentScore] = useState(0);
  const [engagementScore, setEngagementScore] = useState(0);

  useEffect(() => {
    loadProgress();
    updateScores();
  }, []);

  const loadProgress = () => {
    let savedProgress = storage.getProgressData();
    
    // If no progress data exists, create sample data
    if (savedProgress.length === 0) {
      savedProgress = generateSampleData();
      savedProgress.forEach(p => storage.saveProgressData(p));
    }
    
    setProgress(savedProgress);
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
    setSentimentScore(calculateSentimentScore());
    setEngagementScore(calculateEngagementScore());
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const avgQuizScore = progress.length > 0
    ? Math.round(progress.reduce((sum, p) => sum + p.quizScore, 0) / progress.length)
    : 0;

  const avgEngagement = progress.length > 0
    ? Math.round(progress.reduce((sum, p) => sum + p.engagementTime, 0) / progress.length)
    : 0;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Progress</h2>
          <p className="text-gray-500">Track your journey and improvements</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-pink-100">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Quiz Performance</p>
                <p className="text-3xl font-bold text-gray-800">{avgQuizScore}%</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-600 font-medium">Improving</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-blue-100">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Daily Engagement</p>
                <p className="text-3xl font-bold text-gray-800">{avgEngagement} min</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Award className="w-4 h-4 text-orange-500" />
              <span className="text-orange-600 font-medium">Good</span>
            </div>
          </div>
        </div>

        {/* Sentiment & Engagement */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-green-100">
            <p className="text-sm text-gray-500 mb-2">Sentiment Score</p>
            <p className="text-4xl font-bold text-gray-800 mb-2">{sentimentScore}/100</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full"
                style={{ width: `${sentimentScore}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-purple-100">
            <p className="text-sm text-gray-500 mb-2">Engagement Level</p>
            <p className="text-4xl font-bold text-gray-800 mb-2">{engagementScore}/100</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                style={{ width: `${engagementScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-pink-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Quiz Performance Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progress.map(p => ({ date: formatDate(p.date), score: p.quizScore }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="score" stroke="#ec4899" fill="#fdf2f8" />
              <Line type="monotone" dataKey="score" stroke="#ec4899" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 border border-blue-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Daily Engagement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={progress.map(p => ({ date: formatDate(p.date), time: p.engagementTime }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="time" stroke="#3b82f6" fill="#dbeafe" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity Summary</h3>
          <div className="space-y-3">
            {progress.slice(-7).reverse().map((p, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-pink-500" />
                  <span className="text-gray-700">{formatDate(p.date)}</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-gray-600">Quiz: <strong>{p.quizScore}%</strong></span>
                  <span className="text-gray-600">Time: <strong>{p.engagementTime} min</strong></span>
                  <span className="text-gray-600">Recognitions: <strong>{p.recognitions}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Encouragement */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 border border-green-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Keep Going!</h4>
              <p className="text-sm text-gray-600">
                Your consistent engagement shows improvement. Remember, every small step counts! 🌟
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

