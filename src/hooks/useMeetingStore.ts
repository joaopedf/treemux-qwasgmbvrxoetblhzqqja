import { create } from 'zustand';
import { TranscriptSegment, ActionItem, Decision } from '@/lib/types';

interface MeetingState {
  isRecording: boolean;
  transcript: TranscriptSegment[];
  actionItems: ActionItem[];
  decisions: Decision[];
  keyPoints: string[];
  sentiment: 'positive' | 'neutral' | 'negative' | null;
  isAnalyzing: boolean;
  startTime: number | null;

  setIsRecording: (recording: boolean) => void;
  addTranscript: (segment: TranscriptSegment) => void;
  setAnalysisResults: (results: {
    actionItems: ActionItem[];
    decisions: Decision[];
    keyPoints: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
  }) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  toggleActionItem: (id: string) => void;
  reset: () => void;
  setStartTime: (time: number | null) => void;
}

export const useMeetingStore = create<MeetingState>((set) => ({
  isRecording: false,
  transcript: [],
  actionItems: [],
  decisions: [],
  keyPoints: [],
  sentiment: null,
  isAnalyzing: false,
  startTime: null,

  setIsRecording: (recording) => set({ isRecording: recording }),

  addTranscript: (segment) =>
    set((state) => ({
      transcript: [...state.transcript, segment],
    })),

  setAnalysisResults: (results) =>
    set({
      actionItems: results.actionItems,
      decisions: results.decisions,
      keyPoints: results.keyPoints,
      sentiment: results.sentiment,
    }),

  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),

  toggleActionItem: (id) =>
    set((state) => ({
      actionItems: state.actionItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    })),

  setStartTime: (time) => set({ startTime: time }),

  reset: () =>
    set({
      isRecording: false,
      transcript: [],
      actionItems: [],
      decisions: [],
      keyPoints: [],
      sentiment: null,
      isAnalyzing: false,
      startTime: null,
    }),
}));
