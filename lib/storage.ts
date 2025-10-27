import { Memory, JournalEntry, ProgressData, MemoryQuiz } from '@/types';

const STORAGE_KEYS = {
  memories: 'memory-lane-memories',
  journal: 'memory-lane-journal',
  progress: 'memory-lane-progress',
  quizResults: 'memory-lane-quiz-results',
  settings: 'memory-lane-settings',
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

  deleteMemory(id: string): void {
    const memories = this.getMemories();
    const filtered = memories.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.memories, JSON.stringify(filtered));
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

