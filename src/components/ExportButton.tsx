'use client';

import { Button } from '@/components/ui/button';
import { useMeetingStore } from '@/hooks/useMeetingStore';
import { Download } from 'lucide-react';

export function ExportButton() {
  const { transcript, actionItems, decisions, keyPoints, sentiment } = useMeetingStore();

  const handleExport = () => {
    const summary = {
      timestamp: new Date().toISOString(),
      transcript: transcript.map(s => ({
        text: s.text,
        time: new Date(s.timestamp).toLocaleTimeString(),
      })),
      actionItems: actionItems.map(item => ({
        task: item.task,
        assignee: item.assignee,
        priority: item.priority,
        dueDate: item.dueDate,
        completed: item.completed,
      })),
      decisions,
      keyPoints,
      sentiment,
    };

    const blob = new Blob([JSON.stringify(summary, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-summary-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const hasData = transcript.length > 0 || actionItems.length > 0;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={!hasData}
    >
      <Download className="h-4 w-4 mr-2" />
      Export Summary
    </Button>
  );
}
