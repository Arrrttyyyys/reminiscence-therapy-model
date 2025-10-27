'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import MemoryCard from '@/components/MemoryCard';
import { Plus, Search } from 'lucide-react';
import { Memory } from '@/types';
import { storage } from '@/lib/storage';
import { format } from 'date-fns';

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemory, setNewMemory] = useState({
    title: '',
    description: '',
    type: 'photo' as 'photo' | 'video' | 'audio',
    date: new Date().toISOString().split('T')[0],
    tags: '',
    file: null as File | null,
  });

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = () => {
    const savedMemories = storage.getMemories();
    setMemories(savedMemories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const handleAddMemory = async () => {
    if (!newMemory.title || !newMemory.file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const memory: Memory = {
        id: Date.now().toString(),
        title: newMemory.title,
        description: newMemory.description,
        type: newMemory.type,
        date: newMemory.date,
        createdAt: new Date().toISOString(),
        content: reader.result as string,
        tags: newMemory.tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      storage.saveMemory(memory);
      loadMemories();
      setShowAddModal(false);
      setNewMemory({
        title: '',
        description: '',
        type: 'photo',
        date: new Date().toISOString().split('T')[0],
        tags: '',
        file: null,
      });
    };

    reader.readAsDataURL(newMemory.file);
  };

  const filteredMemories = memories.filter(memory =>
    memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    memory.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    memory.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Your Memories</h2>
            <p className="text-gray-500 text-sm mt-1">{memories.length} cherished moments</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Memory
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search memories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* Memories Grid */}
        {filteredMemories.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-pink-100">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-12 h-12 text-pink-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No memories yet</h3>
            <p className="text-gray-500 mb-4">Start adding your precious moments</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-pink-600 font-semibold hover:text-pink-700"
            >
              Add Your First Memory →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemories.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} />
            ))}
          </div>
        )}

        {/* Add Memory Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Add New Memory</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Memory Type</label>
                  <select
                    value={newMemory.type}
                    onChange={(e) => setNewMemory({ ...newMemory, type: e.target.value as any })}
                    className="w-full px-4 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="photo">Photo</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newMemory.title}
                    onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                    className="w-full px-4 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., Family Dinner 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newMemory.description}
                    onChange={(e) => setNewMemory({ ...newMemory, description: e.target.value })}
                    className="w-full px-4 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    rows={3}
                    placeholder="Tell us about this memory..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={newMemory.date}
                    onChange={(e) => setNewMemory({ ...newMemory, date: e.target.value })}
                    className="w-full px-4 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newMemory.tags}
                    onChange={(e) => setNewMemory({ ...newMemory, tags: e.target.value })}
                    className="w-full px-4 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="family, vacation, birthday"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">File</label>
                  <input
                    type="file"
                    accept={newMemory.type === 'photo' ? 'image/*' : newMemory.type === 'video' ? 'video/*' : 'audio/*'}
                    onChange={(e) => setNewMemory({ ...newMemory, file: e.target.files?.[0] || null })}
                    className="w-full px-4 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMemory}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Save Memory
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

