'use client';

import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMeetingStore } from '@/hooks/useMeetingStore';
import { MessageSquare } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function TranscriptView() {
  const { transcript, isRecording } = useMeetingStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  if (transcript.length === 0) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground" />
          <div>
            <h3 className="font-semibold">No transcript yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Start recording to see the live transcript
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Live Transcript</h3>
        {isRecording && (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">Recording</span>
          </div>
        )}
      </div>

      <ScrollArea className="h-[400px] pr-4" ref={scrollRef}>
        <div className="space-y-4">
          {transcript.map((segment) => (
            <div
              key={segment.id}
              className="p-3 rounded-lg bg-muted/50 border border-border"
            >
              <p className="text-sm">{segment.text}</p>
              <span className="text-xs text-muted-foreground mt-2 block">
                {new Date(segment.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
