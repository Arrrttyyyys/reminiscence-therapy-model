'use client';

import { 
  TrainingData, 
  TextEntryData, 
  AudioFeatureData, 
  InteractionPatternData,
  QuizSignalData,
  CaregiverInsightData,
  ContextData,
  ConsentSettings
} from './types';
import { JournalEntry } from '@/types';

/**
 * Data Collection Service
 * Collects training signals from user interactions while respecting privacy
 */
export class DataCollector {
  private consent: ConsentSettings;
  private userId: string;

  constructor(userId: string, consent: ConsentSettings) {
    this.userId = userId;
    this.consent = consent;
  }

  /**
   * Collect text entry data from mood tracker
   */
  collectTextEntry(entry: JournalEntry, source: 'mood_note' | 'speech_transcript'): TextEntryData | null {
    if (!this.consent.localTraining) return null;

    // Extract basic sentiment (existing function from utils)
    const sentiment = entry.sentiment;
    const moodLabel = this.mapSentimentToMood(sentiment);

    // Estimate valence and arousal from keywords
    const { valence, arousal } = this.estimateAffect(entry.content, entry.keywords);

    return {
      text: entry.content,
      source,
      timestamp: entry.date,
      moodLabel,
      valence,
      arousal,
    };
  }

  /**
   * Collect audio features from speech (prosody only, no raw audio)
   */
  collectAudioFeatures(
    duration: number,
    wordCount: number,
    pauseCount: number
  ): AudioFeatureData | null {
    if (!this.consent.collectAudioFeatures || !this.consent.localTraining) {
      return null;
    }

    // Calculate prosody features (simplified - in production, use Web Audio API)
    const speechRate = (wordCount / duration) * 60; // words per minute
    const avgPauseDuration = duration / (pauseCount + 1);

    return {
      speechRate,
      pauseCount,
      timestamp: new Date().toISOString(),
      // Note: pitch, energy, jitter would require Web Audio API analysis
      // For now, we'll compute basic features
    };
  }

  /**
   * Collect interaction pattern data
   */
  collectInteractionPattern(
    promptId: string,
    promptType: string,
    engaged: boolean,
    dwellTime: number,
    completed: boolean
  ): InteractionPatternData {
    return {
      promptId,
      promptType,
      engaged,
      dwellTime,
      completion: completed,
      timeOfDay: new Date().toISOString(),
      dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
    };
  }

  /**
   * Collect quiz signal data
   */
  collectQuizSignal(
    quizType: QuizSignalData['quizType'],
    correct: boolean,
    responseLatency: number,
    hintsUsed: number,
    difficulty?: 'easy' | 'medium' | 'hard'
  ): QuizSignalData {
    return {
      quizType,
      difficulty: difficulty || 'medium',
      correct,
      responseLatency,
      hintsUsed,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Collect caregiver insight data
   */
  collectCaregiverInsight(
    tag: string,
    category: CaregiverInsightData['category'],
    positive: boolean,
    context: string
  ): CaregiverInsightData | null {
    if (!this.consent.caregiverView) return null;

    return {
      tag,
      category,
      positive,
      context,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Collect context data
   */
  collectContext(): ContextData | null {
    if (!this.consent.collectContext) return null;

    const now = new Date();
    return {
      dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' }),
      sessionTime: now.toISOString(),
      // Additional context would be collected if consented
    };
  }

  /**
   * Bundle all collected data for training
   */
  bundleTrainingData(data: {
    textEntries?: TextEntryData[];
    audioFeatures?: AudioFeatureData[];
    interactionPatterns?: InteractionPatternData[];
    quizSignals?: QuizSignalData[];
    caregiverInsights?: CaregiverInsightData[];
    context?: ContextData;
  }): TrainingData | null {
    if (!this.consent.localTraining) return null;

    return {
      ...data,
      timestamp: new Date().toISOString(),
      userId: this.userId,
    };
  }

  // Helper methods
  private mapSentimentToMood(sentiment: string): 'calm' | 'joy' | 'sad' | 'anxious' | 'neutral' {
    switch (sentiment) {
      case 'positive':
        return 'joy';
      case 'negative':
        return 'sad';
      default:
        return 'neutral';
    }
  }

  private estimateAffect(
    text: string,
    keywords: string[]
  ): { valence: number; arousal: number } {
    // Simple keyword-based affect estimation
    const positiveWords = ['happy', 'good', 'great', 'love', 'enjoy', 'wonderful'];
    const negativeWords = ['sad', 'bad', 'worried', 'anxious', 'tired', 'difficult'];
    const highArousalWords = ['excited', 'energetic', 'worried', 'anxious', 'stressed'];
    const lowArousalWords = ['calm', 'relaxed', 'peaceful', 'tired', 'sleepy'];

    const textLower = text.toLowerCase();
    let valence = 0;
    let arousal = 0;

    positiveWords.forEach(word => {
      if (textLower.includes(word)) valence += 0.2;
    });
    negativeWords.forEach(word => {
      if (textLower.includes(word)) valence -= 0.2;
    });
    highArousalWords.forEach(word => {
      if (textLower.includes(word)) arousal += 0.2;
    });
    lowArousalWords.forEach(word => {
      if (textLower.includes(word)) arousal -= 0.2;
    });

    return {
      valence: Math.max(-1, Math.min(1, valence)),
      arousal: Math.max(-1, Math.min(1, arousal)),
    };
  }
}

