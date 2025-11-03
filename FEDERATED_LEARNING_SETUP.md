# Federated Learning + On-Device Fine-Tuning Setup

## Overview

This document describes the Federated Learning (FL) + Edge/On-Device Fine-Tuning system integrated into the Memory Lane mood tracker.

## Architecture

### Core Components

1. **Data Collector** (`lib/ml/dataCollector.ts`)
   - Collects training signals from user interactions
   - Respects privacy and consent settings
   - Only collects prosody features, not raw audio

2. **Local Trainer** (`lib/ml/localTrainer.ts`)
   - Performs on-device fine-tuning
   - Starts with foundation model weights
   - Updates models using local private data

3. **Federated Learning Coordinator** (`lib/ml/federatedLearning.ts`)
   - Prepares weight deltas for sharing
   - Applies differential privacy
   - Handles secure aggregation

4. **Privacy Guard** (`lib/ml/privacy.ts`)
   - Safety checks for crisis language
   - PII removal and sanitization
   - Consent validation

5. **ML Service** (`lib/ml/mlService.ts`)
   - Main orchestration service
   - Coordinates all ML components
   - Provides prediction APIs

## Data Collected (On-Device Only)

### Text Entries
- Mood notes and journal entries
- Speech-to-text transcripts
- Quiz answers
- **Never includes raw audio or images**

### Audio Features (Prosody Only)
- Pitch (extracted features)
- Energy levels
- Speech rate (words per minute)
- Jitter and pause patterns
- **Raw audio never stored or transmitted**

### Interaction Patterns
- Which prompts users engage with
- Time of day and day of week
- Completion rates and streaks
- Dwell time on activities

### Quiz Signals
- Quiz type (name recall, object recognition, etc.)
- Difficulty level
- Correct/incorrect responses
- Response latency
- Hints used

### Caregiver Insights
- Tagged notes (e.g., "music helps in mornings")
- Positive/negative feedback
- Context information

### Context Data (Optional, Consented)
- Day of week
- Session time
- Recent sleep (if consented)
- Activity adherence

## Models Trained

### 1. Emotion & Stress Detection
- **Input**: Text entries, audio features
- **Output**: Valence/arousal, emotion classes (calm/joy/sad/anxious)
- **Use**: Tailor prompts and timing

### 2. Memory Quiz Personalization
- **Input**: Quiz performance history
- **Output**: Recommended quiz type and difficulty
- **Use**: Maintain success, reduce frustration

### 3. Activity Recommendation (Bandit/RL)
- **Input**: Interaction patterns, mood, context
- **Output**: Next best activity (photo review, music, memory game, etc.)
- **Use**: Suggest helpful activities based on state

### 4. Mood Forecasting (7-day)
- **Input**: Historical mood patterns, context
- **Output**: 7-day mood forecast
- **Use**: Prep gentler routines, caregiver heads-up

### 5. Speech Change Indicators
- **Input**: Prosody trends over time
- **Output**: Rate/pause patterns
- **Use**: Supportive pacing, not diagnosis

### 6. Memory Embedding
- **Input**: User's memories (text only)
- **Output**: Embeddings for retrieval
- **Use**: Surface most comforting/meaningful memories first

## Training Strategy

### Foundation Model → Local Fine-Tuning

1. **Global Foundation Model**
   - Trained on public/neutral data
   - Emotion corpora for sentiment
   - Public prosody datasets
   - General activity recommendations

2. **Local Fine-Tuning (On-Device)**
   - Load foundation model weights
   - Continue training on local private data
   - Use LoRA (Low-Rank Adaptation) for efficiency
   - Never share raw data, only weight updates

3. **Federated Aggregation**
   - Clients send weight deltas (not raw data)
   - Apply differential privacy noise
   - Clip weights to prevent outliers
   - Aggregate using secure multi-party computation (simulated)

## Privacy & Security

### What's Protected

✅ **Raw audio/media never stored or transmitted**
✅ **No personally identifiable information (PII) in features**
✅ **Differential privacy applied to weight updates**
✅ **Secure aggregation (weighted averages, not raw data)**
✅ **On-device processing for all sensitive data**

### Consent Tiers

1. **Local Training**: Fine-tune on device (default: opt-in)
2. **Share Aggregates**: Contribute to federated learning (default: opt-in)
3. **Caregiver View**: Share insights with caregivers (default: opt-in)
4. **Collect Audio Features**: Extract prosody features (default: opt-in)
5. **Collect Context**: Include time/sleep/context (default: opt-in)

### Safety Guardrails

1. **Crisis Language Detection**
   - Identifies crisis keywords
   - Shows support resources
   - Never auto-escalates without explicit flows

2. **Mood Drop Detection**
   - Monitors significant mood changes
   - Flags for attention (caregiver notification if consented)
   - Prepares gentler intervention suggestions

3. **Explainable AI**
   - All recommendations include reasons
   - "Music helped last Tuesday mornings"
   - Transparency in suggestions

## Integration Points

### Mood Tracker (`app/journal/page.tsx`)
- Collects text entries and speech transcripts
- Calls ML service for emotion prediction
- Triggers safety checks for crisis language
- Stores training data locally

### Quiz System (`app/quizzes/page.tsx`)
- Collects quiz signals (type, difficulty, performance)
- Sends signals to ML service
- Uses recommendations for next quiz selection

### Settings (`app/settings/page.tsx`)
- ML consent management
- Enable/disable features
- View training statistics

## Usage Example

```typescript
// Initialize ML Service
const mlService = new MLService(userId, consentSettings);

// Collect from mood entry
const safetyFlags = mlService.collectFromMoodEntry(journalEntry, isSpeech);

// Collect quiz signal
mlService.collectQuizSignal(quizType, correct, latency, hintsUsed, difficulty);

// Predict emotion
const prediction = mlService.predictEmotion(text);

// Recommend activity
const recommendation = mlService.recommendActivity(context);

// Fine-tune locally
const weights = await mlService.fineTuneLocal({
  learningRate: 0.001,
  batchSize: 32,
  epochs: 10,
  useLocalData: true,
  differentialPrivacy: {
    enabled: true,
    noiseScale: 0.1,
    clipNorm: 1.0,
  },
});

// Prepare federated update (if consented)
const update = mlService.prepareFederatedUpdate(round, config);
```

## What NOT to Train On

❌ Raw photos of private life (only use captions/metadata)
❌ Raw audio recordings (only prosody features)
❌ Sensitive identifiers (addresses, diagnoses)
❌ Clinician-style "diagnosis" models (keep supportive, not medical)

## Implementation Status

### ✅ Completed
- Data collection service
- Local trainer infrastructure
- Federated learning coordinator
- Privacy guardrails
- ML service integration
- Mood tracker integration

### 🚧 In Progress
- Settings page for ML consent
- Quiz signal collection integration
- Activity recommendation UI
- Foundation model weight loading

### 📋 Future Work
- Actual TensorFlow.js model training
- Secure multi-party computation
- Web Audio API for prosody extraction
- Real-time model inference
- Federated server infrastructure

## Ethical Considerations

1. **Transparency**: All ML features clearly explained
2. **Consent**: Explicit opt-in for all data collection
3. **Control**: Users can disable features anytime
4. **Safety**: Crisis detection with appropriate resources
5. **Privacy**: On-device processing, differential privacy
6. **Explainability**: Reasons provided for all recommendations

## Resources

- Crisis Support: [Add your support resources here]
- Privacy Policy: [Link to privacy policy]
- Consent Settings: Settings → ML & Privacy

