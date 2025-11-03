'use client';

import { ModelWeights, FederatedUpdate, TrainingConfig, ConsentSettings } from './types';

/**
 * Federated Learning Coordinator
 * Handles secure aggregation and differential privacy
 */
export class FederatedLearningCoordinator {
  private consent: ConsentSettings;
  private clientId: string;

  constructor(clientId: string, consent: ConsentSettings) {
    this.clientId = clientId;
    this.consent = consent;
  }

  /**
   * Prepare federated update from local weights
   * Applies differential privacy and weight clipping
   */
  prepareUpdate(
    baseWeights: ModelWeights,
    localWeights: ModelWeights,
    sampleCount: number,
    round: number,
    config: TrainingConfig
  ): FederatedUpdate | null {
    if (!this.consent.shareAggregates) {
      return null; // User opted out of federated sharing
    }

    // Calculate weight delta (difference between local and base)
    const weightDelta = this.calculateWeightDelta(baseWeights, localWeights);

    // Apply differential privacy if enabled
    if (config.differentialPrivacy?.enabled) {
      this.applyDifferentialPrivacy(weightDelta, config.differentialPrivacy);
    }

    // Clip weights to prevent outliers
    this.clipWeights(weightDelta, config.differentialPrivacy?.clipNorm || 1.0);

    return {
      weightDelta,
      clientId: this.clientId,
      sampleCount,
      round,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Aggregate federated updates from multiple clients
   * Simulates secure aggregation (in production, use secure multi-party computation)
   */
  aggregateUpdates(updates: FederatedUpdate[]): ModelWeights | null {
    if (updates.length === 0) return null;

    // Weighted average based on sample count
    const totalSamples = updates.reduce((sum, u) => sum + u.sampleCount, 0);
    
    if (totalSamples === 0) return null;

    // Aggregate weights (simplified - in production, use secure aggregation)
    const aggregatedWeights: ModelWeights = {
      emotionModel: this.aggregateWeights(
        updates.map(u => u.weightDelta),
        updates.map(u => u.sampleCount / totalSamples)
      ),
      version: `federated-${updates[0].round}`,
      timestamp: new Date().toISOString(),
    };

    return aggregatedWeights;
  }

  /**
   * Apply differential privacy noise to weights
   */
  private applyDifferentialPrivacy(
    weights: Float32Array,
    dpConfig: { noiseScale: number; clipNorm: number }
  ): void {
    // Add Laplace noise for differential privacy
    for (let i = 0; i < weights.length; i++) {
      const noise = this.laplaceNoise(dpConfig.noiseScale);
      weights[i] += noise;
    }
  }

  /**
   * Clip weights to prevent large updates
   */
  private clipWeights(weights: Float32Array, clipNorm: number): void {
    // Calculate L2 norm
    let norm = 0;
    for (let i = 0; i < weights.length; i++) {
      norm += weights[i] * weights[i];
    }
    norm = Math.sqrt(norm);

    // Clip if norm exceeds threshold
    if (norm > clipNorm) {
      const scale = clipNorm / norm;
      for (let i = 0; i < weights.length; i++) {
        weights[i] *= scale;
      }
    }
  }

  /**
   * Calculate weight delta between base and local weights
   */
  private calculateWeightDelta(
    baseWeights: ModelWeights,
    localWeights: ModelWeights
  ): Float32Array {
    if (!baseWeights.emotionModel || !localWeights.emotionModel) {
      return new Float32Array(0);
    }

    const delta = new Float32Array(localWeights.emotionModel.length);
    for (let i = 0; i < delta.length; i++) {
      delta[i] = localWeights.emotionModel[i] - baseWeights.emotionModel[i];
    }

    return delta;
  }

  /**
   * Aggregate multiple weight arrays using weighted average
   */
  private aggregateWeights(
    weightArrays: Float32Array[],
    weights: number[]
  ): Float32Array {
    if (weightArrays.length === 0) return new Float32Array(0);
    
    const length = weightArrays[0].length;
    const aggregated = new Float32Array(length);

    for (let i = 0; i < length; i++) {
      let sum = 0;
      for (let j = 0; j < weightArrays.length; j++) {
        sum += weightArrays[j][i] * weights[j];
      }
      aggregated[i] = sum;
    }

    return aggregated;
  }

  /**
   * Generate Laplace noise for differential privacy
   */
  private laplaceNoise(scale: number): number {
    // Simplified Laplace distribution
    const u = Math.random() - 0.5;
    return -scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
  }
}

