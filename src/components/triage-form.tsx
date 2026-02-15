'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mic, Square, Loader2, Send } from 'lucide-react';
import { useTriageStore } from '@/lib/store';

export function TriageForm() {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const { setCurrentSession, setAnalyzing, addSession, isAnalyzing } = useTriageStore();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsTranscribing(true);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Transcription failed');

      const data = await response.json();
      setInput(prev => prev ? `${prev}\n${data.text}` : data.text);
    } catch (error) {
      console.error('Transcription error:', error);
      alert('Failed to transcribe audio. Please try typing instead.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() || isAnalyzing) return;

    setAnalyzing(true);
    setCurrentSession({ chiefComplaint: input });

    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();

      const session = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        chiefComplaint: input,
        symptoms: data.symptoms || [],
        urgency: data.urgency,
        summary: data.summary,
        recommendations: data.recommendations || [],
      };

      addSession(session);
      setInput('');
    } catch (error) {
      console.error('Triage analysis error:', error);
      alert('Failed to analyze patient data. Please try again.');
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Chief Complaint & Symptoms</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe the patient's symptoms, complaints, and relevant medical history..."
          className="min-h-[200px] resize-none"
          disabled={isRecording || isAnalyzing}
        />
      </div>

      <div className="flex gap-2">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            disabled={isAnalyzing || isTranscribing}
            variant="outline"
            className="flex-1"
          >
            {isTranscribing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Transcribing...
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Record
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            variant="destructive"
            className="flex-1"
          >
            <Square className="w-4 h-4 mr-2" />
            Stop Recording
          </Button>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!input.trim() || isAnalyzing || isRecording}
          className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Analyze
            </>
          )}
        </Button>
      </div>

      {isRecording && (
        <Badge variant="destructive" className="w-full justify-center py-2 animate-pulse">
          Recording in progress...
        </Badge>
      )}
    </div>
  );
}
