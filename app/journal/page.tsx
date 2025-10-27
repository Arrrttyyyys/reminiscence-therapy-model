'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { BookOpen, Heart, TrendingUp, Calendar } from 'lucide-react';
import { JournalEntry } from '@/types';
import { storage } from '@/lib/storage';
import { analyzeSentiment, extractKeywords, calculateSentimentScore } from '@/lib/utils';
import { format } from 'date-fns';

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [saving, setSaving] = useState(false);
  const [sentimentScore, setSentimentScore] = useState(50);

  useEffect(() => {
    loadEntries();
    updateSentimentScore();
  }, []);

  useEffect(() => {
    updateSentimentScore();
  }, [entries]);

  const loadEntries = () => {
    const savedEntries = storage.getJournalEntries();
    setEntries(savedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const updateSentimentScore = () => {
    setSentimentScore(calculateSentimentScore());
  };

  const handleSave = () => {
    if (!currentEntry.trim()) return;

    setSaving(true);

    const entry: JournalEntry = {
      id: Date.now().toString(),
      content: currentEntry,
      date: new Date().toISOString(),
      sentiment: analyzeSentiment(currentEntry),
      keywords: extractKeywords(currentEntry),
    };

    storage.saveJournalEntry(entry);
    loadEntries();
    setCurrentEntry('');
    setSaving(false);
  };

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === 'positive') return 'from-green-500 to-teal-500';
    if (sentiment === 'negative') return 'from-red-500 to-pink-500';
    return 'from-blue-500 to-cyan-500';
  };

  const getSentimentEmoji = (sentiment: string) => {
    if (sentiment === 'positive') return '😊';
    if (sentiment === 'negative') return '😔';
    return '😐';
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Journal</h2>
          <p className="text-gray-500">Share your thoughts and feelings</p>
        </div>

        {/* Sentiment Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-md p-5 border border-pink-100">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-12 h-12 bg-gradient-to-br ${getSentimentColor('positive')} rounded-xl flex items-center justify-center`}>
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{sentimentScore}</p>
                <p className="text-xs text-gray-500">Sentiment Score</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5 border border-blue-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{entries.length}</p>
                <p className="text-xs text-gray-500">Total Entries</p>
              </div>
            </div>
          </div>
        </div>

        {/* Write Entry */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-pink-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-pink-500" />
            Write Your Thoughts
          </h3>
          <textarea
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            placeholder="How are you feeling today? What do you remember? Share anything that comes to mind..."
            className="w-full h-48 px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
          />
          <button
            onClick={handleSave}
            disabled={saving || !currentEntry.trim()}
            className="mt-4 w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Entry'}
          </button>
        </div>

        {/* Entries List */}
        {entries.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Previous Entries</h3>
            <div className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 bg-gradient-to-br ${getSentimentColor(entry.sentiment)} rounded-lg flex items-center justify-center`}>
                        <span className="text-2xl">{getSentimentEmoji(entry.sentiment)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 capitalize">{entry.sentiment}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(entry.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{entry.content}</p>
                  {entry.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {entry.keywords.slice(0, 5).map((keyword, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {entries.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-pink-100">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No entries yet</h3>
            <p className="text-gray-500">Start writing your thoughts above</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

