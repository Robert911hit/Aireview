export type SimulationEventType = 'session_start' | 'navigation' | 'click' | 'scroll' | 'input' | 'network_load' | 'error' | 'session_end';

export type SimulationPacket = {
  event_type: SimulationEventType;
  run_id: string;
  session_id: string;
  timestamp: number;
  payload: {
    page?: string;
    x?: number;
    y?: number;
    z?: number;
    vx?: number;
    vy?: number;
    vz?: number;
    intensity?: number;
    latency_ms?: number;
    target_url?: string;
    success?: boolean;
  };
};

export type AgentEntity = {
  id: string;
  type: SimulationEventType;
  position: Float32Array;
  velocity: Float32Array;
  intensity: number;
  lifecycle: 'spawn' | 'evolve' | 'decay' | 'persist';
  history: SimulationPacket[];
};

export type MetricsSnapshot = {
  events: number;
  error_rate: number;
  session_success_rate: number;
  avg_response_latency: number;
  event_throughput: number;
};
