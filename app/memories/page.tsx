'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import MemoryCard from '@/components/MemoryCard';

const Layout = dynamic(() => import('@/components/Layout'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  ),
});
import { Plus, Search, Images, Image, Tag, ChevronLeft, ChevronRight, X, Play, Maximize, Grid, List, Filter, Calendar } from 'lucide-react';
import { Memory, Album } from '@/types';
import { storage } from '@/lib/storage';
import { format } from 'date-fns';
import AlbumCard from '@/components/AlbumCard';

type ViewMode = 'single' | 'album';

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'all' | 'memories' | 'albums'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    memoryType: '' as '' | 'photo' | 'video' | 'audio',
    tag: '',
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddAlbumModal, setShowAddAlbumModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditAlbumModal, setShowEditAlbumModal] = useState(false);
  const [showAlbumViewer, setShowAlbumViewer] = useState(false);
  const [viewingAlbum, setViewingAlbum] = useState<Album | null>(null);
  const [albumViewMode, setAlbumViewMode] = useState<'grid' | 'slideshow' | 'fullscreen'>('grid');
  const [currentAlbumIndex, setCurrentAlbumIndex] = useState(0);
  const [fullscreenMemoryIndex, setFullscreenMemoryIndex] = useState(0);
  const [timelineView, setTimelineView] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [addMode, setAddMode] = useState<ViewMode>('single');
  const [saving, setSaving] = useState(false);
  const [newMemory, setNewMemory] = useState({
    title: '',
    description: '',
    type: 'photo' as 'photo' | 'video' | 'audio',
    date: new Date().toISOString().split('T')[0],
    tags: '',
    file: null as File | null,
  });
  const [newAlbum, setNewAlbum] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    tags: '',
    files: [] as File[],
  });

  useEffect(() => {
    loadMemories();
    loadAlbums();
  }, []);

  const loadMemories = () => {
    const savedMemories = storage.getMemories();
    setMemories(savedMemories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const loadAlbums = () => {
    const savedAlbums = storage.getAlbums();
    setAlbums(savedAlbums.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const handleDeleteMemory = (id: string) => {
    storage.deleteMemory(id);
    loadMemories();
  };

  const handleEditMemory = (memory: Memory) => {
    setEditingMemory(memory);
    setNewMemory({
      title: memory.title,
      description: memory.description,
      type: memory.type,
      date: memory.date,
      tags: memory.tags.join(', '),
      file: null, // Don't preload file
    });
    setShowEditModal(true);
  };

  const handleUpdateMemory = async () => {
    if (!editingMemory) return;

    // Validation
    if (!newMemory.title || !newMemory.title.trim()) {
      alert('Please enter a title for your memory');
      return;
    }

    setSaving(true);

    try {
      // If a new file was selected, read it
      let content = editingMemory.content; // Keep existing content by default
      
      if (newMemory.file) {
        // File size validation (10MB limit)
        if (newMemory.file.size > 10 * 1024 * 1024) {
          alert('File size is too large. Please select a file smaller than 10MB.');
          setSaving(false);
          return;
        }

        const reader = new FileReader();
        reader.onerror = () => {
          alert('Failed to read file. Please try again.');
          setSaving(false);
        };
        
        await new Promise<void>((resolve, reject) => {
          reader.onloadend = () => {
            content = reader.result as string;
            resolve();
          };
          reader.onerror = reject;
          reader.readAsDataURL(newMemory.file!);
        });
      }

      // Update the memory
      const updatedMemory: Partial<Memory> = {
        title: newMemory.title,
        description: newMemory.description,
        type: newMemory.type,
        date: newMemory.date,
        tags: newMemory.tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      // Only update content if a new file was selected
      if (newMemory.file) {
        updatedMemory.content = content;
      }

      storage.updateMemory(editingMemory.id, updatedMemory);
      loadMemories();
      setShowEditModal(false);
      setEditingMemory(null);
      setNewMemory({
        title: '',
        description: '',
        type: 'photo',
        date: new Date().toISOString().split('T')[0],
        tags: '',
        file: null,
      });
      setSaving(false);
    } catch (error) {
      console.error('Failed to update memory:', error);
      alert('Failed to update memory. Please try again.');
      setSaving(false);
    }
  };

  const handleAddMemory = async () => {
    // Validation
    if (!newMemory.title || !newMemory.title.trim()) {
      alert('Please enter a title for your memory');
      return;
    }

    if (!newMemory.file) {
      alert('Please select a file (photo, video, or audio)');
      return;
    }

    // File size validation (10MB limit)
    if (newMemory.file.size > 10 * 1024 * 1024) {
      alert('File size is too large. Please select a file smaller than 10MB.');
      return;
    }

    const reader = new FileReader();
    
    reader.onerror = () => {
      alert('Failed to read file. Please try again.');
      setSaving(false);
    };
    
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

      try {
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
        setSaving(false);
      } catch (error) {
        console.error('Failed to save memory:', error);
        alert('Failed to save memory. Please try again.');
        setSaving(false);
      }
    };

    reader.readAsDataURL(newMemory.file);
  };

  const filteredMemories = memories.filter(memory => {
    // Search term filter
    const matchesSearch = !searchTerm || 
      memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    // Date range filter
    const memoryDate = new Date(memory.date);
    const matchesDateFrom = !filters.dateFrom || memoryDate >= new Date(filters.dateFrom);
    const matchesDateTo = !filters.dateTo || memoryDate <= new Date(filters.dateTo);

    // Type filter
    const matchesType = !filters.memoryType || memory.type === filters.memoryType;

    // Tag filter
    const matchesTag = !filters.tag || memory.tags.some(tag => 
      tag.toLowerCase().includes(filters.tag.toLowerCase())
    );

    return matchesSearch && matchesDateFrom && matchesDateTo && matchesType && matchesTag;
  });

  const filteredAlbums = albums.filter(album => {
    // Search term filter
    const matchesSearch = !searchTerm ||
      album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    // Date range filter
    const albumDate = new Date(album.date);
    const matchesDateFrom = !filters.dateFrom || albumDate >= new Date(filters.dateFrom);
    const matchesDateTo = !filters.dateTo || albumDate <= new Date(filters.dateTo);

    // Tag filter
    const matchesTag = !filters.tag || album.tags.some(tag => 
      tag.toLowerCase().includes(filters.tag.toLowerCase())
    );

    return matchesSearch && matchesDateFrom && matchesDateTo && matchesTag;
  });

  const handleDeleteAlbum = (id: string) => {
    storage.deleteAlbum(id);
    loadAlbums();
  };

  const handleEditAlbum = (album: Album) => {
    setEditingAlbum(album);
    setNewAlbum({
      title: album.title,
      description: album.description,
      date: album.date,
      tags: album.tags.join(', '),
      files: [],
    });
    setShowEditAlbumModal(true);
  };

  const handleAddAlbum = async () => {
    // Validation
    if (!newAlbum.title || !newAlbum.title.trim()) {
      alert('Please enter a title for your album');
      return;
    }

    if (newAlbum.files.length === 0) {
      alert('Please select at least one file for your album');
      return;
    }

    // File size validation (10MB limit per file)
    for (const file of newAlbum.files) {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File "${file.name}" is too large. Please select files smaller than 10MB.`);
        return;
      }
    }

    setSaving(true);

    try {
      const albumMemories: Memory[] = [];
      
      // Process all files
      for (let i = 0; i < newAlbum.files.length; i++) {
        const file = newAlbum.files[i];
        const fileType = file.type.startsWith('image/') ? 'photo' : 
                        file.type.startsWith('video/') ? 'video' : 'audio';

        await new Promise<void>((resolve, reject) => {
          const reader = new FileReader();
          reader.onerror = reject;
          reader.onloadend = () => {
            const memory: Memory = {
              id: `${Date.now()}-${i}`,
              title: `${newAlbum.title} - ${i + 1}`,
              description: '',
              type: fileType,
              date: newAlbum.date,
              createdAt: new Date().toISOString(),
              content: reader.result as string,
              tags: newAlbum.tags.split(',').map(t => t.trim()).filter(Boolean),
            };
            albumMemories.push(memory);
            storage.saveMemory(memory);
            resolve();
          };
          reader.readAsDataURL(file);
        });
      }

      // Create album
      const firstPhoto = albumMemories.find(m => m.type === 'photo');
      const album: Album = {
        id: Date.now().toString(),
        title: newAlbum.title,
        description: newAlbum.description,
        memories: albumMemories,
        date: newAlbum.date,
        createdAt: new Date().toISOString(),
        tags: newAlbum.tags.split(',').map(t => t.trim()).filter(Boolean),
        coverImage: firstPhoto?.content,
      };

      storage.saveAlbum(album);
      loadAlbums();
      setShowAddAlbumModal(false);
      setNewAlbum({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        tags: '',
        files: [],
      });
      setSaving(false);
    } catch (error) {
      console.error('Failed to create album:', error);
      alert('Failed to create album. Please try again.');
      setSaving(false);
    }
  };

  const handleUpdateAlbum = async () => {
    if (!editingAlbum) return;

    if (!newAlbum.title || !newAlbum.title.trim()) {
      alert('Please enter a title for your album');
      return;
    }

    setSaving(true);

    try {
      let albumMemories = [...editingAlbum.memories];
      
      // If new files were added, process them
      if (newAlbum.files.length > 0) {
        for (let i = 0; i < newAlbum.files.length; i++) {
          const file = newAlbum.files[i];
          if (file.size > 10 * 1024 * 1024) {
            alert(`File "${file.name}" is too large. Please select files smaller than 10MB.`);
            setSaving(false);
            return;
          }

          const fileType = file.type.startsWith('image/') ? 'photo' : 
                          file.type.startsWith('video/') ? 'video' : 'audio';

          await new Promise<void>((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onloadend = () => {
              const memory: Memory = {
                id: `${Date.now()}-${i}`,
                title: `${newAlbum.title} - ${albumMemories.length + 1}`,
                description: '',
                type: fileType,
                date: newAlbum.date,
                createdAt: new Date().toISOString(),
                content: reader.result as string,
                tags: newAlbum.tags.split(',').map(t => t.trim()).filter(Boolean),
              };
              albumMemories.push(memory);
              storage.saveMemory(memory);
              resolve();
            };
            reader.readAsDataURL(file);
          });
        }
      }

      const firstPhoto = albumMemories.find(m => m.type === 'photo');
      const updatedAlbum: Partial<Album> = {
        title: newAlbum.title,
        description: newAlbum.description,
        date: newAlbum.date,
        tags: newAlbum.tags.split(',').map(t => t.trim()).filter(Boolean),
        memories: albumMemories,
        coverImage: firstPhoto?.content,
      };

      storage.updateAlbum(editingAlbum.id, updatedAlbum);
      loadAlbums();
      setShowEditAlbumModal(false);
      setEditingAlbum(null);
      setNewAlbum({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        tags: '',
        files: [],
      });
      setSaving(false);
    } catch (error) {
      console.error('Failed to update album:', error);
      alert('Failed to update album. Please try again.');
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 pb-32 fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 slide-up">
          <div>
            <h2 className="text-3xl font-bold text-white">Your Memories</h2>
            <p className="text-gray-400 text-sm mt-1">
              {memories.length} memories • {albums.length} albums
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setAddMode('single');
                setShowAddModal(true);
              }}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 hover:scale-105"
            >
              <Image className="w-5 h-5" />
              Add Memory
            </button>
            <button
              onClick={() => setShowAddAlbumModal(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 hover:scale-105"
            >
              <Images className="w-5 h-5" />
              Create Album
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 mb-4 slide-up">
          <button
            onClick={() => setViewMode('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              viewMode === 'all'
                ? 'bg-teal-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setViewMode('memories')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              viewMode === 'memories'
                ? 'bg-teal-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Memories
          </button>
          <button
            onClick={() => setViewMode('albums')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              viewMode === 'albums'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Albums
          </button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 slide-up">
          <div className="relative flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search memories and albums..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-4 rounded-2xl font-semibold transition-all flex items-center gap-2 ${
                showFilters || filters.dateFrom || filters.dateTo || filters.memoryType || filters.tag
                  ? 'bg-teal-500/20 border border-teal-500/50 text-teal-400'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 slide-down">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    From Date
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    To Date
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                  <select
                    value={filters.memoryType}
                    onChange={(e) => setFilters({ ...filters, memoryType: e.target.value as any })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">All Types</option>
                    <option value="photo">Photos</option>
                    <option value="video">Videos</option>
                    <option value="audio">Audio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Tag
                  </label>
                  <input
                    type="text"
                    value={filters.tag}
                    onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
                    placeholder="Filter by tag..."
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  setFilters({ dateFrom: '', dateTo: '', memoryType: '', tag: '' });
                }}
                className="mt-4 px-4 py-2 bg-gray-800 text-gray-400 rounded-xl font-semibold hover:bg-gray-700 transition-colors border border-gray-700 text-sm"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Memories Grid */}
        {viewMode !== 'albums' && (
          <>
            {(viewMode === 'all' || viewMode === 'memories') && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-4 slide-up">Single Memories</h3>
        {filteredMemories.length === 0 ? (
                  <div className="bg-gray-900/50 border border-gray-700 rounded-3xl p-12 text-center slide-up">
                    <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Image className="w-12 h-12 text-white" />
            </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No memories yet</h3>
                    <p className="text-gray-400 mb-4">Start adding your precious moments</p>
            <button
                      onClick={() => {
                        setAddMode('single');
                        setShowAddModal(true);
                      }}
                      className="text-teal-400 font-semibold hover:text-teal-300 transition-colors"
            >
              Add Your First Memory →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemories.map((memory) => (
                      <MemoryCard 
                        key={memory.id} 
                        memory={memory} 
                        onDelete={handleDeleteMemory}
                        onEdit={handleEditMemory}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Albums Grid */}
        {viewMode !== 'memories' && (
          <>
            {(viewMode === 'all' || viewMode === 'albums') && (
              <div className={viewMode === 'all' ? 'mt-8' : ''}>
                <h3 className="text-xl font-semibold text-white mb-4 slide-up">Albums</h3>
                {filteredAlbums.length === 0 ? (
                  <div className="bg-gray-900/50 border border-gray-700 rounded-3xl p-12 text-center slide-up">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Images className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No albums yet</h3>
                    <p className="text-gray-400 mb-4">Create an album to organize multiple memories together</p>
                    <button
                      onClick={() => setShowAddAlbumModal(true)}
                      className="text-purple-400 font-semibold hover:text-purple-300 transition-colors"
                    >
                      Create Your First Album →
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAlbums.map((album) => (
                      <AlbumCard 
                        key={album.id} 
                        album={album} 
                        onClick={(album) => {
                          setViewingAlbum(album);
                          setShowAlbumViewer(true);
                        }}
                        onDelete={handleDeleteAlbum}
                        onEdit={handleEditAlbum}
                      />
            ))}
          </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Add Memory Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => {
            setShowAddModal(false);
            setNewMemory({
              title: '',
              description: '',
              type: 'photo',
              date: new Date().toISOString().split('T')[0],
              tags: '',
              file: null,
            });
          }}>
            <div className="bg-gray-900 border border-teal-500/30 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-2xl font-bold text-white mb-4">Add New Memory</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Memory Type</label>
                  <select
                    value={newMemory.type}
                    onChange={(e) => setNewMemory({ ...newMemory, type: e.target.value as any })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="photo">Photo</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={newMemory.title}
                    onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="e.g., Family Dinner 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={newMemory.description}
                    onChange={(e) => setNewMemory({ ...newMemory, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                    rows={3}
                    placeholder="Tell us about this memory..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={newMemory.date}
                    onChange={(e) => setNewMemory({ ...newMemory, date: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newMemory.tags}
                    onChange={(e) => setNewMemory({ ...newMemory, tags: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="family, vacation, birthday"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">File</label>
                  <input
                    type="file"
                    accept={newMemory.type === 'photo' ? 'image/*' : newMemory.type === 'video' ? 'video/*' : 'audio/*'}
                    onChange={(e) => setNewMemory({ ...newMemory, file: e.target.files?.[0] || null })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-500 file:text-white hover:file:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {showAddModal && (
                    <p className="text-xs text-gray-400 mt-1">Required for new memories</p>
                  )}
                  {showEditModal && (
                    <p className="text-xs text-gray-400 mt-1">Leave empty to keep existing file, or select a new one to replace it</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    if (showAddModal) setShowAddModal(false);
                    if (showEditModal) {
                      setShowEditModal(false);
                      setEditingMemory(null);
                    }
                    setNewMemory({
                      title: '',
                      description: '',
                      type: 'photo',
                      date: new Date().toISOString().split('T')[0],
                      tags: '',
                      file: null,
                    });
                  }}
                  className="flex-1 px-6 py-3 bg-gray-800 text-gray-300 rounded-xl font-semibold hover:bg-gray-700 transition-colors border border-gray-700"
                >
                  Cancel
                </button>
                {showAddModal && (
                  <button
                    onClick={handleAddMemory}
                    disabled={saving || !newMemory.title || !newMemory.file}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Memory'
                    )}
                  </button>
                )}
                {showEditModal && (
                  <button
                    onClick={handleUpdateMemory}
                    disabled={saving || !newMemory.title}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Memory'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Memory Modal */}
        {showEditModal && editingMemory && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => {
            setShowEditModal(false);
            setEditingMemory(null);
            setNewMemory({
              title: '',
              description: '',
              type: 'photo',
              date: new Date().toISOString().split('T')[0],
              tags: '',
              file: null,
            });
          }}>
            <div className="bg-gray-900 border border-teal-500/30 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-2xl font-bold text-white mb-4">Edit Memory</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Memory Type</label>
                  <select
                    value={newMemory.type}
                    onChange={(e) => setNewMemory({ ...newMemory, type: e.target.value as any })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="photo">Photo</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={newMemory.title}
                    onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="e.g., Family Dinner 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={newMemory.description}
                    onChange={(e) => setNewMemory({ ...newMemory, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                    rows={3}
                    placeholder="Tell us about this memory..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={newMemory.date}
                    onChange={(e) => setNewMemory({ ...newMemory, date: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newMemory.tags}
                    onChange={(e) => setNewMemory({ ...newMemory, tags: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="family, vacation, birthday"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">File (optional - leave empty to keep existing)</label>
                  <input
                    type="file"
                    accept={newMemory.type === 'photo' ? 'image/*' : newMemory.type === 'video' ? 'video/*' : 'audio/*'}
                    onChange={(e) => setNewMemory({ ...newMemory, file: e.target.files?.[0] || null })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-500 file:text-white hover:file:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Leave empty to keep existing file, or select a new one to replace it</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingMemory(null);
                    setNewMemory({
                      title: '',
                      description: '',
                      type: 'photo',
                      date: new Date().toISOString().split('T')[0],
                      tags: '',
                      file: null,
                    });
                  }}
                  className="flex-1 px-6 py-3 bg-gray-800 text-gray-300 rounded-xl font-semibold hover:bg-gray-700 transition-colors border border-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateMemory}
                  disabled={saving || !newMemory.title}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Memory'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Album Modal */}
        {showAddAlbumModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => {
            setShowAddAlbumModal(false);
            setNewAlbum({
              title: '',
              description: '',
              date: new Date().toISOString().split('T')[0],
              tags: '',
              files: [],
            });
          }}>
            <div className="bg-gray-900 border border-purple-500/30 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-2xl font-bold text-white mb-4">Create New Album</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Album Title</label>
                  <input
                    type="text"
                    value={newAlbum.title}
                    onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., Summer Vacation 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={newAlbum.description}
                    onChange={(e) => setNewAlbum({ ...newAlbum, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                    rows={3}
                    placeholder="Tell us about this album..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={newAlbum.date}
                    onChange={(e) => setNewAlbum({ ...newAlbum, date: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newAlbum.tags}
                    onChange={(e) => setNewAlbum({ ...newAlbum, tags: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="family, vacation, birthday"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Files (Select multiple)</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*,audio/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setNewAlbum({ ...newAlbum, files });
                    }}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {newAlbum.files.length > 0 && (
                    <p className="text-xs text-purple-400 mt-2">
                      {newAlbum.files.length} file(s) selected
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">You can select multiple photos, videos, or audio files at once</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddAlbumModal(false);
                    setNewAlbum({
                      title: '',
                      description: '',
                      date: new Date().toISOString().split('T')[0],
                      tags: '',
                      files: [],
                    });
                  }}
                  className="flex-1 px-6 py-3 bg-gray-800 text-gray-300 rounded-xl font-semibold hover:bg-gray-700 transition-colors border border-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAlbum}
                  disabled={saving || !newAlbum.title || newAlbum.files.length === 0}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Album'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Album Modal */}
        {showEditAlbumModal && editingAlbum && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => {
            setShowEditAlbumModal(false);
            setEditingAlbum(null);
            setNewAlbum({
              title: '',
              description: '',
              date: new Date().toISOString().split('T')[0],
              tags: '',
              files: [],
            });
          }}>
            <div className="bg-gray-900 border border-purple-500/30 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-2xl font-bold text-white mb-4">Edit Album</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Album Title</label>
                  <input
                    type="text"
                    value={newAlbum.title}
                    onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., Summer Vacation 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={newAlbum.description}
                    onChange={(e) => setNewAlbum({ ...newAlbum, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                    rows={3}
                    placeholder="Tell us about this album..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={newAlbum.date}
                    onChange={(e) => setNewAlbum({ ...newAlbum, date: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newAlbum.tags}
                    onChange={(e) => setNewAlbum({ ...newAlbum, tags: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="family, vacation, birthday"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Add More Files (optional)</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*,audio/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setNewAlbum({ ...newAlbum, files });
                    }}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {newAlbum.files.length > 0 && (
                    <p className="text-xs text-purple-400 mt-2">
                      {newAlbum.files.length} new file(s) selected
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Current album has {editingAlbum.memories.length} item(s). Leave empty to keep existing, or select files to add.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditAlbumModal(false);
                    setEditingAlbum(null);
                    setNewAlbum({
                      title: '',
                      description: '',
                      date: new Date().toISOString().split('T')[0],
                      tags: '',
                      files: [],
                    });
                  }}
                  className="flex-1 px-6 py-3 bg-gray-800 text-gray-300 rounded-xl font-semibold hover:bg-gray-700 transition-colors border border-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateAlbum}
                  disabled={saving || !newAlbum.title}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Album'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Album Viewer Modal */}
        {showAlbumViewer && viewingAlbum && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50" onClick={() => {
            if (albumViewMode === 'fullscreen') {
              setAlbumViewMode('grid');
            } else {
              setShowAlbumViewer(false);
              setViewingAlbum(null);
              setAlbumViewMode('grid');
              setCurrentAlbumIndex(0);
              setFullscreenMemoryIndex(0);
            }
          }}>
            {/* Grid View */}
            {albumViewMode === 'grid' && (
              <div className="bg-gray-900 border border-purple-500/30 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{viewingAlbum.title}</h3>
                    <p className="text-gray-400">{viewingAlbum.description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {viewingAlbum.memories.length} items • {format(new Date(viewingAlbum.date), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setAlbumViewMode('slideshow');
                        setCurrentAlbumIndex(0);
                      }}
                      className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-xl font-semibold hover:bg-purple-500/30 transition-colors flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Slideshow
                    </button>
                    <button
                      onClick={() => {
                        setShowAlbumViewer(false);
                        setViewingAlbum(null);
                        setAlbumViewMode('grid');
                      }}
                      className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl font-semibold hover:bg-gray-700 transition-colors border border-gray-700"
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {viewingAlbum.memories.map((memory, idx) => (
                    <div
                      key={memory.id}
                      onClick={() => {
                        setFullscreenMemoryIndex(idx);
                        setAlbumViewMode('fullscreen');
                      }}
                      className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all cursor-pointer hover:scale-105"
                    >
                      {memory.type === 'photo' && memory.content && (
                        <img
                          src={memory.content}
                          alt={memory.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      {(memory.type === 'video' || memory.type === 'audio') && (
                        <div className="w-full h-48 bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
                          {memory.type === 'video' ? (
                            <div className="w-16 h-16 bg-purple-500/80 rounded-full flex items-center justify-center">
                              <Play className="w-8 h-8 ml-1 text-white" />
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-purple-500/80 rounded-full flex items-center justify-center">
                              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 14v-4c0-2.21-1.79-4-4-4s-4 1.79-4 4v4c0 2.21 1.79 4 4 4s4-1.79 4-4zm-2-4c0-1.1.9-2 2-2s2 .9 2 2v4c0 1.1-.9 2-2 2s-2-.9-2-2v-4z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="p-3">
                        <p className="text-sm font-medium text-white truncate">{memory.title}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {viewingAlbum.tags && viewingAlbum.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {viewingAlbum.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs border border-purple-500/30"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Slideshow View */}
            {albumViewMode === 'slideshow' && viewingAlbum.memories.length > 0 && (
              <div className="w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Previous Button */}
                  {currentAlbumIndex > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentAlbumIndex(currentAlbumIndex - 1);
                      }}
                      className="absolute left-4 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                    >
                      <ChevronLeft className="w-8 h-8" />
                    </button>
                  )}

                  {/* Memory Display */}
                  <div className="flex flex-col items-center justify-center max-w-4xl mx-auto px-20">
                    <div className="relative w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden mb-4">
                      {viewingAlbum.memories[currentAlbumIndex].type === 'photo' && viewingAlbum.memories[currentAlbumIndex].content && (
                        <img
                          src={viewingAlbum.memories[currentAlbumIndex].content}
                          alt={viewingAlbum.memories[currentAlbumIndex].title}
                          className="w-full h-full object-contain"
                        />
                      )}
                      {(viewingAlbum.memories[currentAlbumIndex].type === 'video' || viewingAlbum.memories[currentAlbumIndex].type === 'audio') && (
                        <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
                          {viewingAlbum.memories[currentAlbumIndex].type === 'video' ? (
                            <Play className="w-20 h-20 text-purple-400" />
                          ) : (
                            <svg className="w-20 h-20 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 14v-4c0-2.21-1.79-4-4-4s-4 1.79-4 4v4c0 2.21 1.79 4 4 4s4-1.79 4-4zm-2-4c0-1.1.9-2 2-2s2 .9 2 2v4c0 1.1-.9 2-2 2s-2-.9-2-2v-4z" />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <h4 className="text-2xl font-bold text-white mb-2">{viewingAlbum.memories[currentAlbumIndex].title}</h4>
                      <p className="text-gray-300 mb-4">{viewingAlbum.memories[currentAlbumIndex].description}</p>
                      <p className="text-sm text-gray-400">
                        {currentAlbumIndex + 1} of {viewingAlbum.memories.length}
                      </p>
                    </div>
                  </div>

                  {/* Next Button */}
                  {currentAlbumIndex < viewingAlbum.memories.length - 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentAlbumIndex(currentAlbumIndex + 1);
                      }}
                      className="absolute right-4 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                    >
                      <ChevronRight className="w-8 h-8" />
                    </button>
                  )}

                  {/* View Controls */}
                  <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFullscreenMemoryIndex(currentAlbumIndex);
                        setAlbumViewMode('fullscreen');
                      }}
                      className="p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors"
                      title="Full Screen"
                    >
                      <Maximize className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAlbumViewMode('grid');
                      }}
                      className="p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors"
                      title="Grid View"
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAlbumViewer(false);
                        setViewingAlbum(null);
                        setAlbumViewMode('grid');
                      }}
                      className="p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors"
                      title="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Fullscreen View */}
            {albumViewMode === 'fullscreen' && viewingAlbum.memories.length > 0 && (
              <div className="w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Previous Button */}
                  {fullscreenMemoryIndex > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFullscreenMemoryIndex(fullscreenMemoryIndex - 1);
                      }}
                      className="absolute left-4 z-10 p-4 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                    >
                      <ChevronLeft className="w-10 h-10" />
                    </button>
                  )}

                  {/* Fullscreen Memory Display */}
                  <div className="w-full h-full flex items-center justify-center">
                    {viewingAlbum.memories[fullscreenMemoryIndex].type === 'photo' && viewingAlbum.memories[fullscreenMemoryIndex].content && (
                      <img
                        src={viewingAlbum.memories[fullscreenMemoryIndex].content}
                        alt={viewingAlbum.memories[fullscreenMemoryIndex].title}
                        className="max-w-full max-h-full object-contain"
                      />
                    )}
                    {(viewingAlbum.memories[fullscreenMemoryIndex].type === 'video' || viewingAlbum.memories[fullscreenMemoryIndex].type === 'audio') && (
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-full flex items-center justify-center mb-6">
                          {viewingAlbum.memories[fullscreenMemoryIndex].type === 'video' ? (
                            <Play className="w-16 h-16 text-purple-400" />
                          ) : (
                            <svg className="w-16 h-16 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 14v-4c0-2.21-1.79-4-4-4s-4 1.79-4 4v4c0 2.21 1.79 4 4 4s4-1.79 4-4zm-2-4c0-1.1.9-2 2-2s2 .9 2 2v4c0 1.1-.9 2-2 2s-2-.9-2-2v-4z" />
                            </svg>
                          )}
                        </div>
                        <h4 className="text-3xl font-bold text-white mb-2">{viewingAlbum.memories[fullscreenMemoryIndex].title}</h4>
                        <p className="text-gray-300 text-lg">{viewingAlbum.memories[fullscreenMemoryIndex].description}</p>
                      </div>
                    )}
                  </div>

                  {/* Next Button */}
                  {fullscreenMemoryIndex < viewingAlbum.memories.length - 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFullscreenMemoryIndex(fullscreenMemoryIndex + 1);
                      }}
                      className="absolute right-4 z-10 p-4 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                    >
                      <ChevronRight className="w-10 h-10" />
                    </button>
                  )}

                  {/* Info Overlay */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-xl px-6 py-3 text-center">
                    <p className="text-white font-semibold">{viewingAlbum.memories[fullscreenMemoryIndex].title}</p>
                    <p className="text-sm text-gray-300">{fullscreenMemoryIndex + 1} of {viewingAlbum.memories.length}</p>
                  </div>

                  {/* View Controls */}
                  <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAlbumViewMode('slideshow');
                        setCurrentAlbumIndex(fullscreenMemoryIndex);
                      }}
                      className="p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors"
                      title="Slideshow"
                    >
                      <Play className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAlbumViewMode('grid');
                      }}
                      className="p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors"
                      title="Grid View"
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAlbumViewer(false);
                        setViewingAlbum(null);
                        setAlbumViewMode('grid');
                      }}
                      className="p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors"
                      title="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

