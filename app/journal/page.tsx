'use client';

import { useEffect, useState, useRef } from 'react';
import Layout from '@/components/Layout';
import { BookOpen, Heart, TrendingUp, Calendar, Mic, MicOff, Sparkles, Video, VideoOff, Loader2, Trash2 } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { JournalEntry, EmotionData, VideoEntry } from '@/types';
import { storage } from '@/lib/storage';
import { analyzeSentiment, extractKeywords, calculateSentimentScore } from '@/lib/utils';
import { format } from 'date-fns';
import { useMLService } from '@/lib/ml/hooks';
import ConfirmDialog from '@/components/ConfirmDialog';
// Lazy load emotion detection - only import when needed
let emotionDetector: any = null;
const getEmotionDetector = async () => {
  if (!emotionDetector) {
    const module = await import('@/lib/emotionDetection');
    emotionDetector = module.emotionDetector;
  }
  return emotionDetector;
};

export default function MoodTrackerPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [saving, setSaving] = useState(false);
  const [sentimentScore, setSentimentScore] = useState(50);
  const [isRecording, setIsRecording] = useState(false); // For voice
  const [isRecordingVideo, setIsRecordingVideo] = useState(false); // For video
  const [recognition, setRecognition] = useState<any>(null);
  const [mlPrediction, setMLPrediction] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { mlService, recommendation } = useMLService();

  // Video recording states
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoStream = useRef<MediaStream | null>(null);
  const [videoEntry, setVideoEntry] = useState<VideoEntry | null>(null);
  const [analyzingEmotions, setAnalyzingEmotions] = useState(false);
  const [entryType, setEntryType] = useState<'text' | 'voice' | 'video'>('text');
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [deleteEntryId, setDeleteEntryId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadEntries();
    updateSentimentScore();
    
    // Initialize Speech Recognition
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setCurrentEntry(prev => prev + transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognition);
    }

    // Don't pre-load models - only load when user starts video recording
    // This speeds up page load significantly
  }, []);

  useEffect(() => {
    updateSentimentScore();
  }, [entries]);

  const loadEntries = () => {
    const savedEntries = storage.getJournalEntries();
    setEntries(savedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const updateSentimentScore = () => {
    setSentimentScore(calculateSentimentScore());
  };

  const startVideoRecording = async () => {
    setError(null);
    setVideoEntry(null);
    setCurrentEntry('');
    
    // Ensure video ref is available
    if (!videoRef.current) {
      setError('Video element not available. Please try again.');
      return;
    }
    
    // Start camera immediately - don't load models yet
    // Models will load only if user wants emotion analysis after recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      videoStream.current = stream;

      recordedChunksRef.current = [];
      mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'video/webm' });

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        
        // Create video entry immediately (don't wait for emotion analysis)
        const videoUrl = URL.createObjectURL(blob);
        const videoElement = document.createElement('video');
        videoElement.src = videoUrl;
        
        const duration = await new Promise<number>((resolve) => {
          videoElement.addEventListener('loadedmetadata', () => {
            resolve(videoElement.duration);
          }, { once: true });
        });
        
        // Create video entry immediately
        setVideoEntry({
          videoUrl,
          duration,
          emotions: [],
          averageEmotion: 'neutral',
        });
        
        // Optionally analyze emotions in the background (non-blocking)
        // This won't block the UI - user can save entry while analysis happens
        setAnalyzingEmotions(true);
        getEmotionDetector()
          .then(detector => {
            return detector.loadModels().then(() => detector);
          })
          .then(detector => {
            return detector.analyzeVideo(blob, 2);
          })
          .then(emotions => {
            getEmotionDetector().then(detector => {
              const averageEmotion = detector.calculateAverageEmotion(emotions);
              setVideoEntry(prev => prev ? {
                ...prev,
                emotions,
                averageEmotion,
              } : null);
              setAnalyzingEmotions(false);
            });
          })
          .catch(emotionError => {
            console.error('Emotion analysis failed:', emotionError);
            setAnalyzingEmotions(false);
            // Entry already created, analysis is optional
          });

        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        setIsRecordingVideo(false);
      };

      mediaRecorder.current.start();
      setIsRecordingVideo(true);
      setEntryType('video');
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setError('Failed to start video recording. Please ensure camera and microphone access are granted.');
      setIsRecordingVideo(false);
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
    }
    if (videoStream.current) {
      videoStream.current.getTracks().forEach(track => track.stop());
    }
    setIsRecordingVideo(false);
  };

  const handleSave = () => {
    // Validation
    if (!currentEntry.trim() && !videoEntry) {
      setError('Please enter some text, use voice recording, or record a video.');
      return;
    }

    if (currentEntry.trim().length < 3 && !videoEntry) {
      setError('Entry is too short. Please share a bit more.');
      return;
    }

    setSaving(true);
    setError(null);

    // Use current entry or default text for video entries
    const entryText = currentEntry.trim() || (videoEntry ? 'Video journal entry' : '');

    const entry: JournalEntry = {
      id: Date.now().toString(),
      content: entryText,
      date: new Date().toISOString(),
      sentiment: analyzeSentiment(entryText),
      keywords: extractKeywords(entryText),
      entryType: videoEntry ? 'video' : (entryType || 'text'),
      videoEntry: videoEntry || undefined,
    };

    // Collect data for ML training (if consented)
    if (mlService) {
      try {
        const wasSpeech = isRecording;
        const safetyFlags = mlService.collectFromMoodEntry(entry, wasSpeech);
        
        // Predict emotion for display
        try {
          const prediction = mlService.predictEmotion(entryText);
          setMLPrediction(prediction);
        } catch (predError) {
          console.error('ML prediction failed:', predError);
        }

        // Check for safety flags (crisis language, etc.)
        if (safetyFlags?.crisisLanguage) {
          // Show support resources
          alert('If you\'re in crisis, please reach out:\n\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• Contact your healthcare provider immediately');
        }
      } catch (mlError) {
        console.error('ML collection failed:', mlError);
        // Continue with save even if ML fails
      }
    }

    storage.saveJournalEntry(entry);
    loadEntries();
    setCurrentEntry('');
    setSaving(false);
    setIsRecording(false);
    setVideoEntry(null); // Clear video entry after saving
    setEntryType('text');
  };

  const handleVoiceRecording = () => {
    if (!recognition) {
      setError('Speech recognition is not available in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      if (isRecording) {
        recognition.stop();
        setIsRecording(false);
      } else {
        // Stop video if recording
        if (isRecordingVideo) {
          stopVideoRecording();
        }
        recognition.start();
        setIsRecording(true);
        setEntryType('voice');
        setError(null);
      }
    } catch (error) {
      console.error('Speech recognition error:', error);
      setError('Failed to start recording. Please try again.');
      setIsRecording(false);
    }
  };

  const handleVideoRecording = () => {
    if (isRecordingVideo) {
      stopVideoRecording();
    } else {
      // Stop voice if recording
      if (isRecording && recognition) {
        recognition.stop();
        setIsRecording(false);
      }
      startVideoRecording();
    }
  };

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === 'positive') return 'from-green-500 to-teal-500';
    if (sentiment === 'negative') return 'from-red-500 to-pink-500';
    return 'from-blue-500 to-cyan-500';
  };

  const getSentimentEmoji = (sentiment: string) => {
    if (sentiment === 'positive') return '😊';
    if (sentiment === 'negative') return '😔';
    return '😐';
  };

  const handleDeleteClick = (entryId: string) => {
    setDeleteEntryId(entryId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteEntryId) {
      storage.deleteJournalEntry(deleteEntryId);
      loadEntries();
      updateSentimentScore();
      setShowDeleteConfirm(false);
      setDeleteEntryId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeleteEntryId(null);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 pb-32 fade-in">
        {/* Header */}
        <div className="mb-6 slide-up">
          <h2 className="text-3xl font-bold text-white mb-2">Mood Tracker</h2>
          <p className="text-gray-400">Share your thoughts and feelings through text, voice, or video</p>
        </div>

        {/* Sentiment Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900/50 border border-teal-500/30 rounded-2xl shadow-md p-5 slide-up">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-12 h-12 bg-gradient-to-br ${getSentimentColor('positive')} rounded-xl flex items-center justify-center`}>
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{sentimentScore}</p>
                <p className="text-xs text-gray-400">Sentiment Score</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-blue-500/30 rounded-2xl shadow-md p-5 slide-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{entries.length}</p>
                <p className="text-xs text-gray-400">Total Entries</p>
              </div>
            </div>
          </div>
        </div>

        {/* Write Entry */}
        <div className="bg-gray-900/50 border border-teal-500/30 rounded-3xl shadow-lg p-6 slide-up">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-teal-400" />
            Share Your Thoughts
          </h3>
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
          {modelsLoading && (
            <div className="mb-4 p-3 bg-teal-500/10 border border-teal-500/30 rounded-xl">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                <p className="text-sm text-teal-400">Loading emotion detection models (first time only, ~5-10 seconds)...</p>
              </div>
            </div>
          )}
          {modelsLoaded && (
            <div className="mb-4 p-2 bg-green-500/10 border border-green-500/30 rounded-xl">
              <p className="text-xs text-green-400">✓ Emotion detection ready</p>
            </div>
          )}
          
          <div className={`mb-4 relative ${isRecordingVideo ? '' : 'hidden'}`}>
            <video ref={videoRef} autoPlay muted playsInline className="w-full rounded-xl border border-gray-700"></video>
            {isRecordingVideo && (
              <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                Recording
              </div>
            )}
          </div>

          {videoEntry && !isRecordingVideo && (
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-white mb-2">Recorded Video</h4>
              <video src={videoEntry.videoUrl} controls className="w-full rounded-xl border border-gray-700"></video>
              {analyzingEmotions ? (
                <div className="flex items-center justify-center py-4 text-teal-400">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Analyzing emotions...
                </div>
              ) : (
                <>
                  <p className="text-gray-400 text-sm mt-2">Duration: {videoEntry.duration.toFixed(1)} seconds</p>
                  <p className="text-gray-300 mt-1">Average Emotion: <span className="font-semibold capitalize">{videoEntry.averageEmotion}</span></p>
                  {videoEntry.emotions.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-md font-semibold text-white mb-2">Emotion Summary:</h5>
                      <p className="text-gray-300">
                        {videoEntry.emotions.map(e => e.emotion).reduce((acc, emo, i, arr) => {
                          const count = arr.filter(e => e === emo).length;
                          return acc.includes(emo) ? acc : [...acc, `${emo} (${Math.round(count/arr.length*100)}%)`];
                        }, [] as string[]).join(', ')}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          <textarea
            value={currentEntry}
            onChange={(e) => {
              setCurrentEntry(e.target.value);
              setError(null); // Clear error on input
            }}
            placeholder="How are you feeling today? What do you remember? Share anything that comes to mind..."
            className="w-full h-48 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none text-white placeholder-gray-500"
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleVoiceRecording}
              className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                isRecording
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-800 text-white border border-gray-700 hover:bg-gray-700'
              }`}
            >
              {isRecording ? (
                <>
                  <Mic className="w-5 h-5 animate-pulse" />
                  <span>Stop Voice</span>
                </>
              ) : (
                <>
                  <MicOff className="w-5 h-5" />
                  <span>Start Voice</span>
                </>
              )}
            </button>
            <button
              onClick={handleVideoRecording}
              className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                isRecordingVideo
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-800 text-white border border-gray-700 hover:bg-gray-700'
              }`}
            >
              {isRecordingVideo ? (
                <>
                  <VideoOff className="w-5 h-5 animate-pulse" />
                  <span>Stop Video</span>
                </>
              ) : (
                <>
                  <Video className="w-5 h-5" />
                  <span>Start Video</span>
                </>
              )}
            </button>
            <button
              onClick={handleSave}
              disabled={saving || (!currentEntry.trim() && !videoEntry)}
              className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        </div>

        {/* Entries List */}
        {entries.length > 0 && (
          <div className="slide-up">
            <h3 className="text-xl font-semibold text-white mb-4">Previous Entries</h3>
            <div className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-gray-900/50 border border-gray-700 rounded-2xl shadow-md p-5 hover:border-teal-500/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 bg-gradient-to-br ${getSentimentColor(entry.sentiment)} rounded-lg flex items-center justify-center`}>
                        <span className="text-2xl">{getSentimentEmoji(entry.sentiment)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-white capitalize">{entry.sentiment}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(entry.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(entry.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-300 mb-3">{entry.content}</p>
                  {entry.videoEntry && (
                    <div className="mt-4 mb-3">
                      <video src={entry.videoEntry.videoUrl} controls className="w-full rounded-xl border border-gray-700 mb-2"></video>
                      <p className="text-gray-400 text-sm">Average Emotion: <span className="font-semibold capitalize">{entry.videoEntry.averageEmotion}</span></p>
                      {entry.videoEntry.emotions.length > 0 && (
                        <div className="mt-2">
                          <h5 className="text-md font-semibold text-white mb-2">Emotion Summary:</h5>
                          <p className="text-gray-300">
                            {entry.videoEntry.emotions.map(e => e.emotion).reduce((acc, emo, i, arr) => {
                              const count = arr.filter(e => e === emo).length;
                              return acc.includes(emo) ? acc : [...acc, `${emo} (${Math.round(count/arr.length*100)}%)`];
                            }, [] as string[]).join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  {entry.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {entry.keywords.slice(0, 5).map((keyword, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-teal-500/20 text-teal-400 rounded-full text-xs border border-teal-500/30"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {entries.length === 0 && (
          <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-12 text-center slide-up">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No entries yet</h3>
            <p className="text-gray-400">Start writing or recording your thoughts above</p>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Entry"
          message="Are you sure you want to delete this journal entry? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      </div>
    </Layout>
  );
}

