'use client';

import { useEffect, useState, useRef } from 'react';
import Layout from '@/components/Layout';
import { BookOpen, Heart, TrendingUp, Calendar, Mic, MicOff } from 'lucide-react';
import { JournalEntry } from '@/types';
import { storage } from '@/lib/storage';
import { analyzeSentiment, extractKeywords, calculateSentimentScore } from '@/lib/utils';
import { format } from 'date-fns';

export default function MoodTrackerPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [saving, setSaving] = useState(false);
  const [sentimentScore, setSentimentScore] = useState(50);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    loadEntries();
    updateSentimentScore();
    
    // Initialize Speech Recognition
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setCurrentEntry(prev => prev + transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognition);
    }
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

  const handleVoiceRecording = () => {
    if (!recognition) {
      alert('Speech recognition is not available in your browser.');
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
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
      <div className="max-w-4xl mx-auto space-y-6 pb-32 fade-in">
        {/* Header */}
        <div className="mb-6 slide-up">
          <h2 className="text-3xl font-bold text-white mb-2">Mood Tracker</h2>
          <p className="text-gray-400">Share your thoughts and feelings through text or voice</p>
        </div>

        {/* Sentiment Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900/50 border border-teal-500/30 rounded-2xl shadow-md p-5 slide-up">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-12 h-12 bg-gradient-to-br ${getSentimentColor('positive')} rounded-xl flex items-center justify-center`}>
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{sentimentScore}</p>
                <p className="text-xs text-gray-400">Sentiment Score</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-blue-500/30 rounded-2xl shadow-md p-5 slide-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{entries.length}</p>
                <p className="text-xs text-gray-400">Total Entries</p>
              </div>
            </div>
          </div>
        </div>

        {/* Write Entry */}
        <div className="bg-gray-900/50 border border-teal-500/30 rounded-3xl shadow-lg p-6 slide-up">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-teal-400" />
            Share Your Thoughts
          </h3>
          <textarea
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            placeholder="How are you feeling today? What do you remember? Share anything that comes to mind..."
            className="w-full h-48 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none text-white placeholder-gray-500"
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleVoiceRecording}
              className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                isRecording
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-800 text-white border border-gray-700 hover:bg-gray-700'
              }`}
            >
              {isRecording ? (
                <>
                  <Mic className="w-5 h-5 animate-pulse" />
                  <span>Stop Recording</span>
                </>
              ) : (
                <>
                  <MicOff className="w-5 h-5" />
                  <span>Start Voice</span>
                </>
              )}
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !currentEntry.trim()}
              className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        </div>

        {/* Entries List */}
        {entries.length > 0 && (
          <div className="slide-up">
            <h3 className="text-xl font-semibold text-white mb-4">Previous Entries</h3>
            <div className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-gray-900/50 border border-gray-700 rounded-2xl shadow-md p-5 hover:border-teal-500/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 bg-gradient-to-br ${getSentimentColor(entry.sentiment)} rounded-lg flex items-center justify-center`}>
                        <span className="text-2xl">{getSentimentEmoji(entry.sentiment)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-white capitalize">{entry.sentiment}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(entry.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-3">{entry.content}</p>
                  {entry.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {entry.keywords.slice(0, 5).map((keyword, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-teal-500/20 text-teal-400 rounded-full text-xs border border-teal-500/30"
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
          <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-12 text-center slide-up">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No entries yet</h3>
            <p className="text-gray-400">Start writing or recording your thoughts above</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

