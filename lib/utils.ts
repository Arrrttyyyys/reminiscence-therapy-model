import { JournalEntry, ProgressData } from '@/types';
import { storage } from './storage';

export function analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
  const positiveWords = ['happy', 'joy', 'love', 'great', 'wonderful', 'beautiful', 'amazing', 'excited', 'smile', 'peaceful'];
  const negativeWords = ['sad', 'angry', 'worried', 'scared', 'frustrated', 'tired', 'upset', 'lonely', 'confused'];

  const lowerText = text.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

export function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().split(/\s+/);
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'was'];
  return words.filter(word => word.length > 3 && !commonWords.includes(word)).slice(0, 10);
}

export function calculateSentimentScore(): number {
  const entries = storage.getJournalEntries();
  if (entries.length === 0) return 50;

  let score = 50;
  entries.slice(-30).forEach(entry => {
    if (entry.sentiment === 'positive') score += 2;
    if (entry.sentiment === 'negative') score -= 2;
  });

  return Math.max(0, Math.min(100, score));
}

export function calculateEngagementScore(): number {
  const progress = storage.getProgressData();
  if (progress.length === 0) return 0;

  const recentProgress = progress.slice(-7);
  const avgEngagement = recentProgress.reduce((sum, p) => sum + p.engagementTime, 0) / recentProgress.length;
  return Math.min(100, Math.round(avgEngagement / 5));
}

export function generateSuggestions(): string {
  const score = calculateSentimentScore();
  const engagement = calculateEngagementScore();
  const entries = storage.getJournalEntries();

  if (score < 40) {
    return "Would you like to look at happy memories from your family photos?";
  }
  if (engagement < 20) {
    return "Let's do a fun memory quiz together!";
  }
  if (entries.length === 0) {
    return "How about sharing your thoughts in the journal today?";
  }

  return "It's a great day to explore your memories!";
}

export function getWeeklyProgress(): ProgressData[] {
  const progress = storage.getProgressData();
  return progress.slice(-7);
}

