'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText } from 'lucide-react';

interface RealTimeTranscriptProps {
  transcript: string;
  isRecording: boolean;
}

export function RealTimeTranscript({ transcript, isRecording }: RealTimeTranscriptProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Live Transcript
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
          {transcript ? (
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{transcript}</p>
          ) : (
            <p className="text-sm text-gray-400 italic">
              {isRecording
                ? 'Listening... transcript will appear here'
                : 'No transcript available. Start recording or upload an audio file.'}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
