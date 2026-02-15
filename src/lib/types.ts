export interface TranscriptSegment {
  id: string;
  text: string;
  timestamp: number;
  speaker?: string;
}

export interface ActionItem {
  id: string;
  task: string;
  assignee?: string;
  dueDate?: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export interface Decision {
  id: string;
  decision: string;
  context: string;
  timestamp: number;
}

export interface MeetingSummary {
  title: string;
  duration: number;
  participants: string[];
  keyPoints: string[];
  actionItems: ActionItem[];
  decisions: Decision[];
  nextSteps: string[];
}

export interface AnalysisResult {
  actionItems: ActionItem[];
  decisions: Decision[];
  keyPoints: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
}
