'use client';

import { DataCollector } from './dataCollector';
import { LocalTrainer } from './localTrainer';
import { FederatedLearningCoordinator } from './federatedLearning';
import { PrivacyGuard } from './privacy';
import {
  TrainingData,
  ModelWeights,
  TrainingConfig,
  ModelPredictions,
  ConsentSettings,
  EmotionPrediction,
  ActivityRecommendation,
  SafetyFlags,
} from './types';
import { JournalEntry } from '@/types';

/**
 * Main ML Service
 * Coordinates all ML components
 */
export class MLService {
  private dataCollector: DataCollector;
  private localTrainer: LocalTrainer;
  private federatedCoordinator: FederatedLearningCoordinator;
  private privacyGuard: PrivacyGuard;
  private consent: ConsentSettings;
  private userId: string;
  private trainingDataHistory: TrainingData[] = [];

  constructor(userId: string, consent: ConsentSettings) {
    this.userId = userId;
    this.consent = consent;
    
    this.dataCollector = new DataCollector(userId, consent);
    this.localTrainer = new LocalTrainer();
    this.federatedCoordinator = new FederatedLearningCoordinator(userId, consent);
    this.privacyGuard = new PrivacyGuard(consent);
  }

  /**
   * Collect and store training data from mood tracker entry
   */
  collectFromMoodEntry(entry: JournalEntry, isSpeech: boolean = false): SafetyFlags | null {
    // Safety check for crisis language
    const safetyFlags = this.privacyGuard.checkCrisisLanguage(entry.content);

    if (safetyFlags.crisisLanguage) {
      // Log for attention but don't block
      console.warn('Crisis language detected - flag for support resources');
      return safetyFlags;
    }

    // Collect text entry data
    const textEntry = this.dataCollector.collectTextEntry(
      entry,
      isSpeech ? 'speech_transcript' : 'mood_note'
    );

    if (!textEntry) return null; // Consent not given

    // Bundle with context
    const context = this.dataCollector.collectContext();
    const trainingData = this.dataCollector.bundleTrainingData({
      textEntries: [textEntry],
      context: context || undefined,
    });

    if (trainingData) {
      // Sanitize before storing
      const sanitized = this.privacyGuard.sanitizeTrainingData(trainingData);
      this.trainingDataHistory.push(sanitized);
      
      // Limit history size
      if (this.trainingDataHistory.length > 1000) {
        this.trainingDataHistory.shift();
      }
    }

    return safetyFlags;
  }

  /**
   * Collect quiz signal data
   */
  collectQuizSignal(
    quizType: string,
    correct: boolean,
    responseLatency: number,
    hintsUsed: number,
    difficulty?: 'easy' | 'medium' | 'hard'
  ): void {
    if (!this.consent.localTraining) return;

    const signal = this.dataCollector.collectQuizSignal(
      quizType as any,
      correct,
      responseLatency,
      hintsUsed,
      difficulty
    );

    const context = this.dataCollector.collectContext();
    const trainingData = this.dataCollector.bundleTrainingData({
      quizSignals: [signal],
      context: context || undefined,
    });

    if (trainingData) {
      const sanitized = this.privacyGuard.sanitizeTrainingData(trainingData);
      this.trainingDataHistory.push(sanitized);
    }
  }

  /**
   * Collect interaction pattern
   */
  collectInteraction(
    promptId: string,
    promptType: string,
    engaged: boolean,
    dwellTime: number,
    completed: boolean
  ): void {
    if (!this.consent.localTraining) return;

    const pattern = this.dataCollector.collectInteractionPattern(
      promptId,
      promptType,
      engaged,
      dwellTime,
      completed
    );

    const context = this.dataCollector.collectContext();
    const trainingData = this.dataCollector.bundleTrainingData({
      interactionPatterns: [pattern],
      context: context || undefined,
    });

    if (trainingData) {
      const sanitized = this.privacyGuard.sanitizeTrainingData(trainingData);
      this.trainingDataHistory.push(sanitized);
    }
  }

  /**
   * Run local fine-tuning
   */
  async fineTuneLocal(config: TrainingConfig): Promise<ModelWeights> {
    if (!this.consent.localTraining) {
      throw new Error('Local training not consented');
    }

    if (this.trainingDataHistory.length < 10) {
      throw new Error('Not enough training data');
    }

    // Get recent training data
    const recentData = this.trainingDataHistory.slice(-100);

    // Fine-tune emotion model
    const weights = await this.localTrainer.fineTuneEmotionModel(recentData, config);

    // Fine-tune other models
    await this.localTrainer.fineTuneQuizPersonalization(recentData, config);
    await this.localTrainer.fineTuneActivityRecommendation(recentData, config);

    return weights;
  }

  /**
   * Predict emotion from text
   */
  predictEmotion(text: string): EmotionPrediction {
    return this.localTrainer.predictEmotion(text);
  }

  /**
   * Recommend next activity
   */
  recommendActivity(context?: any): ActivityRecommendation {
    const recommendation = this.localTrainer.recommendActivity(context);
    
    // Add explainable reason
    const explanation = this.privacyGuard.generateExplanation(
      recommendation.reason,
      context
    );

    return {
      ...recommendation,
      reason: explanation,
    };
  }

  /**
   * Prepare federated update
   */
  prepareFederatedUpdate(round: number, config: TrainingConfig): any | null {
    if (!this.consent.shareAggregates) return null;

    const baseWeights = this.localTrainer.getWeights();
    if (!baseWeights) return null;

    // Get current weights after local training
    const localWeights = baseWeights; // Would be updated after training

    const sampleCount = this.trainingDataHistory.length;
    
    return this.federatedCoordinator.prepareUpdate(
      baseWeights,
      localWeights,
      sampleCount,
      round,
      config
    );
  }

  /**
   * Update consent settings
   */
  updateConsent(newConsent: ConsentSettings): void {
    this.consent = newConsent;
    this.dataCollector = new DataCollector(this.userId, newConsent);
    this.federatedCoordinator = new FederatedLearningCoordinator(this.userId, newConsent);
    this.privacyGuard = new PrivacyGuard(newConsent);
  }

  /**
   * Get training statistics
   */
  getTrainingStats() {
    return {
      totalSamples: this.trainingDataHistory.length,
      textEntries: this.trainingDataHistory.filter(d => d.textEntries?.length).length,
      quizSignals: this.trainingDataHistory.filter(d => d.quizSignals?.length).length,
      interactions: this.trainingDataHistory.filter(d => d.interactionPatterns?.length).length,
      consent: this.consent,
    };
  }
}

