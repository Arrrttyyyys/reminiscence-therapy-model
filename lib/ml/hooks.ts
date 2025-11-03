'use client';

import { useEffect, useState, useMemo } from 'react';
import { MLService } from './mlService';
import { ConsentSettings, ActivityRecommendation, EmotionPrediction } from './types';
import { mlStorage } from './storage';
import { useAuth } from '@/lib/auth';

/**
 * Hook to use ML Service
 */
export function useMLService() {
  const { user } = useAuth();
  const [mlService, setMLService] = useState<MLService | null>(null);
  const [consent, setConsent] = useState<ConsentSettings | null>(null);
  const [recommendation, setRecommendation] = useState<ActivityRecommendation | null>(null);

  useEffect(() => {
    if (!user) return;

    // Load consent settings
    const savedConsent = mlStorage.loadConsent();
    const defaultConsent: ConsentSettings = {
      localTraining: false,
      shareAggregates: false,
      caregiverView: false,
      collectAudioFeatures: false,
      collectContext: false,
    };
    const currentConsent = savedConsent || defaultConsent;

    setConsent(currentConsent);

    // Initialize ML Service
    const service = new MLService(user.email, currentConsent);
    setMLService(service);

    // Get activity recommendation
    const rec = service.recommendActivity();
    setRecommendation(rec);
  }, [user]);

  const updateConsent = (newConsent: ConsentSettings) => {
    mlStorage.saveConsent(newConsent);
    setConsent(newConsent);
    if (mlService) {
      mlService.updateConsent(newConsent);
    }
  };

  return {
    mlService,
    consent,
    recommendation,
    updateConsent,
  };
}

