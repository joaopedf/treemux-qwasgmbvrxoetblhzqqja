'use client';

import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Clock, AlertCircle, Heart, Thermometer, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface EnhancedPatientSummaryProps {
  session: {
    id: string;
    timestamp: string;
    chiefComplaint: string;
    symptoms: string[];
    urgency: 'immediate' | 'urgent' | 'non-urgent';
    summary: string;
    recommendations: string[];
    differentialDiagnosis?: string[];
    vitalSignsConcerns?: string[];
  };
}

export function EnhancedPatientSummary({ session }: EnhancedPatientSummaryProps) {
  const urgencyConfig = {
    immediate: {
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200',
      badge: 'destructive' as const,
      text: 'IMMEDIATE - Life-threatening',
      description: 'Requires immediate intervention',
    },
    urgent: {
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 border-orange-200',
      badge: 'default' as const,
      text: 'URGENT - Prioritize',
      description: 'Needs prompt care within 1-2 hours',
    },
    'non-urgent': {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200',
      badge: 'secondary' as const,
      text: 'NON-URGENT - Stable',
      description: 'Routine care appropriate',
    },
  };

  const config = urgencyConfig[session.urgency];
  const Icon = config.icon;

  return (
    <div className="space-y-4">
      {/* Urgency Alert */}
      <Alert className={`${config.bgColor} border-2`}>
        <Icon className={`h-5 w-5 ${config.color}`} />
        <AlertDescription>
          <div className="font-bold text-lg mb-1">{config.text}</div>
          <div className="text-sm">{config.description}</div>
        </AlertDescription>
      </Alert>

      {/* Chief Complaint */}
      <Card>
        <CardContent className="pt-4">
          <h3 className="font-semibold text-sm mb-2 text-muted-foreground">Chief Complaint</h3>
          <p className="text-sm">{session.chiefComplaint}</p>
        </CardContent>
      </Card>

      {/* Clinical Summary */}
      <Card>
        <CardContent className="pt-4">
          <h3 className="font-semibold text-sm mb-2 text-muted-foreground">Clinical Summary</h3>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{session.summary}</p>
        </CardContent>
      </Card>

      {/* Symptoms */}
      {session.symptoms && session.symptoms.length > 0 && (
        <Card>
          <CardContent className="pt-4">
            <h3 className="font-semibold text-sm mb-3 text-muted-foreground">Key Symptoms</h3>
            <div className="flex flex-wrap gap-2">
              {session.symptoms.map((symptom, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {symptom}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vital Signs Concerns */}
      {session.vitalSignsConcerns && session.vitalSignsConcerns.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2 text-blue-900">
              <Activity className="w-4 h-4" />
              Vital Signs to Monitor
            </h3>
            <ul className="space-y-1.5">
              {session.vitalSignsConcerns.map((vital, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2 text-blue-900">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>{vital}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {session.recommendations && session.recommendations.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <h3 className="font-semibold text-sm mb-2 text-green-900">Immediate Actions</h3>
            <ol className="space-y-2">
              {session.recommendations.map((rec, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2 text-green-900">
                  <span className="font-semibold text-green-600 mt-0.5 min-w-[1.25rem]">{idx + 1}.</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Differential Diagnosis */}
      {session.differentialDiagnosis && session.differentialDiagnosis.length > 0 && (
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="pt-4">
            <h3 className="font-semibold text-sm mb-2 text-purple-900">Differential Diagnosis</h3>
            <p className="text-xs text-purple-700 mb-3">Consider these conditions based on presentation:</p>
            <div className="space-y-1.5">
              {session.differentialDiagnosis.map((dx, idx) => (
                <div key={idx} className="text-sm flex items-start gap-2 text-purple-900">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span>{dx}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timestamp */}
      <div className="text-xs text-muted-foreground pt-2 border-t flex items-center justify-between">
        <span>Assessment ID: {session.id.slice(0, 8).toUpperCase()}</span>
        <span>{new Date(session.timestamp).toLocaleString()}</span>
      </div>
    </div>
  );
}
