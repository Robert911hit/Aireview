'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { useMemo, useRef } from 'react';
import type { Mesh } from 'three';
import type { BotEvent } from '@/lib/types';

const pageNodes = [
  { name: 'Home', position: [-4, 0, -2] as const },
  { name: 'Pricing', position: [-1.5, 0, 2.5] as const },
  { name: 'Docs', position: [1.6, 0, -2.2] as const },
  { name: 'Signup', position: [4, 0, 1.4] as const },
  { name: 'OTP', position: [0, 0, 0] as const },
  { name: 'Report', position: [3.2, 0, -3.2] as const },
];

function BotOrb({ event, index }: { event: BotEvent; index: number }) {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.x += ((event.x ?? 0) - ref.current.position.x) * 0.035;
    ref.current.position.y = 0.8 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.18;
    ref.current.position.z += ((event.z ?? 0) - ref.current.position.z) * 0.035;
    ref.current.rotation.y += 0.03;
  });

  return (
    <mesh ref={ref} position={[event.x ?? 0, event.y ?? 1, event.z ?? 0]}>
      <sphereGeometry args={[0.16, 32, 32]} />
      <meshStandardMaterial color={event.error ? '#fb7185' : '#25d9ff'} emissive={event.error ? '#7f1d1d' : '#0ea5e9'} emissiveIntensity={1.4} />
    </mesh>
  );
}

function PageNode({ name, position }: { name: string; position: readonly [number, number, number] }) {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.35;
  });
  return (
    <group position={position}>
      <mesh ref={ref}>
        <boxGeometry args={[0.52, 0.52, 0.52]} />
        <meshStandardMaterial color="#1f7aff" emissive="#1f7aff" emissiveIntensity={0.65} />
      </mesh>
    </group>
  );
}

export function ThreeDashboard({ events }: { events: BotEvent[] }) {
  const latestBots = useMemo(() => {
    const byBot = new Map<string, BotEvent>();
    events.forEach((event) => {
      if (event.botId) byBot.set(event.botId, event);
    });
    return Array.from(byBot.values()).slice(-50);
  }, [events]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-[560px] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 shadow-glow"
    >
      <Canvas camera={{ position: [0, 6, 8], fov: 55 }}>
        <ambientLight intensity={0.45} />
        <pointLight position={[4, 6, 4]} intensity={80} color="#25d9ff" />
        <gridHelper args={[12, 12, '#1f7aff', '#12315c']} />
        {pageNodes.map((node) => <PageNode key={node.name} {...node} />)}
        {latestBots.map((event, index) => <BotOrb key={event.botId} event={event} index={index} />)}
      </Canvas>
    </motion.div>
  );
}
