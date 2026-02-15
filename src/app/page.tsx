'use client';

import { RecordingControls } from '@/components/RecordingControls';
import { TranscriptView } from '@/components/TranscriptView';
import { ActionItemsList } from '@/components/ActionItemsList';
import { InsightsPanel } from '@/components/InsightsPanel';
import { Mic2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary text-primary-foreground">
              <Mic2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">VoiceThread</h1>
              <p className="text-sm text-muted-foreground">
                AI-Powered Meeting Intelligence
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <RecordingControls />
            <TranscriptView />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ActionItemsList />
            <InsightsPanel />
          </div>
        </div>

        {/* Feature Info */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="p-6 rounded-lg border bg-card text-card-foreground">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg">🎙️</span>
              </div>
              <h3 className="font-semibold">Real-Time Transcription</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Live audio transcription powered by OpenAI Whisper with streaming updates
            </p>
          </div>

          <div className="p-6 rounded-lg border bg-card text-card-foreground">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg">🤖</span>
              </div>
              <h3 className="font-semibold">Multi-Agent Analysis</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Specialized AI agents extract action items, decisions, and key insights
            </p>
          </div>

          <div className="p-6 rounded-lg border bg-card text-card-foreground">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg">✨</span>
              </div>
              <h3 className="font-semibold">Intelligent Summaries</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Automatic sentiment analysis and actionable meeting summaries
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Built for TreeHacks 2026 • Powered by OpenAI & Next.js
          </p>
        </div>
      </footer>
    </div>
  );
}
