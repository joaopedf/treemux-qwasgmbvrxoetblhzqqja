# VoiceThread

AI-powered real-time meeting intelligence that transcribes, analyzes, and takes action on meeting conversations.

## Features

- **Real-Time Transcription**: Live audio transcription powered by OpenAI Whisper
- **Multi-Agent Analysis**: Specialized AI agents that extract action items, decisions, and key insights
- **Intelligent Summaries**: Automatic sentiment analysis and actionable meeting summaries
- **Interactive Dashboard**: Clean, intuitive UI for viewing transcripts and managing action items

## Tech Stack

- **Frontend**: Next.js 16 with React 19, Tailwind CSS v4, shadcn/ui
- **AI/ML**: OpenAI GPT-4 & Whisper
- **Runtime**: Bun
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Bun installed
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Add your OpenAI API key to `.env.local`

4. Run the development server:
   ```bash
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## How It Works

1. **Record**: Click the microphone button to start recording
2. **Transcribe**: Audio processed in real-time using OpenAI Whisper
3. **Analyze**: Multi-agent system extracts action items, decisions, and key insights
4. **Act**: Review and manage extracted action items

## TreeHacks 2026

Targeting: Greylock Multi-turn Agent, OpenAI AI Track, Zoom Education Track

## License

MIT
