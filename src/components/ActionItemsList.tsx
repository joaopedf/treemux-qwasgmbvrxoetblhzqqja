'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useMeetingStore } from '@/hooks/useMeetingStore';
import { CheckCircle2, Circle } from 'lucide-react';

export function ActionItemsList() {
  const { actionItems, toggleActionItem, isAnalyzing } = useMeetingStore();

  if (isAnalyzing) {
    return (
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Action Items</h3>
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Analyzing meeting...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (actionItems.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Action Items</h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Circle className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            No action items yet. Complete a recording to see extracted tasks.
          </p>
        </div>
      </Card>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Action Items</h3>
        <Badge variant="outline">{actionItems.length}</Badge>
      </div>

      <div className="space-y-3">
        {actionItems.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-lg border transition-all ${
              item.completed
                ? 'bg-muted/30 border-muted line-through opacity-60'
                : 'bg-card border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggleActionItem(item.id)}
                className="mt-0.5 flex-shrink-0"
              >
                {item.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.task}</p>

                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge variant={getPriorityColor(item.priority)} className="text-xs">
                    {item.priority}
                  </Badge>

                  {item.assignee && (
                    <Badge variant="outline" className="text-xs">
                      {item.assignee}
                    </Badge>
                  )}

                  {item.dueDate && (
                    <Badge variant="outline" className="text-xs">
                      Due: {item.dueDate}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
