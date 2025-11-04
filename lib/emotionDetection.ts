import { EmotionData, VideoEntry } from '@/types';

// Lazy load face-api.js - only import when actually needed
let faceapi: any = null;
const loadFaceApi = async () => {
  if (typeof window === 'undefined') {
    throw new Error('face-api.js can only be loaded on the client side');
  }
  if (!faceapi) {
    const module = await import('face-api.js');
    faceapi = module;
  }
  return faceapi;
};

// Emotion detection using face-api.js for facial expression analysis
export class EmotionDetector {
  private modelsLoaded = false;
  private loadingPromise: Promise<void> | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  private getCanvas(): HTMLCanvasElement {
    if (typeof window === 'undefined') {
      throw new Error('Canvas can only be created on the client side');
    }
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d')!;
    }
    return this.canvas;
  }

  private getContext(): CanvasRenderingContext2D {
    if (!this.ctx) {
      const canvas = this.getCanvas();
      this.ctx = canvas.getContext('2d')!;
    }
    return this.ctx;
  }

  // Load face-api.js models (only once)
  async loadModels(): Promise<void> {
    if (this.modelsLoaded) return;
    
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = (async () => {
      try {
        // Dynamically import face-api.js if not already imported
        const faceapiModule = await loadFaceApi();

        // Load models from CDN with progress tracking
        // Using jsdelivr CDN - models are served from npm package
        const baseUrl = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights/';
        
        console.log('Loading emotion detection models... This may take a few seconds on first load.');
        
        try {
          await Promise.all([
            faceapiModule.nets.tinyFaceDetector.loadFromUri(baseUrl).then(() => console.log('✓ TinyFaceDetector loaded')),
            faceapiModule.nets.faceLandmark68Net.loadFromUri(baseUrl).then(() => console.log('✓ FaceLandmark68Net loaded')),
            faceapiModule.nets.faceExpressionNet.loadFromUri(baseUrl).then(() => console.log('✓ FaceExpressionNet loaded')),
          ]);
        } catch (cdnError) {
          // If CDN fails, try alternative CDN
          console.warn('Primary CDN failed, trying alternative...', cdnError);
          const altBaseUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';
          await Promise.all([
            faceapiModule.nets.tinyFaceDetector.loadFromUri(altBaseUrl).then(() => console.log('✓ TinyFaceDetector loaded (alt)')),
            faceapiModule.nets.faceLandmark68Net.loadFromUri(altBaseUrl).then(() => console.log('✓ FaceLandmark68Net loaded (alt)')),
            faceapiModule.nets.faceExpressionNet.loadFromUri(altBaseUrl).then(() => console.log('✓ FaceExpressionNet loaded (alt)')),
          ]);
        }
        
        this.modelsLoaded = true;
        console.log('Face-api.js models loaded successfully');
      } catch (error) {
        console.error('Error loading face-api models:', error);
        throw error;
      }
    })();

    return this.loadingPromise;
  }

  // Detect emotions from a video frame using face-api.js
  async detectEmotionFromFrame(
    video: HTMLVideoElement,
    timestamp: number
  ): Promise<EmotionData> {
    try {
      // Ensure models are loaded
      await this.loadModels();
    } catch (error) {
      console.warn('Models not loaded, using fallback:', error);
      return this.fallbackEmotionDetection(video, timestamp);
    }

    // Set canvas size to match video
    const canvas = this.getCanvas();
    const ctx = this.getContext();
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      // Ensure face-api is loaded
      const faceapiModule = await loadFaceApi();

      // Detect face and expressions
      const detection = await faceapiModule
        .detectSingleFace(canvas, new faceapiModule.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detection && detection.expressions) {
        const expressions = detection.expressions;
        
        // Find the emotion with highest confidence
        let maxEmotion: string = 'neutral';
        let maxConfidence = expressions.neutral;

        Object.entries(expressions).forEach(([emotion, confidence]: [string, any]) => {
          if (confidence > maxConfidence) {
            maxConfidence = confidence;
            maxEmotion = emotion;
          }
        });

        // Map face-api emotions to our emotion types
        const emotionMap: Record<string, EmotionData['emotion']> = {
          happy: 'happy',
          sad: 'sad',
          angry: 'angry',
          surprised: 'surprised',
          fearful: 'fearful',
          disgusted: 'disgusted',
          neutral: 'neutral',
        };

        return {
          emotion: emotionMap[maxEmotion] || 'neutral',
          confidence: maxConfidence,
          timestamp,
        };
      }

      // No face detected
      return {
        emotion: 'neutral',
        confidence: 0.5,
        timestamp,
      };
    } catch (error) {
      console.error('Error detecting emotion:', error);
      return this.fallbackEmotionDetection(video, timestamp);
    }
  }

  // Fallback emotion detection (simplified analysis)
  private fallbackEmotionDetection(video: HTMLVideoElement, timestamp: number): EmotionData {
    // This is a placeholder - returns neutral with low confidence
    return {
      emotion: 'neutral',
      confidence: 0.3,
      timestamp,
    };
  }

  // Analyze video and extract emotions at intervals
  async analyzeVideo(
    videoBlob: Blob,
    intervalSeconds: number = 2
  ): Promise<EmotionData[]> {
    // Pre-load models before starting analysis
    try {
      await this.loadModels();
    } catch (error) {
      console.warn('Could not load models, emotion detection may be limited');
    }

    return new Promise((resolve) => {
      const video = document.createElement('video');
      const url = URL.createObjectURL(videoBlob);
      video.src = url;
      video.muted = true;
      video.playsInline = true;

      const emotions: EmotionData[] = [];

      video.addEventListener('loadedmetadata', async () => {
        const duration = video.duration;
        const intervals = Math.floor(duration / intervalSeconds);

        // Analyze first frame immediately
        try {
          const firstEmotion = await this.detectEmotionFromFrame(video, 0);
          emotions.push(firstEmotion);
        } catch (error) {
          console.error('Error analyzing first frame:', error);
        }

        // For each interval, seek to that time and analyze frame
        let analyzedCount = 0;
        for (let i = 1; i <= intervals; i++) {
          const timestamp = i * intervalSeconds;
          if (timestamp >= duration) break;

          video.currentTime = timestamp;
          
          await new Promise((r) => {
            const onSeeked = async () => {
              try {
                const emotion = await this.detectEmotionFromFrame(video, timestamp);
                emotions.push(emotion);
              } catch (error) {
                console.error(`Error analyzing frame at ${timestamp}s:`, error);
              }
              
              analyzedCount++;
              if (analyzedCount >= intervals || timestamp >= duration) {
                URL.revokeObjectURL(url);
                resolve(emotions);
              }
              r(null);
            };

            video.addEventListener('seeked', onSeeked, { once: true });
          });
        }

        // If no intervals were processed, ensure we resolve
        if (emotions.length === 0) {
          URL.revokeObjectURL(url);
          resolve(emotions);
        }
      });

      video.load();
    });
  }

  // Calculate average emotion from detected emotions
  calculateAverageEmotion(emotions: EmotionData[]): string {
    if (emotions.length === 0) return 'neutral';

    const emotionCounts: Record<string, number> = {};
    
    emotions.forEach((e) => {
      emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + e.confidence;
    });

    // Find emotion with highest weighted count
    let maxEmotion = 'neutral';
    let maxScore = 0;

    Object.entries(emotionCounts).forEach(([emotion, score]) => {
      if (score > maxScore) {
        maxScore = score;
        maxEmotion = emotion;
      }
    });

    return maxEmotion;
  }

  // Generate emotion summary text
  generateEmotionSummary(emotions: EmotionData[]): string {
    if (emotions.length === 0) {
      return 'No emotions detected in this recording.';
    }

    const emotionCounts: Record<string, number> = {};
    
    emotions.forEach((e) => {
      emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + 1;
    });

    const sortedEmotions = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    const summaryParts: string[] = [];

    sortedEmotions.forEach(([emotion, count], index) => {
      const percentage = Math.round((count / emotions.length) * 100);
      const emotionLabel = emotion.charAt(0).toUpperCase() + emotion.slice(1);
      
      if (index === 0) {
        summaryParts.push(`Mostly ${emotionLabel} (${percentage}% of the time)`);
      } else {
        summaryParts.push(`Some ${emotionLabel} (${percentage}%)`);
      }
    });

    return `Emotions detected: ${summaryParts.join(', ')}.`;
  }
}

// Create a singleton instance
export const emotionDetector = new EmotionDetector();

