'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { AudioRecorder } from '@/lib/audio';
import { useMeetingStore } from '@/hooks/useMeetingStore';

export function RecordingControls() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const audioQueueRef = useRef<Blob[]>([]);
  const processingRef = useRef(false);

  const {
    isRecording,
    setIsRecording,
    addTranscript,
    setIsAnalyzing,
    setAnalysisResults,
    reset,
    startTime,
    setStartTime,
  } = useMeetingStore();

  useEffect(() => {
    audioRecorderRef.current = new AudioRecorder();
    return () => {
      if (audioRecorderRef.current?.isRecording()) {
        audioRecorderRef.current.stopRecording();
      }
    };
  }, []);

  const processAudioQueue = async () => {
    if (processingRef.current || audioQueueRef.current.length === 0) {
      return;
    }

    processingRef.current = true;
    const audioBlob = audioQueueRef.current.shift();

    if (audioBlob) {
      try {
        const formData = new FormData();
        formData.append('audio', audioBlob);

        const response = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          if (data.text && data.text.trim()) {
            addTranscript({
              id: `segment-${Date.now()}`,
              text: data.text,
              timestamp: Date.now(),
            });
          }
        }
      } catch (err) {
        console.error('Transcription error:', err);
      }
    }

    processingRef.current = false;

    // Process next item if available
    if (audioQueueRef.current.length > 0) {
      setTimeout(processAudioQueue, 100);
    }
  };

  const handleStartRecording = async () => {
    setError(null);
    reset();

    const success = await audioRecorderRef.current?.startRecording((blob) => {
      audioQueueRef.current.push(blob);
      processAudioQueue();
    });

    if (success) {
      setIsRecording(true);
      setStartTime(Date.now());
    } else {
      setError('Failed to start recording. Please check microphone permissions.');
    }
  };

  const handleStopRecording = async () => {
    audioRecorderRef.current?.stopRecording();
    setIsRecording(false);
    setStartTime(null);
    setIsProcessing(true);

    // Wait for remaining audio to process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Get full transcript for analysis
    const transcript = useMeetingStore.getState().transcript;
    const fullText = transcript.map((s) => s.text).join(' ');

    if (fullText.trim()) {
      setIsAnalyzing(true);
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript: fullText }),
        });

        if (response.ok) {
          const results = await response.json();
          setAnalysisResults(results);
        }
      } catch (err) {
        console.error('Analysis error:', err);
      } finally {
        setIsAnalyzing(false);
      }
    }

    setIsProcessing(false);
  };

  const formatDuration = () => {
    if (!startTime) return '00:00';
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!isRecording || !startTime) return;
    const interval = setInterval(() => {
      // Force re-render for duration display
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording, startTime]);

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-4">
          <Button
            size="lg"
            variant={isRecording ? 'destructive' : 'default'}
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            disabled={isProcessing}
            className="h-16 w-16 rounded-full"
          >
            {isProcessing ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : isRecording ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>

          <div className="flex flex-col gap-2">
            <Badge variant={isRecording ? 'destructive' : 'secondary'} className="text-sm">
              {isRecording ? 'Recording' : 'Ready'}
            </Badge>
            {isRecording && startTime && (
              <span className="text-sm font-mono text-muted-foreground">
                {formatDuration()}
              </span>
            )}
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        <p className="text-sm text-muted-foreground text-center max-w-md">
          {isRecording
            ? 'Click the button to stop recording and analyze the meeting'
            : 'Click the button to start recording your meeting'}
        </p>
      </div>
    </Card>
  );
}
