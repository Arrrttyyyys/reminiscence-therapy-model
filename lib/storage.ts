import { Memory, JournalEntry, ProgressData, MemoryQuiz, Album } from '@/types';

const STORAGE_KEYS = {
  memories: 'reminoracare-memories',
  albums: 'reminoracare-albums',
  journal: 'reminoracare-journal',
  progress: 'reminoracare-progress',
  quizResults: 'reminoracare-quiz-results',
  settings: 'reminoracare-settings',
};

export const storage = {
  // Memories
  saveMemory(memory: Memory): void {
    const memories = this.getMemories();
    memories.push(memory);
    localStorage.setItem(STORAGE_KEYS.memories, JSON.stringify(memories));
  },

  getMemories(): Memory[] {
    const data = localStorage.getItem(STORAGE_KEYS.memories);
    return data ? JSON.parse(data) : [];
  },

  updateMemory(id: string, updatedMemory: Partial<Memory>): void {
    const memories = this.getMemories();
    const index = memories.findIndex(m => m.id === id);
    if (index !== -1) {
      memories[index] = { ...memories[index], ...updatedMemory };
      localStorage.setItem(STORAGE_KEYS.memories, JSON.stringify(memories));
    }
  },

  deleteMemory(id: string): void {
    const memories = this.getMemories();
    const filtered = memories.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.memories, JSON.stringify(filtered));
    
    // Also remove from albums if it exists there
    const albums = this.getAlbums();
    albums.forEach(album => {
      album.memories = album.memories.filter(m => m.id !== id);
    });
    localStorage.setItem(STORAGE_KEYS.albums, JSON.stringify(albums));
  },

  // Albums
  saveAlbum(album: Album): void {
    const albums = this.getAlbums();
    albums.push(album);
    localStorage.setItem(STORAGE_KEYS.albums, JSON.stringify(albums));
  },

  getAlbums(): Album[] {
    const data = localStorage.getItem(STORAGE_KEYS.albums);
    return data ? JSON.parse(data) : [];
  },

  updateAlbum(id: string, updatedAlbum: Partial<Album>): void {
    const albums = this.getAlbums();
    const index = albums.findIndex(a => a.id === id);
    if (index !== -1) {
      albums[index] = { ...albums[index], ...updatedAlbum };
      localStorage.setItem(STORAGE_KEYS.albums, JSON.stringify(albums));
    }
  },

  deleteAlbum(id: string): void {
    const albums = this.getAlbums();
    const filtered = albums.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.albums, JSON.stringify(filtered));
  },

  // Journal
  saveJournalEntry(entry: JournalEntry): void {
    const entries = this.getJournalEntries();
    entries.push(entry);
    localStorage.setItem(STORAGE_KEYS.journal, JSON.stringify(entries));
  },

  getJournalEntries(): JournalEntry[] {
    const data = localStorage.getItem(STORAGE_KEYS.journal);
    return data ? JSON.parse(data) : [];
  },

  deleteJournalEntry(id: string): void {
    const entries = this.getJournalEntries();
    const filtered = entries.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.journal, JSON.stringify(filtered));
  },

  // Progress
  saveProgressData(progress: ProgressData): void {
    const data = this.getProgressData();
    data.push(progress);
    localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(data));
  },

  getProgressData(): ProgressData[] {
    const data = localStorage.getItem(STORAGE_KEYS.progress);
    return data ? JSON.parse(data) : [];
  },

  // Quiz Results
  saveQuizResult(quizId: string, score: number): void {
    const results = this.getQuizResults();
    results.push({ quizId, score, date: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEYS.quizResults, JSON.stringify(results));
  },

  getQuizResults(): Array<{ quizId: string; score: number; date: string }> {
    const data = localStorage.getItem(STORAGE_KEYS.quizResults);
    return data ? JSON.parse(data) : [];
  },

  // Settings
  saveSettings(settings: Record<string, any>): void {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
  },

  getSettings(): Record<string, any> {
    const data = localStorage.getItem(STORAGE_KEYS.settings);
    return data ? JSON.parse(data) : { theme: 'light' };
  },
};

