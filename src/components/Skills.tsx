"use client";

import React from "react";
import SectionHeading from "./SectionHeading";
import { motion } from "framer-motion";

const SKILLS = [
  { name: "AI/ML Engineering", category: "Core" },
  { name: "Natural Language Processing", category: "AI" },
  { name: "Computer Vision", category: "AI" },
  { name: "Python / PyTorch", category: "Dev" },
  { name: "Full-Stack Dev", category: "Dev" },
  { name: "Cloud Engineering", category: "Infra" },
  { name: "Large Language Models", category: "AI" },
  { name: "Data Engineering", category: "Infra" },
];

export default function Skills() {
  return (
    <section id="skills" className="py-32 relative overflow-hidden bg-transparent">
      <div className="container mx-auto px-6 flex flex-col items-center">
        <SectionHeading 
          title="Expertise"
          subtitle="Specialized in building end-to-end intelligent systems."
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl mt-12">
          {SKILLS.map((skill, idx) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="p-6 rounded-[2rem] bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--accent-blue)]/30 transition-all duration-300 group"
            >
              <div className="space-y-2">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-blue)] opacity-50 group-hover:opacity-100 transition-opacity">
                   {skill.category}
                 </p>
                 <h4 className="text-lg font-black text-[var(--foreground)] tracking-tight">
                   {skill.name}
                 </h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
