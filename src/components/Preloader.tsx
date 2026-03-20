'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing Terminal...');

  useEffect(() => {
    // Simulated load progress
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 800);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    const statusUpdates = [
      'Scanning System Modules...',
      'Optimizing Memory Buffers...',
      'Calibrating Interface...',
      'System Ready. Interface Active.',
    ];

    let statusIndex = 0;
    const statusTimer = setInterval(() => {
      if (statusIndex < statusUpdates.length) {
        setStatus(statusUpdates[statusIndex]);
        statusIndex++;
      } else {
        clearInterval(statusTimer);
      }
    }, 600);

    return () => {
      clearInterval(timer);
      clearInterval(statusTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[999] bg-[#020617] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Subtle Scanning Lines */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay" />
          <div className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none" />

          {/* Central Module */}
          <div className="relative w-72 md:w-96 space-y-8 z-10">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10px] font-black text-[var(--accent-blue)] uppercase tracking-[0.5em] italic"
                >
                  system_init
                </motion.span>
                <span className="text-[10px] font-mono text-[var(--accent-blue)] opacity-50">
                  {progress}%
                </span>
              </div>
              
              {/* Progress Bar Container */}
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  className="h-full bg-[var(--accent-blue)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
               <div className="flex items-center gap-4 py-2 px-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="flex gap-1 items-end h-3">
                    {[0.4, 0.7, 1, 0.6].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [`${h*100}%`, `${(h*0.5)*100}%`, `${h*100}%`] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                        className="w-1 bg-[var(--accent-blue)] rounded-t-sm"
                      />
                    ))}
                  </div>
                  <motion.p 
                    key={status}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] font-bold text-[var(--accent-blue)] uppercase tracking-widest text-center"
                  >
                    {status}
                  </motion.p>
               </div>
               
               <div className="grid grid-cols-2 gap-x-8 gap-y-1 opacity-40">
                  <div className="flex justify-between w-24">
                    <span className="text-[8px] font-mono text-[var(--muted)]">MEM</span>
                    <span className="text-[8px] font-mono text-white">1.0 TB</span>
                  </div>
                  <div className="flex justify-between w-24">
                    <span className="text-[8px] font-mono text-[var(--muted)]">CPU</span>
                    <span className="text-[8px] font-mono text-white">4.8 GHZ</span>
                  </div>
                  <div className="flex justify-between w-24">
                    <span className="text-[8px] font-mono text-[var(--muted)]">NET</span>
                    <span className="text-[8px] font-mono text-white">10 GBPS</span>
                  </div>
                  <div className="flex justify-between w-24">
                    <span className="text-[8px] font-mono text-white">READY</span>
                    <span className="text-[8px] font-mono text-[var(--muted)]">SYS</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Decorative Technical Corner */}
          <div className="absolute bottom-10 right-10 text-right opacity-20 pointer-events-none hidden md:block">
             <p className="text-[8px] font-mono text-white tracking-widest uppercase">Anish Shirodkar OS</p>
             <p className="text-[8px] font-mono text-white/50 uppercase">v2026.03.20_Stable</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
