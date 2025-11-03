'use client';

import Layout from '@/components/Layout';
import { Settings as SettingsIcon, Bell, Shield, Palette, User, Trash2, Brain, Lock, Database } from 'lucide-react';
import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { useMLService } from '@/lib/ml/hooks';
import { ConsentSettings } from '@/lib/ml/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const { mlService, consent, updateConsent } = useMLService();
  const [mlStats, setMLStats] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSettings(storage.getSettings());
  }, []);

  useEffect(() => {
    if (mlService && mounted) {
      setMLStats(mlService.getTrainingStats());
    }
  }, [mlService, mounted]);

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    storage.saveSettings(newSettings);
  };

  const handleClearAll = () => {
    if (showConfirm) {
      if (typeof window !== 'undefined') {
        localStorage.clear();
        window.location.reload();
      }
    } else {
      setShowConfirm(true);
    }
  };

  const handleMLConsentChange = (key: keyof ConsentSettings, value: boolean) => {
    if (!consent) return;
    const newConsent = { ...consent, [key]: value };
    updateConsent(newConsent);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 pb-32 fade-in">
        {/* Header */}
        <div className="mb-6 slide-up">
          <h2 className="text-3xl font-bold text-white mb-2">Settings</h2>
          <p className="text-gray-400">Customize your Memory Lane experience</p>
        </div>

        {/* ML & AI Settings */}
        <div className="bg-gray-900/50 border border-teal-500/30 rounded-3xl shadow-lg p-6 slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">AI & Machine Learning</h3>
              <p className="text-sm text-gray-400">Personalized suggestions and predictions</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-xl">
              <p className="text-sm text-teal-300 mb-2">
                💡 <strong>How it works:</strong> AI models learn from your interactions to provide personalized recommendations. All training happens on your device. You control what data is collected.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <div className="flex-1">
                  <p className="font-medium text-white mb-1">Local Training</p>
                  <p className="text-sm text-gray-400">Fine-tune AI models on your device using your data</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent?.localTraining || false}
                    onChange={(e) => handleMLConsentChange('localTraining', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <div className="flex-1">
                  <p className="font-medium text-white mb-1">Share Aggregates</p>
                  <p className="text-sm text-gray-400">Contribute anonymized model updates to improve the system (differential privacy applied)</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent?.shareAggregates || false}
                    onChange={(e) => handleMLConsentChange('shareAggregates', e.target.checked)}
                    className="sr-only peer"
                    disabled={!consent?.localTraining}
                  />
                  <div className={`w-11 h-6 rounded-full peer ${!consent?.localTraining ? 'bg-gray-800 opacity-50' : 'bg-gray-700 peer-checked:bg-teal-500'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-500/30 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <div className="flex-1">
                  <p className="font-medium text-white mb-1">Collect Audio Features</p>
                  <p className="text-sm text-gray-400">Extract prosody features (speech rate, pauses) - no raw audio stored</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent?.collectAudioFeatures || false}
                    onChange={(e) => handleMLConsentChange('collectAudioFeatures', e.target.checked)}
                    className="sr-only peer"
                    disabled={!consent?.localTraining}
                  />
                  <div className={`w-11 h-6 rounded-full peer ${!consent?.localTraining ? 'bg-gray-800 opacity-50' : 'bg-gray-700 peer-checked:bg-teal-500'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-500/30 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <div className="flex-1">
                  <p className="font-medium text-white mb-1">Collect Context Data</p>
                  <p className="text-sm text-gray-400">Include time of day, day of week, and activity patterns</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent?.collectContext || false}
                    onChange={(e) => handleMLConsentChange('collectContext', e.target.checked)}
                    className="sr-only peer"
                    disabled={!consent?.localTraining}
                  />
                  <div className={`w-11 h-6 rounded-full peer ${!consent?.localTraining ? 'bg-gray-800 opacity-50' : 'bg-gray-700 peer-checked:bg-teal-500'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-500/30 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <div className="flex-1">
                  <p className="font-medium text-white mb-1">Caregiver View</p>
                  <p className="text-sm text-gray-400">Allow caregivers to see insights and observations</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent?.caregiverView || false}
                    onChange={(e) => handleMLConsentChange('caregiverView', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
              </div>
            </div>

            {mlStats && (
              <div className="mt-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <p className="text-sm text-gray-400 mb-2">Training Statistics:</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-teal-400 font-semibold">{mlStats.totalSamples || 0}</p>
                    <p className="text-gray-500">Total Samples</p>
                  </div>
                  <div>
                    <p className="text-purple-400 font-semibold">{mlStats.textEntries || 0}</p>
                    <p className="text-gray-500">Text Entries</p>
                  </div>
                  <div>
                    <p className="text-blue-400 font-semibold">{mlStats.quizSignals || 0}</p>
                    <p className="text-gray-500">Quiz Signals</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profile Settings */}
        <div className="bg-gray-900/50 border border-purple-500/30 rounded-3xl shadow-lg p-6 slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Profile</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
              <input
                type="text"
                value={settings.name || ''}
                onChange={(e) => updateSetting('name', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">About</label>
              <textarea
                value={settings.about || ''}
                onChange={(e) => updateSetting('about', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                rows={3}
                placeholder="Tell us about yourself"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-gray-900/50 border border-blue-500/30 rounded-3xl shadow-lg p-6 slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
              <div>
                <p className="font-medium text-white">Daily Reminders</p>
                <p className="text-sm text-gray-400">Get reminded to do your daily exercises</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.dailyReminders !== false}
                  onChange={(e) => updateSetting('dailyReminders', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
              <div>
                <p className="font-medium text-white">Memory Suggestions</p>
                <p className="text-sm text-gray-400">Get gentle activity suggestions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.suggestions !== false}
                  onChange={(e) => updateSetting('suggestions', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-gray-900/50 border border-green-500/30 rounded-3xl shadow-lg p-6 slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Privacy & Security</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-xl">
              <p className="text-sm text-teal-300 mb-1 font-semibold flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Local Storage
              </p>
              <p className="text-xs text-gray-300">
                All your data is stored locally on your device. Nothing leaves your browser.
              </p>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <p className="text-sm text-blue-300 mb-1 font-semibold flex items-center gap-2">
                <Database className="w-4 h-4" />
                No Sharing
              </p>
              <p className="text-xs text-gray-300">
                Your memories, journal entries, and progress are completely private.
              </p>
            </div>

            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
              <p className="text-sm text-purple-300 mb-1 font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4" />
                No Tracking
              </p>
              <p className="text-xs text-gray-300">
                We don't track your activity or collect any analytics.
              </p>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-gray-900/50 border border-red-500/30 rounded-3xl shadow-lg p-6 slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Danger Zone</h3>
          </div>
          
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p className="text-sm text-red-300 mb-3">
              This will permanently delete all your memories, journal entries, progress data, and settings. This action cannot be undone.
            </p>
            <button
              onClick={handleClearAll}
              className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
            >
              {showConfirm ? 'Confirm Delete All Data' : 'Clear All Data'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
