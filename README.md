# ClinicFlow AI

Real-time voice AI system for clinical phone calls that extracts structured medical data, flags safety concerns, and automates care workflows.

## Features

- **Real-time Voice Processing**: Record or upload clinical phone calls for instant transcription
- **Multi-Agent AI System**: 5 specialized Claude agents work in parallel:
  - **Triage Agent**: Assesses urgency and safety concerns
  - **Clinical Extractor**: Extracts symptoms, medications, vitals, and history
  - **Safety Checker**: Identifies drug interactions and contraindications
  - **Action Coordinator**: Plans follow-ups, prescriptions, and referrals
  - **Summary Generator**: Creates clinical documentation summaries
- **Live Transcript**: Real-time display of conversation transcription
- **Clinical Insights Dashboard**: Structured medical data extraction with safety flags
- **Demo Mode**: Three pre-built scenarios to showcase capabilities

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **AI/ML**:
  - OpenAI Whisper (transcription)
  - Anthropic Claude Sonnet 3.5 (multi-agent analysis)
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- OpenAI API key
- Anthropic API key

### Installation

1. Clone the repository
```bash
git clone <repo-url>
cd clinicflow-ai
```

2. Install dependencies
```bash
bun install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:
```
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

4. Run the development server
```bash
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Usage

### Demo Mode
1. Select a demo scenario from the dropdown:
   - Routine Follow-up
   - Urgent Symptoms
   - Medication Concern
2. Click "Run Demo" to see the AI analysis in action

### Live Recording
1. Click "Start Recording" and allow microphone access
2. Have a conversation or play a clinical call recording
3. Click "Stop Recording" when done
4. View real-time transcript and AI-generated insights

### Upload Audio
1. Click "Upload Audio"
2. Select an audio file (supports common formats)
3. System will transcribe and analyze automatically

## Multi-Agent Architecture

The system uses a sophisticated multi-agent approach where 5 specialized Claude agents run in parallel:

```
Audio Input → Whisper Transcription → Multi-Agent Analysis
                                            ├─ Triage Agent (urgency)
                                            ├─ Clinical Extractor (data)
                                            ├─ Safety Checker (interactions)
                                            ├─ Action Coordinator (next steps)
                                            └─ Summary Generator (documentation)
                                                    ↓
                                            Consolidated Insights
```

## Prize Tracks

This project targets:
- **OpenEvidence Healthcare Track** ($4k + interviews)
- **Zingage Voice AI for Healthcare** (Airpods Max + fast-track interview)
- **Greylock Best Multi-turn Agent** (Warriors tickets + office hours)
- **OpenAI AI Track** (Guaranteed interview + ChatGPT Pro)
- **Most Impactful** (Addresses critical healthcare communication gaps)
- **Most Technically Complex** (Multi-agent orchestration + real-time processing)

## Impact

Healthcare runs on phone calls, but critical information gets lost, delayed, or mishandled. ClinicFlow AI:
- Reduces medical errors by flagging drug interactions and safety concerns
- Improves care coordination through automated action planning
- Saves clinician time with automated documentation
- Ensures no patient concern goes unnoticed

## License

MIT

## Built With

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Anthropic Claude](https://www.anthropic.com/)
- [OpenAI Whisper](https://openai.com/research/whisper)
