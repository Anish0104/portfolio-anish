"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Microscope, BookOpen } from "lucide-react";
import SectionHeading from "./SectionHeading";

const milestones = [
  {
    title: "M.S. in Computer Science",
    institution: "Rutgers University",
    period: "Sept 2025 - Present",
    description: "Specializing in AI/ML, NLP, and Engineering. Building high-fidelity RAG pipelines.",
    icon: <BookOpen size={20} />,
    color: "bg-blue-500/10 text-blue-400"
  },
  {
    title: "AI Research Intern",
    institution: "Indian Meteorological Dept.",
    period: "2023 - 2025",
    description: "Led development of Attention-LSTM weather forecasting system. Recognized as a government patent.",
    icon: <Microscope size={20} />,
    color: "bg-purple-500/10 text-purple-400"
  },
  {
    title: "Artificial Intelligence Intern",
    institution: "CognoRise InfoTech",
    period: "Apr - June 2024",
    description: "Developed and optimized ML models for production; built modular Python pipelines.",
    icon: <Briefcase size={20} />,
    color: "bg-orange-500/10 text-orange-400"
  },
  {
    title: "B.Tech in IoT",
    institution: "TCET (University of Mumbai)",
    period: "Dec 2021 - May 2025",
    description: "Foundations in algorithms and embedded systems. Pioneered technical student initiatives.",
    icon: <GraduationCap size={20} />,
    color: "bg-emerald-500/10 text-emerald-400"
  }
];

export default function Experience() {
  return (
    <section id="experience" className="py-32 relative bg-transparent overflow-hidden">
      <div className="container mx-auto px-6 max-w-4xl">
        <SectionHeading 
          title="My Journey"
          centered
        />

        <div className="mt-16 space-y-8">
          {milestones.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative pl-8 md:pl-12 border-l border-white/10 pb-8 last:pb-0"
            >
              {/* Timeline Dot */}
              <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[var(--background)] border-2 border-white/20 group-hover:border-[var(--accent-blue)] transition-colors duration-500 z-10" />
              
              <div className="p-8 rounded-[2rem] bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-white/20 transition-all duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${item.color}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white tracking-tight uppercase">{item.title}</h4>
                      <p className="text-sm font-bold text-[var(--muted)] opacity-60">{item.institution}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[var(--muted)]">
                    {item.period}
                  </span>
                </div>
                <p className="text-base text-[var(--muted)] leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
