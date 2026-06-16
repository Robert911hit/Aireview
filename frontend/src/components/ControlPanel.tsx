import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000';

type Props = { onRun: (runId: string) => void };

export function ControlPanel({ onRun }: Props) {
  const [targetUrl, setTargetUrl] = useState('https://example.com');
  const [agentCount, setAgentCount] = useState(100);
  const [mode, setMode] = useState<'qa' | 'ux' | 'stress'>('qa');
  const [error, setError] = useState<string>();

  async function start() {
    setError(undefined);
    const response = await fetch(`${API_BASE}/simulation/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target_url: targetUrl, agent_count: agentCount, mode }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.detail ?? 'Unable to start simulation');
      return;
    }
    onRun(payload.run_id);
  }

  return (
    <section className="hud panel control-panel">
      <p className="eyebrow">Simulation Control</p>
      <label>Authorized target URL<input value={targetUrl} onChange={(event) => setTargetUrl(event.target.value)} /></label>
      <label>Agent scale<input type="number" min={1} max={10000} value={agentCount} onChange={(event) => setAgentCount(Number(event.target.value))} /></label>
      <label>Mode<select value={mode} onChange={(event) => setMode(event.target.value as 'qa' | 'ux' | 'stress')}><option value="qa">QA</option><option value="ux">UX</option><option value="stress">Stress</option></select></label>
      <button onClick={start}>Start simulation</button>
      {error && <strong className="error">{error}</strong>}
    </section>
  );
}
