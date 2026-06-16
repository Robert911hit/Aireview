import { create } from 'zustand';
import type { MetricsSnapshot, SimulationPacket } from '../types/simulation';

type SimulationState = {
  runId?: string;
  selectedSession?: string;
  events: SimulationPacket[];
  metrics: MetricsSnapshot;
  setRunId: (runId: string) => void;
  selectSession: (sessionId?: string) => void;
  ingest: (packet: SimulationPacket) => void;
  setMetrics: (metrics: MetricsSnapshot) => void;
};

export const useSimulationStore = create<SimulationState>((set) => ({
  events: [],
  metrics: { events: 0, error_rate: 0, session_success_rate: 100, avg_response_latency: 0, event_throughput: 0 },
  setRunId: (runId) => set({ runId, events: [] }),
  selectSession: (selectedSession) => set({ selectedSession }),
  ingest: (packet) => set((state) => ({ events: [...state.events.slice(-500), packet] })),
  setMetrics: (metrics) => set({ metrics }),
}));
