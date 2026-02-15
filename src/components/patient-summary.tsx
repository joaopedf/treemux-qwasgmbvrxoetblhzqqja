'use client';

import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useTriageStore } from '@/lib/store';

export function PatientSummary() {
  const { currentSession, isAnalyzing, sessions } = useTriageStore();

  if (!currentSession && sessions.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No assessment yet</p>
        <p className="text-sm mt-1">Record or type patient information to begin</p>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-5/6" />
        <div className="h-4 bg-muted rounded w-4/6" />
        <div className="mt-6 space-y-2">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-full" />
        </div>
      </div>
    );
  }

  const latestSession = sessions[sessions.length - 1];

  if (!latestSession) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Waiting for analysis...</p>
      </div>
    );
  }

  const urgencyConfig = {
    immediate: {
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200',
      badge: 'destructive' as const,
      text: 'Immediate attention required',
    },
    urgent: {
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 border-orange-200',
      badge: 'default' as const,
      text: 'Urgent - prioritize care',
    },
    'non-urgent': {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200',
      badge: 'secondary' as const,
      text: 'Non-urgent - routine care',
    },
  };

  const config = urgencyConfig[latestSession.urgency];
  const Icon = config.icon;

  return (
    <div className="space-y-4">
      {/* Urgency Alert */}
      <Alert className={`${config.bgColor} border-2`}>
        <Icon className={`h-5 w-5 ${config.color}`} />
        <AlertDescription className="font-semibold">
          <Badge variant={config.badge} className="mb-1">
            {latestSession.urgency.toUpperCase()}
          </Badge>
          <div className="mt-1">{config.text}</div>
        </AlertDescription>
      </Alert>

      {/* Chief Complaint */}
      <div>
        <h3 className="font-semibold text-sm mb-2 text-muted-foreground">Chief Complaint</h3>
        <p className="text-sm bg-muted p-3 rounded-lg">{latestSession.chiefComplaint}</p>
      </div>

      {/* Summary */}
      <div>
        <h3 className="font-semibold text-sm mb-2 text-muted-foreground">Clinical Summary</h3>
        <p className="text-sm leading-relaxed">{latestSession.summary}</p>
      </div>

      {/* Symptoms */}
      {latestSession.symptoms && latestSession.symptoms.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm mb-2 text-muted-foreground">Key Symptoms</h3>
          <div className="flex flex-wrap gap-2">
            {latestSession.symptoms.map((symptom, idx) => (
              <Badge key={idx} variant="outline">
                {symptom}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {latestSession.recommendations && latestSession.recommendations.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm mb-2 text-muted-foreground">Recommendations</h3>
          <ul className="space-y-2">
            {latestSession.recommendations.map((rec, idx) => (
              <li key={idx} className="text-sm flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Timestamp */}
      <div className="text-xs text-muted-foreground pt-2 border-t">
        Assessment completed: {new Date(latestSession.timestamp).toLocaleString()}
      </div>
    </div>
  );
}
