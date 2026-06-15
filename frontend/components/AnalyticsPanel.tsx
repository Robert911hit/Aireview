'use client';

import { motion } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { DashboardMetrics } from '@/lib/types';

const chartData = [
  { page: 'Home', performance: 96 },
  { page: 'Pricing', performance: 91 },
  { page: 'Docs', performance: 88 },
  { page: 'Signup', performance: 84 },
  { page: 'OTP', performance: 90 },
  { page: 'Report', performance: 97 },
];

export function AnalyticsPanel({ metrics }: { metrics: DashboardMetrics }) {
  const cards = [
    ['Load time', `${metrics.loadTime.toFixed(2)}s`],
    ['Error rate', `${metrics.errorRate.toFixed(1)}%`],
    ['Drop-off points', `${metrics.dropOff.toFixed(1)}%`],
    ['Signup success', `${metrics.signupSuccess.toFixed(1)}%`],
    ['Page performance', `${metrics.pagePerformance.toFixed(0)}/100`],
  ];

  return (
    <section className="grid gap-4 lg:grid-cols-5">
      {cards.map(([label, value], index) => (
        <motion.article
          key={label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="click-ripple rounded-3xl border border-white/10 bg-white/5 p-5"
        >
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-black text-white">{value}</p>
        </motion.article>
      ))}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 lg:col-span-5">
        <h2 className="mb-4 text-xl font-bold">Page performance</h2>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <XAxis dataKey="page" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: '#0c1730', border: '1px solid rgba(255,255,255,.1)' }} />
              <Area type="monotone" dataKey="performance" stroke="#25d9ff" fill="#1f7aff" fillOpacity={0.22} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
