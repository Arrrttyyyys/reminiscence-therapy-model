export interface Memory {
  id: string;
  type: 'photo' | 'video' | 'audio';
  title: string;
  description: string;
  content: string; // URL or base64
  date: string;
  createdAt: string;
  tags: string[];
}

export interface MemoryQuiz {
  id: string;
  type: 'nameRecall' | 'memoryRecall' | 'objectRecognition';
  question: string;
  options?: string[];
  correctAnswer?: string;
  memoryId?: string;
  relatedMemory?: Memory;
}

export interface JournalEntry {
  id: string;
  content: string;
  date: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];
}

export interface ProgressData {
  date: string;
  quizScore: number;
  engagementTime: number;
  sentimentScore: number;
  recognitions: number;
}

export interface ActivitySuggestion {
  id: string;
  type: 'memory' | 'quiz' | 'relaxation';
  message: string;
  targetContent?: string;
}

