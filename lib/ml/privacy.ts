'use client';

import { SafetyFlags, TrainingData, ConsentSettings } from './types';

/**
 * Privacy and Safety Guardrails
 * Ensures ethical use and safety checks
 */
export class PrivacyGuard {
  private consent: ConsentSettings;

  constructor(consent: ConsentSettings) {
    this.consent = consent;
  }

  /**
   * Check for crisis language in text
   */
  checkCrisisLanguage(text: string): SafetyFlags {
    const flags: SafetyFlags = {};

    // Crisis keywords (in production, use more sophisticated NLP)
    const crisisKeywords = [
      'hurt myself',
      'suicide',
      'want to die',
      'end it all',
      'no reason to live',
      'hopeless',
      'give up',
    ];

    const textLower = text.toLowerCase();
    const hasCrisisLanguage = crisisKeywords.some(keyword => 
      textLower.includes(keyword)
    );

    if (hasCrisisLanguage) {
      flags.crisisLanguage = true;
      flags.requiresAttention = true;
    }

    return flags;
  }

  /**
   * Detect significant mood drop
   */
  detectMoodDrop(recentMoods: number[]): SafetyFlags {
    const flags: SafetyFlags = {};

    if (recentMoods.length < 3) return flags;

    // Check for significant drop (2+ standard deviations)
    const mean = recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length;
    const variance = recentMoods.reduce((sum, mood) => 
      sum + Math.pow(mood - mean, 2), 0) / recentMoods.length;
    const stdDev = Math.sqrt(variance);

    const latest = recentMoods[recentMoods.length - 1];
    const recent = recentMoods.slice(-3);

    if (latest < mean - 2 * stdDev) {
      flags.significantMoodDrop = true;
      flags.requiresAttention = true;
    }

    return flags;
  }

  /**
   * Sanitize data before training (remove PII)
   */
  sanitizeTrainingData(data: TrainingData): TrainingData {
    const sanitized = { ...data };

    // Remove potential PII from text
    if (sanitized.textEntries) {
      sanitized.textEntries = sanitized.textEntries.map(entry => ({
        ...entry,
        text: this.removePII(entry.text),
      }));
    }

    // Never include raw audio/media
    // Only features should be present

    return sanitized;
  }

  /**
   * Remove personally identifiable information from text
   */
  private removePII(text: string): string {
    // Simple PII removal (in production, use NER models)
    
    // Remove email patterns
    let sanitized = text.replace(/[\w\.-]+@[\w\.-]+\.\w+/g, '[EMAIL]');
    
    // Remove phone patterns
    sanitized = sanitized.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]');
    
    // Remove address patterns (simplified)
    sanitized = sanitized.replace(/\d+\s+[\w\s]+(?:street|st|avenue|ave|road|rd|drive|dr)/gi, '[ADDRESS]');
    
    return sanitized;
  }

  /**
   * Validate consent for data collection
   */
  validateConsent(operation: 'localTraining' | 'shareAggregates' | 'collectAudio' | 'collectContext'): boolean {
    switch (operation) {
      case 'localTraining':
        return this.consent.localTraining;
      case 'shareAggregates':
        return this.consent.shareAggregates;
      case 'collectAudio':
        return this.consent.collectAudioFeatures;
      case 'collectContext':
        return this.consent.collectContext;
      default:
        return false;
    }
  }

  /**
   * Generate explainable reason for recommendation
   */
  generateExplanation(reason: string, data: any): string {
    // Create user-friendly explanation
    const explanations: string[] = [];

    if (reason.includes('time')) {
      explanations.push('Based on the time of day');
    }
    if (reason.includes('mood')) {
      explanations.push('Based on your recent mood patterns');
    }
    if (reason.includes('preference')) {
      explanations.push('Based on activities you\'ve enjoyed');
    }
    if (reason.includes('caregiver')) {
      explanations.push('Based on caregiver insights');
    }

    if (explanations.length === 0) {
      return 'Suggested based on your activity patterns';
    }

    return explanations.join(', ') + '.';
  }

  /**
   * Check if data should be shared with caregiver
   */
  shouldShareWithCaregiver(data: TrainingData): boolean {
    return this.consent.caregiverView && !this.consent.shareAggregates;
  }
}

