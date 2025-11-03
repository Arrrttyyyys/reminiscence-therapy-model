// Types for Federated Learning + On-Device Training System

export interface TrainingData {
  textEntries?: TextEntryData[];
  audioFeatures?: AudioFeatureData[];
  interactionPatterns?: InteractionPatternData[];
  quizSignals?: QuizSignalData[];
  caregiverInsights?: CaregiverInsightData[];
  context?: ContextData;
  timestamp: string;
  userId: string;
}

export interface TextEntryData {
  text: string;
  source: 'mood_note' | 'speech_transcript' | 'quiz_answer';
  timestamp: string;
  moodLabel?: 'calm' | 'joy' | 'sad' | 'anxious' | 'neutral';
  valence?: number; // -1 to 1
  arousal?: number; // -1 to 1
}

export interface AudioFeatureData {
  pitch?: number;
  energy?: number;
  jitter?: number;
  speechRate?: number; // words per minute
  pauseCount?: number;
  timestamp: string;
  // Note: Raw audio never leaves device
}

export interface InteractionPatternData {
  promptId: string;
  promptType: string;
  engaged: boolean;
  dwellTime: number; // milliseconds
  completion: boolean;
  timeOfDay: string; // ISO time
  dayOfWeek: string;
}

export interface QuizSignalData {
  quizType: 'nameRecall' | 'objectRecognition' | 'memoryRecall' | 'sequenceRecall' | 'spatialRecall';
  difficulty: 'easy' | 'medium' | 'hard';
  correct: boolean;
  responseLatency: number; // milliseconds
  responseLength?: number; // for open-ended
  hintsUsed: number;
  timestamp: string;
}

export interface CaregiverInsightData {
  tag: string;
  category: 'memory' | 'calm' | 'engagement' | 'safety' | 'routine';
  positive: boolean; // worked well vs overstimulating
  context: string;
  timestamp: string;
}

export interface ContextData {
  dayOfWeek: string;
  sessionTime: string;
  recentSleep?: number; // hours, if consented
  adherence?: number; // days of streak
  timeSinceLastActivity?: number; // minutes
}

export interface ModelWeights {
  emotionModel?: Float32Array;
  quizPersonalizationModel?: Float32Array;
  activityRecommendationModel?: Float32Array;
  moodForecastModel?: Float32Array;
  speechTrendModel?: Float32Array;
  memoryEmbeddingModel?: Float32Array;
  version: string;
  timestamp: string;
}

export interface FederatedUpdate {
  weightDelta: Float32Array;
  clientId: string;
  sampleCount: number;
  round: number;
  timestamp: string;
  // No raw data, only model updates
}

export interface ModelPredictions {
  emotion?: EmotionPrediction;
  nextActivity?: ActivityRecommendation;
  moodForecast?: MoodForecast;
  quizDifficulty?: QuizDifficulty;
  memoryRanking?: MemoryRanking[];
}

export interface EmotionPrediction {
  valence: number;
  arousal: number;
  classes: {
    calm: number;
    joy: number;
    sad: number;
    anxious: number;
    neutral: number;
  };
}

export interface ActivityRecommendation {
  activity: 'photo_review' | 'music_clip' | 'memory_game' | 'caregiver_call' | 'mood_entry' | 'relaxation';
  confidence: number;
  reason: string; // explainable AI
  priority: number;
}

export interface MoodForecast {
  next7Days: {
    date: string;
    predictedMood: 'low' | 'moderate' | 'high';
    confidence: number;
    suggestedIntervention?: string;
  }[];
}

export interface QuizDifficulty {
  recommendedType: string;
  recommendedDifficulty: 'easy' | 'medium' | 'hard';
  reason: string;
}

export interface MemoryRanking {
  memoryId: string;
  relevanceScore: number;
  comfortScore: number;
  reason: string;
}

export interface TrainingConfig {
  learningRate: number;
  batchSize: number;
  epochs: number;
  useLocalData: boolean;
  federatedRound?: number;
  differentialPrivacy?: {
    enabled: boolean;
    noiseScale: number;
    clipNorm: number;
  };
}

export interface ConsentSettings {
  localTraining: boolean;
  shareAggregates: boolean;
  caregiverView: boolean;
  collectAudioFeatures: boolean;
  collectContext: boolean;
}

export interface SafetyFlags {
  crisisLanguage?: boolean;
  significantMoodDrop?: boolean;
  unusualPattern?: boolean;
  requiresAttention?: boolean;
}

