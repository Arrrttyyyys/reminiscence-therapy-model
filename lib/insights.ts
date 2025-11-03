'use client';

import { ProgressData } from '@/types';
import { JournalEntry } from '@/types';
import { QuizResult } from '@/types';

export interface TrendInsight {
  type: 'improving' | 'declining' | 'stable';
  metric: 'quizScore' | 'engagementTime' | 'sentimentScore' | 'recognitions';
  message: string;
  confidence: number;
  recommendation?: string;
}

export interface PatternInsight {
  pattern: 'weekly' | 'monthly' | 'daily';
  description: string;
  days: string[];
  value: number;
}

export interface ProgressInsight {
  trends: TrendInsight[];
  patterns: PatternInsight[];
  recommendations: string[];
  summary: string;
}

/**
 * AI-Generated Progress Insights
 * Analyzes progress data to generate trends, patterns, and recommendations
 */
export class InsightsGenerator {
  /**
   * Generate comprehensive progress insights
   */
  generateInsights(
    progress: ProgressData[],
    journalEntries: JournalEntry[],
    quizResults: QuizResult[]
  ): ProgressInsight {
    const trends = this.analyzeTrends(progress);
    const patterns = this.detectPatterns(progress);
    const recommendations = this.generateRecommendations(trends, patterns, progress, journalEntries, quizResults);
    const summary = this.generateSummary(trends, patterns);

    return {
      trends,
      patterns,
      recommendations,
      summary,
    };
  }

  /**
   * Analyze trends in progress data
   */
  private analyzeTrends(progress: ProgressData[]): TrendInsight[] {
    if (progress.length < 3) return [];

    const trends: TrendInsight[] = [];
    const sortedProgress = [...progress].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Quiz Score Trend
    const quizScores = sortedProgress.map(p => p.quizScore);
    const quizTrend = this.calculateTrend(quizScores);
    if (quizTrend) {
      trends.push({
        type: quizTrend.type,
        metric: 'quizScore',
        message: `Your quiz scores are ${quizTrend.type === 'improving' ? 'improving' : quizTrend.type === 'declining' ? 'declining' : 'stable'} over the last ${sortedProgress.length} days`,
        confidence: quizTrend.confidence,
        recommendation: quizTrend.type === 'declining' 
          ? 'Try reviewing memories more regularly to boost quiz performance'
          : quizTrend.type === 'improving'
          ? 'Great job! Keep up the consistent practice'
          : 'Maintain your current routine for best results',
      });
    }

    // Engagement Time Trend
    const engagementTimes = sortedProgress.map(p => p.engagementTime);
    const engagementTrend = this.calculateTrend(engagementTimes);
    if (engagementTrend) {
      trends.push({
        type: engagementTrend.type,
        metric: 'engagementTime',
        message: `Your engagement time is ${engagementTrend.type === 'improving' ? 'increasing' : engagementTrend.type === 'declining' ? 'decreasing' : 'stable'}`,
        confidence: engagementTrend.confidence,
        recommendation: engagementTrend.type === 'declining'
          ? 'Try setting aside dedicated time each day for memory activities'
          : undefined,
      });
    }

    // Sentiment Score Trend
    const sentimentScores = sortedProgress.map(p => p.sentimentScore);
    const sentimentTrend = this.calculateTrend(sentimentScores);
    if (sentimentTrend) {
      trends.push({
        type: sentimentTrend.type,
        metric: 'sentimentScore',
        message: `Your mood sentiment shows a ${sentimentTrend.type === 'improving' ? 'positive' : sentimentTrend.type === 'declining' ? 'negative' : 'stable'} trend`,
        confidence: sentimentTrend.confidence,
        recommendation: sentimentTrend.type === 'declining'
          ? 'Consider reviewing positive memories or speaking with a caregiver about your mood'
          : undefined,
      });
    }

    return trends;
  }

  /**
   * Calculate trend direction from data series
   */
  private calculateTrend(values: number[]): { type: 'improving' | 'declining' | 'stable'; confidence: number } | null {
    if (values.length < 3) return null;

    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    const diff = secondAvg - firstAvg;
    const threshold = (firstAvg * 0.1); // 10% change threshold

    if (Math.abs(diff) < threshold) {
      return { type: 'stable', confidence: 0.7 };
    }

    const confidence = Math.min(0.95, 0.5 + (Math.abs(diff) / firstAvg) * 0.5);

    if (diff > threshold) {
      return { type: 'improving', confidence };
    } else {
      return { type: 'declining', confidence };
    }
  }

  /**
   * Detect patterns in progress data
   */
  private detectPatterns(progress: ProgressData[]): PatternInsight[] {
    const patterns: PatternInsight[] = [];

    if (progress.length < 7) return patterns;

    // Weekly pattern detection (best day of week)
    const weeklyPattern = this.detectWeeklyPattern(progress);
    if (weeklyPattern) {
      patterns.push(weeklyPattern);
    }

    // Daily engagement pattern
    const dailyPattern = this.detectDailyPattern(progress);
    if (dailyPattern) {
      patterns.push(dailyPattern);
    }

    return patterns;
  }

  /**
   * Detect best day of week for performance
   */
  private detectWeeklyPattern(progress: ProgressData[]): PatternInsight | null {
    const dayOfWeekData: { [key: string]: number[] } = {};

    progress.forEach(p => {
      const date = new Date(p.date);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      if (!dayOfWeekData[day]) {
        dayOfWeekData[day] = [];
      }
      dayOfWeekData[day].push(p.quizScore);
    });

    let bestDay = '';
    let bestAvg = 0;

    Object.entries(dayOfWeekData).forEach(([day, scores]) => {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (avg > bestAvg) {
        bestAvg = avg;
        bestDay = day;
      }
    });

    if (bestDay) {
      return {
        pattern: 'weekly',
        description: `You perform best on ${bestDay}s with an average quiz score of ${Math.round(bestAvg)}%`,
        days: [bestDay],
        value: bestAvg,
      };
    }

    return null;
  }

  /**
   * Detect daily pattern
   */
  private detectDailyPattern(progress: ProgressData[]): PatternInsight | null {
    if (progress.length < 7) return null;

    // Check if engagement is consistent daily
    const engagementDays = progress.filter(p => p.engagementTime > 10).length;
    const consistency = engagementDays / progress.length;

    if (consistency > 0.7) {
      return {
        pattern: 'daily',
        description: `You're engaging ${Math.round(consistency * 100)}% of days - excellent consistency!`,
        days: [],
        value: consistency * 100,
      };
    }

    return null;
  }

  /**
   * Generate personalized recommendations
   */
  private generateRecommendations(
    trends: TrendInsight[],
    patterns: PatternInsight[],
    progress: ProgressData[],
    journalEntries: JournalEntry[],
    quizResults: QuizResult[]
  ): string[] {
    const recommendations: string[] = [];

    // Trend-based recommendations
    const decliningTrends = trends.filter(t => t.type === 'declining');
    if (decliningTrends.length > 0) {
      recommendations.push('Focus on activities that showed improvement in the past');
      recommendations.push('Consider setting a daily reminder for memory activities');
    }

    // Pattern-based recommendations
    const weeklyPattern = patterns.find(p => p.pattern === 'weekly');
    if (weeklyPattern && weeklyPattern.days.length > 0) {
      recommendations.push(`Schedule more intensive memory activities on ${weeklyPattern.days[0]}s when you perform best`);
    }

    // Engagement recommendations
    const avgEngagement = progress.length > 0
      ? progress.reduce((sum, p) => sum + p.engagementTime, 0) / progress.length
      : 0;

    if (avgEngagement < 15) {
      recommendations.push('Try to spend at least 15-20 minutes daily with memory activities');
    } else if (avgEngagement > 30) {
      recommendations.push('Great job on consistent engagement! Keep up the excellent work');
    }

    // Quiz performance recommendations
    const recentQuizResults = quizResults.slice(-5);
    const recentAccuracy = recentQuizResults.length > 0
      ? recentQuizResults.filter(q => q.score >= 80).length / recentQuizResults.length
      : 0;

    if (recentAccuracy < 0.6) {
      recommendations.push('Review memories more frequently to improve quiz accuracy');
    }

    // Journal recommendations
    const recentJournals = journalEntries.slice(-7);
    if (recentJournals.length < 3) {
      recommendations.push('Try journaling more regularly to track mood and memory patterns');
    }

    return recommendations;
  }

  /**
   * Generate summary of insights
   */
  private generateSummary(trends: TrendInsight[], patterns: PatternInsight[]): string {
    const improvingTrends = trends.filter(t => t.type === 'improving').length;
    const decliningTrends = trends.filter(t => t.type === 'declining').length;

    if (improvingTrends > decliningTrends) {
      return `Your progress shows overall improvement with ${improvingTrends} metric${improvingTrends > 1 ? 's' : ''} trending upward. Keep up the great work!`;
    } else if (decliningTrends > improvingTrends) {
      return `Your progress shows some areas that may need attention. Consider focusing on activities that boost your performance.`;
    } else {
      return `Your progress is stable. Consistency is key - maintain your current routine for best results.`;
    }
  }
}

export const insightsGenerator = new InsightsGenerator();

