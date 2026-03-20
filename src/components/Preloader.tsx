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
      'Scanning Orbital Sector...',
      'Syncing Deep Space Network...',
      'Calibrating Satellite Perspective...',
      'Uplink Established. Tracking Active.',
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
          <div className="relative w-48 space-y-4 z-10 flex flex-col items-center">
            <motion.h2 
              initial={{ opacity: 0, letterSpacing: "0.2em" }}
              animate={{ opacity: 1, letterSpacing: "1em" }}
              className="text-xl font-black text-white ml-[1em]"
            >
              ANISH
            </motion.h2>
            
            <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
