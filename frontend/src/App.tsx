import { useEffect } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { EventConsole } from './components/EventConsole';
import { MetricsPanel } from './components/MetricsPanel';
import { WebGLViewport } from './components/WebGLViewport';
import { useSimulationStore } from './store/simulationStore';
import './styles/app.css';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000';
const WS_BASE = import.meta.env.VITE_WS_BASE ?? 'ws://localhost:8000';

export default function App() {
  const runId = useSimulationStore((state) => state.runId);
  const setRunId = useSimulationStore((state) => state.setRunId);
  const ingest = useSimulationStore((state) => state.ingest);
  const setMetrics = useSimulationStore((state) => state.setMetrics);

  useEffect(() => {
    const socket = new WebSocket(`${WS_BASE}/ws/simulation${runId ? `/${runId}` : ''}`);
    socket.onmessage = (message) => ingest(JSON.parse(message.data));
    return () => socket.close();
  }, [runId, ingest]);

  useEffect(() => {
    if (!runId) return;
    const timer = window.setInterval(async () => {
      const response = await fetch(`${API_BASE}/metrics/${runId}`);
      if (response.ok) setMetrics(await response.json());
    }, 1200);
    return () => window.clearInterval(timer);
  }, [runId, setMetrics]);

  return (
    <main>
      <WebGLViewport />
      <div className="title"><span>WebPulse V2</span><strong>Cinematic WebGL Simulation Engine</strong></div>
      <ControlPanel onRun={setRunId} />
      <MetricsPanel />
      <EventConsole />
      <div className="timeline">fixed timestep • websocket deltas • GPU particles • QA-only guardrails</div>
    </main>
  );
}
