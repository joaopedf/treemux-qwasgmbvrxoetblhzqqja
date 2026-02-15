'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useMeetingStore } from '@/hooks/useMeetingStore';
import { Lightbulb, Scale, TrendingUp } from 'lucide-react';

export function InsightsPanel() {
  const { decisions, keyPoints, sentiment, isAnalyzing } = useMeetingStore();

  if (isAnalyzing) {
    return (
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Meeting Insights</h3>
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Analyzing insights...</p>
          </div>
        </div>
      </Card>
    );
  }

  const hasContent = decisions.length > 0 || keyPoints.length > 0;

  if (!hasContent) {
    return (
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Meeting Insights</h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Lightbulb className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            No insights yet. Complete a recording to see key decisions and points.
          </p>
        </div>
      </Card>
    );
  }

  const getSentimentBadge = () => {
    if (!sentiment) return null;
    const variants: Record<string, 'default' | 'destructive' | 'secondary'> = {
      positive: 'default',
      neutral: 'secondary',
      negative: 'destructive',
    };
    return (
      <Badge variant={variants[sentiment]} className="capitalize">
        {sentiment} Sentiment
      </Badge>
    );
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Meeting Insights</h3>
        {getSentimentBadge()}
      </div>

      <div className="space-y-6">
        {/* Key Points */}
        {keyPoints.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-semibold">Key Points</h4>
              <Badge variant="outline" className="text-xs">
                {keyPoints.length}
              </Badge>
            </div>
            <ul className="space-y-2">
              {keyPoints.map((point, idx) => (
                <li
                  key={idx}
                  className="text-sm p-3 rounded-lg bg-muted/50 border border-border"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {keyPoints.length > 0 && decisions.length > 0 && <Separator />}

        {/* Decisions */}
        {decisions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Scale className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-semibold">Decisions Made</h4>
              <Badge variant="outline" className="text-xs">
                {decisions.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {decisions.map((decision) => (
                <div
                  key={decision.id}
                  className="p-4 rounded-lg bg-primary/5 border border-primary/20"
                >
                  <p className="text-sm font-medium mb-1">{decision.decision}</p>
                  <p className="text-xs text-muted-foreground">{decision.context}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
