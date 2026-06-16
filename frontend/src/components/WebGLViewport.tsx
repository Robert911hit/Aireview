import { useEffect, useRef } from 'react';
import { SimulationEngine } from '../engine/SimulationEngine';
import { useSimulationStore } from '../store/simulationStore';

export function WebGLViewport() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<SimulationEngine | null>(null);
  const events = useSimulationStore((state) => state.events);
  const selectSession = useSimulationStore((state) => state.selectSession);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = new SimulationEngine(canvas);
    engineRef.current = engine;
    const resize = () => engine.resize(canvas.clientWidth, canvas.clientHeight);
    resize();
    window.addEventListener('resize', resize);
    engine.start();
    return () => {
      window.removeEventListener('resize', resize);
      engine.stop();
    };
  }, []);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    events.slice(-12).forEach((event) => engine.ingest(event));
  }, [events]);

  return <canvas ref={canvasRef} className="viewport" onClick={(event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    selectSession(engineRef.current?.selectAt(x, y));
  }} />;
}
