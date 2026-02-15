'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Upload, Play } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface VoiceRecorderProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
  onTranscriptUpdate: (transcript: string) => void;
  onInsightsUpdate: (insights: any) => void;
}

export function VoiceRecorder({
  isRecording,
  onStart,
  onStop,
  onTranscriptUpdate,
  onInsightsUpdate
}: VoiceRecorderProps) {
  const [audioLevel, setAudioLevel] = useState(0);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [selectedDemo, setSelectedDemo] = useState<string>('');
  const [demoScenarios, setDemoScenarios] = useState<any[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    fetch('/api/demo')
      .then(res => res.json())
      .then(data => setDemoScenarios(data.scenarios))
      .catch(err => console.error('Failed to load demo scenarios:', err));

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      const updateAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(Math.min(100, (average / 128) * 100));
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };
      updateAudioLevel();

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(1000);
      onStart();
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setAudioLevel(0);
    onStop();
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      setProcessingStatus('Transcribing audio...');

      const formData = new FormData();
      formData.append('audio', audioBlob);

      const transcriptResponse = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      });

      if (!transcriptResponse.ok) {
        throw new Error('Transcription failed');
      }

      const { transcript } = await transcriptResponse.json();
      onTranscriptUpdate(transcript);

      setProcessingStatus('Analyzing clinical data with multi-agent system...');

      const analysisResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript })
      });

      if (!analysisResponse.ok) {
        throw new Error('Analysis failed');
      }

      const insights = await analysisResponse.json();
      onInsightsUpdate(insights);

      setProcessingStatus('');
    } catch (error) {
      console.error('Error processing audio:', error);
      setProcessingStatus('Error processing audio. Please try again.');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProcessingStatus('Processing uploaded file...');
      await processAudio(file);
    }
  };

  const runDemo = async () => {
    if (!selectedDemo) {
      alert('Please select a demo scenario first');
      return;
    }

    onStart();
    setProcessingStatus('Running demo scenario...');

    try {
      const response = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId: selectedDemo })
      });

      if (!response.ok) {
        throw new Error('Demo failed');
      }

      const { transcript, insights } = await response.json();

      onTranscriptUpdate(transcript);

      setTimeout(() => {
        onInsightsUpdate(insights);
        setProcessingStatus('');
        onStop();
      }, 1000);
    } catch (error) {
      console.error('Demo error:', error);
      setProcessingStatus('Demo failed. Please try again.');
      onStop();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {!isRecording ? (
            <>
              <Button
                onClick={startRecording}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Mic className="w-5 h-5 mr-2" />
                Start Recording
              </Button>
              <div className="relative">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="audio-upload"
                />
                <Button
                  onClick={() => document.getElementById('audio-upload')?.click()}
                  variant="outline"
                  size="lg"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Audio
                </Button>
              </div>
            </>
          ) : (
            <Button
              onClick={stopRecording}
              size="lg"
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              <Square className="w-5 h-5 mr-2" />
              Stop Recording
            </Button>
          )}
        </div>

        <div className="w-full max-w-md">
          <div className="flex items-center gap-2">
            <Select value={selectedDemo} onValueChange={setSelectedDemo}>
              <SelectTrigger>
                <SelectValue placeholder="Try a demo scenario" />
              </SelectTrigger>
              <SelectContent>
                {demoScenarios.map((scenario) => (
                  <SelectItem key={scenario.id} value={scenario.id}>
                    {scenario.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={runDemo}
              disabled={!selectedDemo || isRecording}
              variant="secondary"
            >
              <Play className="w-4 h-4 mr-2" />
              Run Demo
            </Button>
          </div>
        </div>
      </div>

      {isRecording && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Audio Level</span>
            <span>{Math.round(audioLevel)}%</span>
          </div>
          <Progress value={audioLevel} className="h-2" />
        </div>
      )}

      {processingStatus && (
        <div className="text-center text-sm text-gray-600 animate-pulse">
          {processingStatus}
        </div>
      )}
    </div>
  );
}
