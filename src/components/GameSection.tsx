"use client";

import React from "react";
import { motion } from "framer-motion";
import PortfolioGame from "./PortfolioGame";

export default function GameSection() {
  return (
    <section id="game" className="py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-3"
        >
          <span className="text-white/60 text-xs font-bold tracking-[0.3em] uppercase">
            Interactive
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center mb-4"
        >
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
            Neural{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-[#b388ff]">
              Drift
            </span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center text-white/45 text-sm mb-10 tracking-wide"
        >
          Pilot an AI agent through the neural network · dodge corruption spikes · collect project nodes
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <PortfolioGame />
        </motion.div>

        {/* Controls hint */}
        <div className="flex justify-center gap-6 mt-5">
          {["CLICK", "SPACE", "TAP"].map((k) => (
            <span key={k} className="flex items-center gap-2 text-xs text-white/35">
              <kbd
                className="px-2 py-0.5 rounded border border-white/10 bg-white/5 font-mono text-white/50"
              >
                {k}
              </kbd>
              pulse up
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
