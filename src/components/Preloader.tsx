'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const NAME  = 'ANISH SHIRODKAR';

/* ── Single letter: scrambles until `resolved` is true ── */
function ScrambleChar({ target, resolved }: { target: string; resolved: boolean }) {
  // Initialize with the target char (deterministic on SSR — avoids hydration mismatch)
  const [display, setDisplay] = useState(target === ' ' ? ' ' : target);

  useEffect(() => {
    if (resolved) { setDisplay(target); return; }
    const id = setInterval(() => {
      setDisplay(target === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]);
    }, 70);
    return () => clearInterval(id);
  }, [resolved, target]);

  return (
    <span style={{ color: resolved ? '#ffffff' : 'rgba(255,255,255,0.2)' }}>
      {display}
    </span>
  );
}

/* ── Full name with staggered resolve ── */
function ScrambleName({ trigger }: { trigger: boolean }) {
  const [resolved, setResolved] = useState<boolean[]>(() =>
    NAME.split('').map(() => false)
  );

  useEffect(() => {
    if (!trigger) return;
    NAME.split('').forEach((char, i) => {
      const delay = char === ' ' ? 0 : i * 52;
      setTimeout(() => {
        setResolved(prev => { const n = [...prev]; n[i] = true; return n; });
      }, delay);
    });
  }, [trigger]);

  return (
    <span className="inline-flex">
      {NAME.split('').map((char, i) => (
        <ScrambleChar key={i} target={char} resolved={resolved[i]} />
      ))}
    </span>
  );
}

/* ── Main preloader ── */
export default function Preloader() {
  const [loading, setLoading]   = useState(true);
  const [progress, setProgress] = useState(0);
  const [started, setStarted]   = useState(false);

  useEffect(() => {
    const kickoff = setTimeout(() => setStarted(true), 180);

    const tick = setInterval(() => {
      setProgress(p => {
        const next = Math.min(p + Math.floor(Math.random() * 11) + 5, 100);
        if (next >= 100) {
          clearInterval(tick);
          setTimeout(() => setLoading(false), 900);
        }
        return next;
      });
    }, 110);

    return () => { clearTimeout(kickoff); clearInterval(tick); };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden select-none"
          style={{ background: '#030308' }}
        >
          {/* Subtle noise grain */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: 0.03,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '180px 180px',
            }}
          />

          {/* Ambient center glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, rgba(124,58,237,0.04) 40%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />

          {/* ── Centre content ── */}
          <div className="relative z-10 flex flex-col items-center gap-6">

            {/* SVG "A" monogram — draws itself */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={started ? { opacity: 1 } : {}}
              transition={{ duration: 0.3 }}
            >
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                <defs>
                  <linearGradient id="pl-g" x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2563eb" />
                    <stop offset="1" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M 14 60 L 36 12 L 58 60 M 22 42 L 50 42"
                  stroke="url(#pl-g)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={started ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                  style={{ filter: 'drop-shadow(0 0 8px rgba(124,58,237,0.6))' }}
                />
              </svg>
            </motion.div>

            {/* Name scramble */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={started ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="text-2xl md:text-4xl font-black tracking-[0.18em] uppercase"
              style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '0.18em' }}
            >
              <ScrambleName trigger={started} />
            </motion.div>

            {/* Role */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={started ? { opacity: 0.35 } : {}}
              transition={{ delay: 1.1, duration: 0.7 }}
              className="text-[9px] font-semibold uppercase tracking-[0.55em] text-white"
            >
              M.S. CS · AI Engineering · Rutgers
            </motion.p>
          </div>

          {/* ── Progress bar — pinned to bottom ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="absolute bottom-0 left-0 right-0"
          >
            {/* Track */}
            <div className="h-[1.5px] w-full" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <motion.div
                className="h-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
                style={{
                  background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
                  boxShadow: '0 0 10px rgba(124,58,237,0.7)',
                }}
              />
            </div>

            {/* Meta row */}
            <div className="flex justify-between items-center px-7 py-4">
              <span className="text-[8px] font-mono uppercase tracking-[0.35em] text-white/15">
                anishshirodkar.me · v2026
              </span>
              <span
                className="text-[9px] font-black tabular-nums font-mono"
                style={{ color: '#7c3aed', opacity: 0.7 }}
              >
                {String(progress).padStart(3, '0')}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
