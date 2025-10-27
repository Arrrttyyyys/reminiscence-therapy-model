'use client';

import Layout from '@/components/Layout';
import { Settings as SettingsIcon, Bell, Shield, Palette, User, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { storage } from '@/lib/storage';

export default function SettingsPage() {
  const [settings, setSettings] = useState(storage.getSettings());
  const [showConfirm, setShowConfirm] = useState(false);

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    storage.saveSettings(newSettings);
  };

  const handleClearAll = () => {
    if (showConfirm) {
      localStorage.clear();
      window.location.reload();
    } else {
      setShowConfirm(true);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Settings</h2>
          <p className="text-gray-500">Customize your Memory Lane experience</p>
        </div>

        {/* Profile Settings */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-pink-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Profile</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
              <input
                type="text"
                value={settings.name || ''}
                onChange={(e) => updateSetting('name', e.target.value)}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
              <textarea
                value={settings.about || ''}
                onChange={(e) => updateSetting('about', e.target.value)}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                rows={3}
                placeholder="Tell us about yourself"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-blue-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Daily Reminders</p>
                <p className="text-sm text-gray-500">Get reminded to do your daily exercises</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.dailyReminders !== false}
                  onChange={(e) => updateSetting('dailyReminders', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Memory Suggestions</p>
                <p className="text-sm text-gray-500">Get gentle activity suggestions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.suggestions !== false}
                  onChange={(e) => updateSetting('suggestions', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-green-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Privacy & Security</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <p className="text-sm text-green-800 mb-1 font-semibold">🔒 Local Storage</p>
              <p className="text-xs text-green-700">
                All your data is stored locally on your device. Nothing leaves your browser.
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-800 mb-1 font-semibold">💝 No Sharing</p>
              <p className="text-xs text-blue-700">
                Your memories, journal entries, and progress are completely private.
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <p className="text-sm text-purple-800 mb-1 font-semibold">🎯 No Tracking</p>
              <p className="text-xs text-purple-700">
                We don't track your activity or collect any analytics.
              </p>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-red-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Danger Zone</h3>
          </div>
          
          <div className="p-4 bg-red-50 rounded-xl border border-red-200">
            <p className="text-sm text-red-800 mb-3">
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

