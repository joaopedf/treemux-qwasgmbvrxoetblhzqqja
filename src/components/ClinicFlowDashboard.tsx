'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Phone,
  Mic,
  MicOff,
  AlertTriangle,
  Clock,
  Activity
} from 'lucide-react';
import { VoiceRecorder } from './VoiceRecorder';
import { ClinicalInsights } from './ClinicalInsights';
import { CallHistory } from './CallHistory';
import { RealTimeTranscript } from './RealTimeTranscript';

interface CallData {
  id: string;
  timestamp: Date;
  duration: string;
  patientName: string;
  status: 'completed' | 'flagged' | 'processing';
  summary: string;
  flags: string[];
}

export function ClinicFlowDashboard() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentCall, setCurrentCall] = useState<CallData | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [insights, setInsights] = useState<any>(null);

  const handleStartRecording = () => {
    setIsRecording(true);
    setCurrentCall({
      id: Date.now().toString(),
      timestamp: new Date(),
      duration: '0:00',
      patientName: 'Listening...',
      status: 'processing',
      summary: '',
      flags: []
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const stats = [
    {
      title: 'Calls Today',
      value: '24',
      change: '+12%',
      icon: Phone,
      color: 'text-blue-600'
    },
    {
      title: 'Critical Flags',
      value: '3',
      change: '-25%',
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      title: 'Avg Response Time',
      value: '2.3s',
      change: '-15%',
      icon: Clock,
      color: 'text-green-600'
    },
    {
      title: 'Accuracy Rate',
      value: '98.7%',
      change: '+2%',
      icon: Activity,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ClinicFlow AI
          </h1>
          <p className="text-gray-600 mt-2">Real-time clinical call intelligence</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              System Active
            </div>
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change} from yesterday</p>
                  </div>
                  <Icon className={`w-10 h-10 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isRecording ? <Mic className="w-5 h-5 text-red-500 animate-pulse" /> : <MicOff className="w-5 h-5" />}
                Live Call Monitor
              </CardTitle>
              <CardDescription>
                {isRecording ? 'Recording and analyzing in real-time...' : 'Start a call to begin monitoring'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VoiceRecorder
                isRecording={isRecording}
                onStart={handleStartRecording}
                onStop={handleStopRecording}
                onTranscriptUpdate={setTranscript}
                onInsightsUpdate={setInsights}
              />
            </CardContent>
          </Card>

          <RealTimeTranscript
            transcript={transcript}
            isRecording={isRecording}
          />

          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="history">Call History</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="history">
              <CallHistory />
            </TabsContent>
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Detailed analytics and trends coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <ClinicalInsights insights={insights} isProcessing={isRecording} />
        </div>
      </div>
    </div>
  );
}
