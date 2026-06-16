import { useSimulationStore } from '../store/simulationStore';

export function MetricsPanel() {
  const metrics = useSimulationStore((state) => state.metrics);
  return (
    <section className="hud panel metrics-panel">
      <p className="eyebrow">Live Metrics</p>
      <div><span>Events</span><strong>{metrics.events}</strong></div>
      <div><span>Error rate</span><strong>{metrics.error_rate}%</strong></div>
      <div><span>Success</span><strong>{metrics.session_success_rate}%</strong></div>
      <div><span>Avg latency</span><strong>{metrics.avg_response_latency}ms</strong></div>
      <div><span>Throughput</span><strong>{metrics.event_throughput}/run</strong></div>
    </section>
  );
}
