'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Pill,
  Calendar,
  Activity,
  Brain
} from 'lucide-react';

interface ClinicalInsightsProps {
  insights: any;
  isProcessing: boolean;
}

export function ClinicalInsights({ insights, isProcessing }: ClinicalInsightsProps) {
  if (!insights && !isProcessing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Clinical Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400 italic">
            No insights yet. Process a call to see AI-powered clinical analysis.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isProcessing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 animate-pulse" />
            Analyzing...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const { flags, medications, appointments, summary, sentiment, urgency } = insights;

  return (
    <div className="space-y-4">
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Clinical Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {urgency && (
            <div>
              <Badge variant={urgency === 'high' ? 'destructive' : urgency === 'medium' ? 'default' : 'secondary'}>
                {urgency.toUpperCase()} URGENCY
              </Badge>
            </div>
          )}

          {summary && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Summary</h4>
              <p className="text-sm text-gray-700">{summary}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {flags && flags.length > 0 && (
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Safety Flags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {flags.map((flag: any, index: number) => (
              <Alert key={index} variant="destructive">
                <AlertDescription className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">{flag.type}</p>
                    <p className="text-sm">{flag.description}</p>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {medications && medications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5" />
              Medications Mentioned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {medications.map((med: any, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{med.name}</p>
                    {med.dosage && <p className="text-gray-600">{med.dosage}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {appointments && appointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Scheduling Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {appointments.map((apt: any, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{apt.type}</p>
                    <p className="text-gray-600">{apt.note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
