'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Users, Heart, Lightbulb, Clock, Check } from 'lucide-react';
import { format } from 'date-fns';

interface CaregiverInsight {
  id: string;
  author: string;
  relationship: string;
  insight: string;
  category: 'memory' | 'calm' | 'engagement' | 'safety' | 'routine';
  date: string;
}

const insightCategories = {
  memory: { label: 'Memory Triggers', icon: '🧠', color: 'from-purple-500 to-pink-500' },
  calm: { label: 'Calming Strategies', icon: '💆', color: 'from-blue-500 to-cyan-500' },
  engagement: { label: 'Engagement Ideas', icon: '🎯', color: 'from-green-500 to-teal-500' },
  safety: { label: 'Safety Tips', icon: '🛡️', color: 'from-red-500 to-orange-500' },
  routine: { label: 'Routine Helpers', icon: '📅', color: 'from-indigo-500 to-purple-500' },
};

export default function CaregiverInsightsPage() {
  const [insights, setInsights] = useState<CaregiverInsight[]>([]);
  const [newInsight, setNewInsight] = useState('');
  const [author, setAuthor] = useState('');
  const [relationship, setRelationship] = useState('');
  const [category, setCategory] = useState<CaregiverInsight['category']>('memory');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = () => {
    const stored = localStorage.getItem('memory-lane-insights');
    if (stored) {
      setInsights(JSON.parse(stored));
    }
  };

  const handleSave = () => {
    if (!newInsight.trim() || !author.trim() || !relationship.trim()) return;

    setSaving(true);

    const insight: CaregiverInsight = {
      id: Date.now().toString(),
      author,
      relationship,
      insight: newInsight,
      category,
      date: new Date().toISOString(),
    };

    const updated = [insight, ...insights];
    localStorage.setItem('memory-lane-insights', JSON.stringify(updated));
    loadInsights();

    setNewInsight('');
    setAuthor('');
    setRelationship('');
    setCategory('memory');
    setSaving(false);
  };

  const removeInsight = (id: string) => {
    const updated = insights.filter(i => i.id !== id);
    localStorage.setItem('memory-lane-insights', JSON.stringify(updated));
    loadInsights();
  };

  const getCategoryInfo = (cat: string) => {
    return insightCategories[cat as keyof typeof insightCategories] || insightCategories.memory;
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 pb-32 fade-in">
        {/* Header */}
        <div className="mb-6 slide-up">
          <h2 className="text-3xl font-bold text-white mb-2">Caregiver Insights</h2>
          <p className="text-gray-400">Share and view helpful strategies from family and caregivers</p>
        </div>

        {/* Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-900/50 border border-teal-500/30 rounded-2xl p-5 slide-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{insights.length}</p>
                <p className="text-xs text-gray-400">Total Insights</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-purple-500/30 rounded-2xl p-5 slide-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">
                  {new Set(insights.map(i => i.author)).size}
                </p>
                <p className="text-xs text-gray-400">Contributors</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-blue-500/30 rounded-2xl p-5 slide-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">Last 7</p>
                <p className="text-xs text-gray-400">Days Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add New Insight */}
        <div className="bg-gray-900/50 border border-teal-500/30 rounded-3xl p-6 slide-up">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-400" />
            Share an Insight
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="John, Sarah, etc."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Relationship</label>
                <input
                  type="text"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  placeholder="Family, Caregiver, etc."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CaregiverInsight['category'])}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-teal-500"
              >
                {Object.entries(insightCategories).map(([key, info]) => (
                  <option key={key} value={key}>{info.icon} {info.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Your Insight</label>
              <textarea
                value={newInsight}
                onChange={(e) => setNewInsight(e.target.value)}
                placeholder="Share what helps them remember better, what calms them, activities they enjoy, safety tips, or helpful routines..."
                className="w-full h-32 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 resize-none"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving || !newInsight.trim() || !author.trim() || !relationship.trim()}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Insight'}
            </button>
          </div>
        </div>

        {/* Insights List */}
        {insights.length > 0 && (
          <div className="slide-up">
            <h3 className="text-xl font-semibold text-white mb-4">All Insights</h3>
            <div className="space-y-4">
              {insights.map((insight) => {
                const catInfo = getCategoryInfo(insight.category);
                return (
                  <div
                    key={insight.id}
                    className="bg-gray-900/50 border border-gray-700 rounded-2xl p-5 hover:border-teal-500/50 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${catInfo.color} rounded-xl flex items-center justify-center`}>
                          <span className="text-2xl">{catInfo.icon}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-white">{insight.author}</p>
                          <p className="text-sm text-gray-400">{insight.relationship}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3" />
                          {format(new Date(insight.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-3">{insight.insight}</p>
                    <span className="inline-block px-3 py-1 bg-teal-500/20 text-teal-400 rounded-full text-xs border border-teal-500/30">
                      {catInfo.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {insights.length === 0 && (
          <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-12 text-center slide-up">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No insights yet</h3>
            <p className="text-gray-400">Start sharing helpful strategies above</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
