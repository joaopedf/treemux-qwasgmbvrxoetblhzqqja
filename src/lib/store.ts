import { create } from 'zustand';

export type UrgencyLevel = 'immediate' | 'urgent' | 'non-urgent';

export interface TriageSession {
  id: string;
  timestamp: string;
  chiefComplaint: string;
  symptoms: string[];
  urgency: UrgencyLevel;
  summary: string;
  recommendations: string[];
  differentialDiagnosis?: string[];
  vitalSignsConcerns?: string[];
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    respiratoryRate?: number;
  };
}

interface TriageStore {
  sessions: TriageSession[];
  currentSession: Partial<TriageSession> | null;
  isAnalyzing: boolean;
  addSession: (session: TriageSession) => void;
  setCurrentSession: (session: Partial<TriageSession> | null) => void;
  setAnalyzing: (analyzing: boolean) => void;
  clearCurrentSession: () => void;
}

export const useTriageStore = create<TriageStore>((set) => ({
  sessions: [],
  currentSession: null,
  isAnalyzing: false,
  addSession: (session) =>
    set((state) => ({
      sessions: [...state.sessions, session],
      currentSession: null,
      isAnalyzing: false,
    })),
  setCurrentSession: (session) =>
    set({ currentSession: session }),
  setAnalyzing: (analyzing) =>
    set({ isAnalyzing: analyzing }),
  clearCurrentSession: () =>
    set({ currentSession: null, isAnalyzing: false }),
}));
