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

export interface Album {
  id: string;
  title: string;
  description: string;
  memories: Memory[];
  date: string;
  createdAt: string;
  tags: string[];
  coverImage?: string; // Use first photo as cover
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

export interface EmotionData {
  emotion: 'happy' | 'sad' | 'angry' | 'surprised' | 'fearful' | 'disgusted' | 'neutral';
  confidence: number;
  timestamp: number; // Time in video (seconds)
}

export interface VideoEntry {
  videoUrl: string; // Blob URL or data URL
  duration: number; // Duration in seconds
  emotions: EmotionData[]; // Emotions detected throughout the video
  averageEmotion: string; // Most common emotion
}

export interface JournalEntry {
  id: string;
  content: string;
  date: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];
  videoEntry?: VideoEntry; // Optional video recording with emotion data
  entryType?: 'text' | 'voice' | 'video'; // Type of entry (optional for backward compatibility)
}

export interface ProgressData {
  date: string;
  quizScore: number;
  engagementTime: number;
  sentimentScore: number;
  recognitions: number;
}

export interface QuizResult {
  quizId: string;
  score: number;
  date: string;
}

export interface ActivitySuggestion {
  id: string;
  type: 'memory' | 'quiz' | 'relaxation';
  message: string;
  targetContent?: string;
}

