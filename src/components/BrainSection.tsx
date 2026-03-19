"use client";

import React from "react";
import { motion } from "framer-motion";
import AgentGame from "./AgentGame";
import SectionHeading from "./SectionHeading";

export default function BrainSection() {
  return (
    <section id="game" className="py-20 bg-transparent relative overflow-hidden transition-colors duration-500">
      {/* Background ambient glows - slightly more 'arcade' neon */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none opacity-[var(--dot-opacity)]" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/5 blur-[150px] rounded-full pointer-events-none opacity-[var(--dot-opacity)]" />

      <div className="container mx-auto px-6">
        <SectionHeading 
          title="Can You Beat My Agent?"
          subtitle="Experience reinforcement learning in action. Survival is the metric - interception is the agent's only goal."
          centered
        />

        {/* Game Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-32"
        >
          <AgentGame />
        </motion.div>
      </div>
    </section>
  );
}
