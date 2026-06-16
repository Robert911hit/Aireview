import { useSimulationStore } from '../store/simulationStore';

export function EventConsole() {
  const events = useSimulationStore((state) => state.events);
  const selected = useSimulationStore((state) => state.selectedSession);
  return (
    <section className="hud panel event-console">
      <p className="eyebrow">Event Stream</p>
      {selected && <p className="selected">Selected: {selected}</p>}
      <ol>
        {events.slice(-12).reverse().map((event) => <li key={`${event.session_id}-${event.timestamp}`}><b>{event.event_type}</b><span>{event.session_id.slice(0, 16)}</span><em>{event.payload.page ?? 'system'}</em></li>)}
      </ol>
    </section>
  );
}
