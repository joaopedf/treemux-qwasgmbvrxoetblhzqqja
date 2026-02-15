'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { demoCases } from '@/lib/demo-cases';
import { useTriageStore } from '@/lib/store';

export function DemoExamples() {
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const { addSession } = useTriageStore();

  const handleRunDemo = async (caseId: string) => {
    const demoCase = demoCases.find(c => c.id === caseId);
    if (!demoCase) return;

    setAnalyzing(caseId);

    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: demoCase.input }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();

      const session = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        chiefComplaint: demoCase.input,
        symptoms: data.symptoms || [],
        urgency: data.urgency,
        summary: data.summary,
        recommendations: data.recommendations || [],
        differentialDiagnosis: data.differentialDiagnosis,
        vitalSignsConcerns: data.vitalSignsConcerns,
      };

      addSession(session);
    } catch (error) {
      console.error('Demo analysis error:', error);
      alert('Failed to analyze demo case. Please try again.');
    } finally {
      setAnalyzing(null);
    }
  };

  const urgencyIcons = {
    immediate: AlertTriangle,
    urgent: Clock,
    'non-urgent': CheckCircle,
  };

  const urgencyColors = {
    immediate: 'text-red-600',
    urgent: 'text-orange-600',
    'non-urgent': 'text-green-600',
  };

  return (
    <div className="grid gap-3">
      {demoCases.map((demoCase) => {
        const Icon = urgencyIcons[demoCase.expectedUrgency];
        const isAnalyzing = analyzing === demoCase.id;

        return (
          <Card key={demoCase.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${urgencyColors[demoCase.expectedUrgency]}`} />
                    <h3 className="font-semibold truncate">{demoCase.name}</h3>
                    <Badge
                      variant="outline"
                      className={`text-xs ${urgencyColors[demoCase.expectedUrgency]}`}
                    >
                      {demoCase.expectedUrgency}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{demoCase.description}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{demoCase.input}</p>
                </div>
                <Button
                  onClick={() => handleRunDemo(demoCase.id)}
                  disabled={isAnalyzing || analyzing !== null}
                  size="sm"
                  className="flex-shrink-0"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      Analyzing
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-1" />
                      Try
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
