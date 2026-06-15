'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { BotEvent } from '@/lib/types';

export function ActivityFeed({ events }: { events: BotEvent[] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Live activity feed</h2>
        <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300">streaming</span>
      </div>
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {events.slice(-8).reverse().map((event, index) => (
            <motion.div
              key={`${event.botId}-${event.timestamp}-${index}`}
              initial={{ opacity: 0, x: 24, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className="rounded-2xl border border-white/10 bg-slate-950/80 p-3"
            >
              <p className="text-sm font-semibold text-cyan-200">{event.botId ?? 'system'} • {event.type}</p>
              <p className="text-sm text-slate-300">{event.message ?? `Updated ${event.page ?? 'dashboard'}`}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
