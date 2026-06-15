'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ActivityFeed } from '@/components/ActivityFeed';
import { AnalyticsPanel } from '@/components/AnalyticsPanel';
import { ThreeDashboard } from '@/components/ThreeDashboard';
import type { BotEvent, DashboardMetrics } from '@/lib/types';

const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8000';
const wsBase = process.env.NEXT_PUBLIC_WS_BASE ?? 'ws://localhost:8000';

const fallbackEvents: BotEvent[] = Array.from({ length: 12 }, (_, index) => ({
  type: index % 3 === 0 ? 'bot_spawn' : 'bot_move',
  botId: `bot-${String(index + 1).padStart(3, '0')}`,
  page: ['Home', 'Pricing', 'Docs', 'Signup'][index % 4],
  x: Math.sin(index) * 4,
  y: 1,
  z: Math.cos(index) * 4,
  message: 'Demo stream awaiting backend connection',
  timestamp: Date.now() / 1000 + index,
  loadTime: 1.4,
  error: false,
}));

export default function DashboardPage() {
  const [runId, setRunId] = useState<string>('demo-run');
  const [events, setEvents] = useState<BotEvent[]>(fallbackEvents);
  const [metrics, setMetrics] = useState<DashboardMetrics>({ loadTime: 1.42, errorRate: 1.1, dropOff: 7.4, signupSuccess: 94.2, pagePerformance: 91 });

  useEffect(() => {
    gsap.fromTo('.spawn-glow', { boxShadow: '0 0 0 rgba(37,217,255,0)' }, { boxShadow: '0 0 70px rgba(37,217,255,.38)', repeat: -1, yoyo: true, duration: 1.6 });
  }, []);

  useEffect(() => {
    const socket = new WebSocket(`${wsBase}/ws/runs/${runId}`);
    socket.onmessage = (message) => {
      const event = JSON.parse(message.data) as BotEvent;
      setEvents((current) => [...current.slice(-120), event]);
    };
    return () => socket.close();
  }, [runId]);

  useEffect(() => {
    if (runId === 'demo-run') return;
    const timer = window.setInterval(async () => {
      const response = await fetch(`${apiBase}/tests/${runId}/metrics`);
      const payload = await response.json();
      setMetrics({
        loadTime: payload.loadTime ?? 1.42,
        errorRate: payload.errorRate ?? 0,
        dropOff: payload.dropOff ?? 0,
        signupSuccess: payload.signupSuccess ?? 0,
        pagePerformance: payload.pagePerformance ?? 0,
      });
    }, 2200);
    return () => window.clearInterval(timer);
  }, [runId]);

  const startTest = async () => {
    const response = await fetch(`${apiBase}/tests/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target_url: 'https://example.com', bot_count: 50 }),
    });
    const payload = await response.json();
    setRunId(payload.run_id);
    setEvents([]);
  };

  const flow = useMemo(() => ['User starts test', 'Scheduler assigns 50 bots', 'Bots execute Playwright sessions', 'Logs stream via WebSockets', 'Frontend renders 3D visualization', 'Reports generated'], []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#12315c,transparent_34%),#050b18] px-6 py-8 text-white">
      <section className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-cyan-300">WebPulse Uniontesters</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">Real-time 3D dashboard for controlled QA browser agents.</h1>
            <p className="mt-4 max-w-3xl text-slate-300">Moving orbs represent bots, glowing nodes represent website pages, and live WebSocket logs show every spawn, page transition, click ripple, and report event.</p>
          </div>
          <button onClick={startTest} className="spawn-glow click-ripple rounded-full bg-cyan-400 px-7 py-4 font-black text-slate-950">Start 50-bot test</button>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.45fr_.75fr]">
          <ThreeDashboard events={events} />
          <ActivityFeed events={events} />
        </div>

        <AnalyticsPanel metrics={metrics} />

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-black">System flow</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            {flow.map((item, index) => (
              <motion.div key={item} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="rounded-2xl bg-slate-950/80 p-4 text-sm font-bold text-slate-200">
                {index + 1}. {item}
              </motion.div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
