'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ThreatEvent } from '@/lib/agents';
import { generateMockSensorFeed, generateInitialEvents } from '@/lib/mockSensors';

interface Assessment {
  eventId: string;
  threatLevel: string;
  confidence: number;
  reasoning: string;
  recommendedActions: string[];
}

interface ResponsePlan {
  priority: number;
  responseTeam: string[];
  actions: Array<{ action: string; assignedTo: string; deadline: string }>;
  escalation: boolean;
  reasoning: string;
}

export default function Home() {
  const [events, setEvents] = useState<ThreatEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ThreatEvent | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [responsePlan, setResponsePlan] = useState<ResponsePlan | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [sitrep, setSitrep] = useState<string>('');

  useEffect(() => {
    // Initialize with some events
    setEvents(generateInitialEvents(8));

    // Simulate real-time sensor feed
    const interval = setInterval(() => {
      const newEvents = generateMockSensorFeed();
      setEvents(prev => [...newEvents, ...prev].slice(0, 50));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const analyzeEvent = async (event: ThreatEvent) => {
    setSelectedEvent(event);
    setAnalyzing(true);
    setAssessment(null);
    setResponsePlan(null);

    try {
      const response = await fetch('/api/threats/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event,
          relatedEvents: events.slice(0, 5).filter(e => e.id !== event.id),
        }),
      });

      const data = await response.json();
      setAssessment(data.assessment);
      setResponsePlan(data.response);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatMessage.trim()) return;

    const userMessage = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context: {
            events: events.slice(0, 10),
            assessments: assessment ? [assessment] : [],
            history: chatHistory,
          },
        }),
      });

      const data = await response.json();
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Chat failed:', error);
    }
  };

  const generateSitrepReport = async () => {
    try {
      const response = await fetch('/api/sitrep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events: events.slice(0, 10),
          assessments: assessment ? [assessment] : [],
          responses: responsePlan ? [responsePlan] : [],
        }),
      });

      const data = await response.json();
      setSitrep(data.sitrep);
    } catch (error) {
      console.error('SITREP generation failed:', error);
    }
  };

  const severityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case 'motion': return '🏃';
      case 'audio': return '🔊';
      case 'network': return '🌐';
      case 'perimeter': return '🛡️';
      case 'access': return '🔐';
      default: return '⚠️';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto p-6 max-w-7xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            🛡️ Sentinel AI
          </h1>
          <p className="text-slate-400 text-lg">
            AI-Native Defense Operations Platform
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Threat Feed */}
          <Card className="lg:col-span-1 bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Live Threat Feed
              </CardTitle>
              <CardDescription className="text-slate-400">
                Real-time sensor events
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[600px] overflow-y-auto space-y-2">
              {events.map(event => (
                <div
                  key={event.id}
                  onClick={() => analyzeEvent(event)}
                  className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{typeIcon(event.type)}</span>
                      <Badge className={`${severityColor(event.severity)} text-white text-xs`}>
                        {event.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-white font-medium mb-1">{event.location}</p>
                  <p className="text-xs text-slate-400">{event.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Analysis & Response */}
          <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Multi-Agent Analysis</CardTitle>
              <CardDescription className="text-slate-400">
                AI-powered threat assessment and response coordination
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="assessment" className="w-full">
                <TabsList className="bg-slate-800 border-slate-700">
                  <TabsTrigger value="assessment">Threat Assessment</TabsTrigger>
                  <TabsTrigger value="response">Response Plan</TabsTrigger>
                  <TabsTrigger value="chat">Operator Chat</TabsTrigger>
                  <TabsTrigger value="sitrep">SITREP</TabsTrigger>
                </TabsList>

                <TabsContent value="assessment" className="space-y-4">
                  {!selectedEvent && (
                    <Alert className="bg-slate-800/50 border-slate-700">
                      <AlertTitle className="text-white">No Event Selected</AlertTitle>
                      <AlertDescription className="text-slate-400">
                        Click on a threat event to analyze
                      </AlertDescription>
                    </Alert>
                  )}

                  {analyzing && (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-400">Analyzing threat...</p>
                      <Progress value={66} className="bg-slate-800" />
                    </div>
                  )}

                  {selectedEvent && !analyzing && assessment && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                        <h3 className="text-white font-semibold mb-2">Event Details</h3>
                        <p className="text-sm text-slate-400 mb-1">
                          <span className="text-slate-500">ID:</span> {selectedEvent.id}
                        </p>
                        <p className="text-sm text-slate-400 mb-1">
                          <span className="text-slate-500">Location:</span> {selectedEvent.location}
                        </p>
                        <p className="text-sm text-slate-400">
                          <span className="text-slate-500">Type:</span> {selectedEvent.type}
                        </p>
                      </div>

                      <Separator className="bg-slate-700" />

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-white font-semibold">AI Assessment</h3>
                          <Badge className={`${severityColor(assessment.threatLevel)} text-white`}>
                            {assessment.threatLevel.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400">
                          Confidence: <span className="text-white font-medium">{assessment.confidence}%</span>
                        </p>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {assessment.reasoning}
                        </p>
                      </div>

                      <Separator className="bg-slate-700" />

                      <div>
                        <h3 className="text-white font-semibold mb-2">Recommended Actions</h3>
                        <ul className="space-y-2">
                          {assessment.recommendedActions.map((action, i) => (
                            <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                              <span className="text-green-500 mt-0.5">✓</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="response" className="space-y-4">
                  {responsePlan && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold">Response Priority</h3>
                        <Badge className="bg-purple-600 text-white">
                          Priority {responsePlan.priority}/10
                        </Badge>
                      </div>

                      {responsePlan.escalation && (
                        <Alert className="bg-red-900/20 border-red-800">
                          <AlertTitle className="text-red-400">⚠️ Escalation Required</AlertTitle>
                          <AlertDescription className="text-red-300">
                            This threat requires command-level attention
                          </AlertDescription>
                        </Alert>
                      )}

                      <div>
                        <h4 className="text-white font-medium mb-2">Response Team</h4>
                        <div className="flex flex-wrap gap-2">
                          {responsePlan.responseTeam.map((team, i) => (
                            <Badge key={i} variant="outline" className="bg-slate-800 text-slate-300 border-slate-600">
                              {team}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Separator className="bg-slate-700" />

                      <div>
                        <h4 className="text-white font-medium mb-3">Action Plan</h4>
                        <div className="space-y-3">
                          {responsePlan.actions.map((action, i) => (
                            <div key={i} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                              <p className="text-sm text-white font-medium mb-1">{action.action}</p>
                              <div className="flex items-center justify-between text-xs text-slate-400">
                                <span>Assigned: {action.assignedTo}</span>
                                <span>Due: {action.deadline}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator className="bg-slate-700" />

                      <div>
                        <h4 className="text-white font-medium mb-2">Strategic Reasoning</h4>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {responsePlan.reasoning}
                        </p>
                      </div>
                    </div>
                  )}

                  {!responsePlan && (
                    <Alert className="bg-slate-800/50 border-slate-700">
                      <AlertTitle className="text-white">No Response Plan</AlertTitle>
                      <AlertDescription className="text-slate-400">
                        Analyze a threat event to generate a response plan
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                <TabsContent value="chat" className="space-y-4">
                  <div className="h-[400px] overflow-y-auto space-y-3 p-4 bg-slate-800/30 rounded-lg">
                    {chatHistory.length === 0 && (
                      <p className="text-sm text-slate-500 text-center py-8">
                        Start a conversation with your AI operations assistant
                      </p>
                    )}
                    {chatHistory.map((msg, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg ${
                          msg.role === 'user'
                            ? 'bg-blue-900/30 border border-blue-800 ml-8'
                            : 'bg-slate-800/50 border border-slate-700 mr-8'
                        }`}
                      >
                        <p className="text-xs text-slate-500 mb-1">
                          {msg.role === 'user' ? 'You' : 'AI Assistant'}
                        </p>
                        <p className="text-sm text-slate-200">{msg.content}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                      placeholder="Ask about threats, status, or get recommendations..."
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                    <Button onClick={sendChatMessage} className="bg-blue-600 hover:bg-blue-700">
                      Send
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="sitrep" className="space-y-4">
                  <Button
                    onClick={generateSitrepReport}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Generate Executive SITREP
                  </Button>

                  {sitrep && (
                    <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                      <h3 className="text-white font-semibold mb-3">Situation Report</h3>
                      <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {sitrep}
                      </div>
                    </div>
                  )}

                  {!sitrep && (
                    <Alert className="bg-slate-800/50 border-slate-700">
                      <AlertTitle className="text-white">No SITREP Generated</AlertTitle>
                      <AlertDescription className="text-slate-400">
                        Click the button above to generate an executive situation report
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-6 bg-slate-900/50 border border-slate-800 rounded-lg">
          <h2 className="text-white font-semibold mb-3">About Sentinel AI</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Sentinel AI reimagines PagerDuty for physical security and defense operations. Our multi-agent system
            uses OpenAI GPT-4o to provide intelligent threat assessment, pattern correlation, and automated response
            coordination. Built for TreeHacks 2026 by a hardware engineer with defense industry experience.
          </p>
        </div>
      </div>
    </div>
  );
}
