'use client';

import { ModelWeights, ConsentSettings } from './types';

const STORAGE_KEYS = {
  modelWeights: 'memory-lane-ml-weights',
  consent: 'memory-lane-ml-consent',
  trainingHistory: 'memory-lane-ml-training-history',
};

export const mlStorage = {
  /**
   * Save model weights locally
   */
  saveWeights(weights: ModelWeights): void {
    try {
      // Convert Float32Array to regular array for JSON storage
      const serializable = {
        ...weights,
        emotionModel: weights.emotionModel ? Array.from(weights.emotionModel) : undefined,
        quizPersonalizationModel: weights.quizPersonalizationModel 
          ? Array.from(weights.quizPersonalizationModel) 
          : undefined,
        activityRecommendationModel: weights.activityRecommendationModel 
          ? Array.from(weights.activityRecommendationModel) 
          : undefined,
        moodForecastModel: weights.moodForecastModel 
          ? Array.from(weights.moodForecastModel) 
          : undefined,
        speechTrendModel: weights.speechTrendModel 
          ? Array.from(weights.speechTrendModel) 
          : undefined,
        memoryEmbeddingModel: weights.memoryEmbeddingModel 
          ? Array.from(weights.memoryEmbeddingModel) 
          : undefined,
      };
      localStorage.setItem(STORAGE_KEYS.modelWeights, JSON.stringify(serializable));
    } catch (error) {
      console.error('Failed to save model weights:', error);
    }
  },

  /**
   * Load model weights from storage
   */
  loadWeights(): ModelWeights | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.modelWeights);
      if (!data) return null;

      const parsed = JSON.parse(data);
      
      // Convert arrays back to Float32Array
      return {
        ...parsed,
        emotionModel: parsed.emotionModel ? new Float32Array(parsed.emotionModel) : undefined,
        quizPersonalizationModel: parsed.quizPersonalizationModel 
          ? new Float32Array(parsed.quizPersonalizationModel) 
          : undefined,
        activityRecommendationModel: parsed.activityRecommendationModel 
          ? new Float32Array(parsed.activityRecommendationModel) 
          : undefined,
        moodForecastModel: parsed.moodForecastModel 
          ? new Float32Array(parsed.moodForecastModel) 
          : undefined,
        speechTrendModel: parsed.speechTrendModel 
          ? new Float32Array(parsed.speechTrendModel) 
          : undefined,
        memoryEmbeddingModel: parsed.memoryEmbeddingModel 
          ? new Float32Array(parsed.memoryEmbeddingModel) 
          : undefined,
      };
    } catch (error) {
      console.error('Failed to load model weights:', error);
      return null;
    }
  },

  /**
   * Save consent settings
   */
  saveConsent(consent: ConsentSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.consent, JSON.stringify(consent));
    } catch (error) {
      console.error('Failed to save consent:', error);
    }
  },

  /**
   * Load consent settings
   */
  loadConsent(): ConsentSettings | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.consent);
      if (!data) {
        // Default consent (all disabled, user must opt-in)
        return {
          localTraining: false,
          shareAggregates: false,
          caregiverView: false,
          collectAudioFeatures: false,
          collectContext: false,
        };
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to load consent:', error);
      return null;
    }
  },
};

