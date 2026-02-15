# TriageAI - AI-Powered Medical Triage Assistant

TriageAI is a real-time voice-enabled medical triage system designed to assist healthcare workers in under-resourced clinics conduct preliminary patient assessments, prioritize care, and make critical decisions when immediate physician access is limited.

## Problem

Healthcare workers in under-resourced clinics and rural areas face a critical challenge: they must quickly assess and prioritize patients with limited resources and often without immediate access to physicians. Misclassification of urgency can lead to delayed treatment for critical cases or inefficient use of already scarce resources.

## Solution

TriageAI provides an AI-powered assistant that:

- **Voice-enabled patient interviews** - Healthcare workers can record patient symptoms and complaints naturally
- **Intelligent triage classification** - AI analyzes symptoms and assigns urgency levels (Immediate, Urgent, Non-urgent)
- **Clinical decision support** - Generates structured summaries with differential diagnoses and actionable recommendations
- **Vital signs monitoring** - Identifies which vital signs should be tracked based on presentation
- **Historical tracking** - Maintains a log of all patient assessments for continuity of care

## Tech Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS, shadcn/ui
- **AI/ML**: Anthropic Claude (triage analysis), OpenAI Whisper (voice transcription)
- **State Management**: Zustand
- **Deployment**: Vercel

## Features

### 1. Voice Recording & Transcription
- Real-time voice recording using browser MediaRecorder API
- Automatic transcription using OpenAI Whisper
- Fallback text input for flexibility

### 2. AI-Powered Triage Analysis
- Structured clinical assessment using Claude 3.5 Sonnet
- Three-tier urgency classification with detailed criteria
- Symptom extraction and categorization
- Differential diagnosis suggestions

### 3. Healthcare Worker Dashboard
- Clean, intuitive interface optimized for clinical workflows
- Real-time assessment results
- Historical patient tracking with urgency-based filtering
- Quick stats for clinic management

### 4. Clinical Decision Support
- Prioritized action recommendations
- Vital signs monitoring guidance
- Warning signs and escalation criteria
- Resource-appropriate suggestions for limited settings

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Anthropic API key
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd triage-ai

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your API keys:
# ANTHROPIC_API_KEY=your_key_here
# OPENAI_API_KEY=your_key_here

# Run development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Build for Production

```bash
bun run build
bun start
```

## Usage

1. **Start a New Assessment**
   - Click "New Patient" tab
   - Either record patient symptoms using the microphone or type them in
   - Click "Analyze" to process

2. **Review Results**
   - View urgency classification (Immediate/Urgent/Non-urgent)
   - Read clinical summary and extracted symptoms
   - Follow prioritized action recommendations
   - Check differential diagnosis considerations

3. **Access History**
   - Click "History" tab to view all past assessments
   - Filter by urgency level
   - Track trends across your patient population

## API Routes

### `/api/triage` (POST)
Analyzes patient input and returns structured triage assessment.

**Request:**
```json
{
  "input": "Patient complaining of severe chest pain..."
}
```

**Response:**
```json
{
  "urgency": "immediate",
  "symptoms": ["chest pain", "shortness of breath"],
  "summary": "Patient presenting with concerning cardiac symptoms...",
  "recommendations": ["Immediate ECG", "Administer aspirin..."],
  "differentialDiagnosis": ["Acute myocardial infarction", "Pulmonary embolism"]
}
```

### `/api/transcribe` (POST)
Transcribes audio file to text using Whisper.

**Request:** FormData with audio file
**Response:**
```json
{
  "text": "Patient is complaining of..."
}
```

## Architecture

```
┌─────────────┐
│   Browser   │
│  (Voice UI) │
└──────┬──────┘
       │
       ├─ Voice Recording ──> /api/transcribe (Whisper)
       │                          │
       │                          ▼
       └─ Text Input ────────> /api/triage (Claude)
                                  │
                                  ▼
                            ┌──────────────┐
                            │  Structured  │
                            │   Response   │
                            └──────────────┘
                                  │
                                  ▼
                            ┌──────────────┐
                            │   Zustand    │
                            │    Store     │
                            └──────────────┘
```

## Impact

TriageAI is designed to:

- **Improve patient outcomes** by ensuring critical cases are identified quickly
- **Optimize resource utilization** in resource-constrained settings
- **Empower healthcare workers** with clinical decision support
- **Reduce physician burden** by handling preliminary assessments
- **Scale quality care** to underserved areas

## Future Enhancements

- Multi-language support for global deployment
- Offline mode for areas with limited connectivity
- Integration with electronic health records
- Predictive analytics for clinic resource planning
- Telemedicine integration for specialist consultation

## License

MIT

## Acknowledgments

Built for TreeHacks 2026 - Healthcare Track
