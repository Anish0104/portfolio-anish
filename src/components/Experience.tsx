"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Briefcase, Microscope, BookOpen, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import SectionHeading from "./SectionHeading";

const milestones = [
  {
    id: "foundation",
    label: "FOUNDATION",
    title: "TCET (University of Mumbai)",
    period: "Dec 2021 - May 2025",
    institution: "B.Tech in Internet of Things",
    description: "Built strong foundations in algorithms and IoT systems. Achieved a GPA of 3.67 while pioneering student technical initiatives.",
    angle: 90, // Bottom
    icon: <GraduationCap size={22} />,
    color: "from-blue-500 to-cyan-400",
    accent: "text-blue-400",
  },
  {
    id: "industry",
    label: "INDUSTRY EXPERIENCE",
    title: "CognoRise InfoTech",
    period: "Apr - June 2024",
    institution: "Artificial Intelligence Intern",
    description: "Developed and optimized ML models for production; built modular Python preprocessing and feature engineering pipelines.",
    angle: 180, // Left
    icon: <Briefcase size={22} />,
    color: "from-orange-500 to-amber-400",
    accent: "text-orange-400",
  },
  {
    id: "research",
    label: "RESEARCH & SYSTEMS",
    title: "Indian Meteorological Dept.",
    period: "2023 - 2025",
    institution: "AI Research Intern",
    description: "Conducting AI/ML research at the Indian Meteorological Department - led development of an Attention-LSTM weather forecasting system, recognized as a government patent (IP India, 2025).",
    angle: 270, // Top
    icon: <Microscope size={22} />,
    color: "from-purple-500 to-fuchsia-400",
    accent: "text-purple-400",
  },
  {
    id: "advanced",
    label: "ADVANCED STUDY",
    title: "Rutgers University",
    period: "Sept 2025 - Present",
    institution: "M.S. in Computer Science",
    description: "Specializing in ML, NLP, and AI Engineering. Current GPA: 3.50. Building RAG pipelines and end-to-end AI systems.",
    angle: 0, // Right
    icon: <BookOpen size={22} />,
    color: "from-emerald-500 to-teal-400",
    accent: "text-emerald-400",
  },

];

export default function Experience() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <section id="experience" className="py-20 relative overflow-hidden bg-transparent min-h-[850px] flex flex-col items-center justify-center transition-colors duration-500">
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        
        <SectionHeading 
          title="My Journey"
          centered
        />

        {/* Mobile Fallback: Stacked Cards */}
        <div className="md:hidden w-full space-y-4 mb-8">
          {milestones.map((node, idx) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-5 p-6 rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)]"
            >
              <div className="w-12 h-12 rounded-2xl bg-[var(--background)] border border-[var(--card-border)] flex items-center justify-center shrink-0 text-[var(--muted)]">
                {node.icon}
              </div>
                <div>
                  <h4 className="text-base font-black text-[var(--foreground)] tracking-tight mt-0.5">{node.institution}</h4>
                <p className="text-[11px] text-[var(--muted)] mt-1 font-medium">{node.period}</p>
                <p className="text-[12px] text-[var(--muted)] mt-2 leading-relaxed">{node.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Orbit System (Desktop Only) */}
        <div className="hidden md:block relative w-full aspect-square max-w-[850px]">
        <div className="relative w-full aspect-square max-w-[850px] flex items-center justify-center">
          
          {/* Central Unit - Revised: Identity through Intelligence */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="absolute z-20 flex flex-col items-center justify-center text-center pointer-events-none"
          >
              <div className="relative z-10 flex flex-col items-center">
                 <motion.div 
                    animate={{ 
                      y: [0, -15, 0],
                      rotate: [0, 1, -1, 0]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="w-80 h-80 flex items-center justify-center"
                 >
                    <Image
                      src="/avatar-v9.png"
                      alt="Anish Shirodkar"
                      width={320}
                      height={320}
                      className="object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_40px_80px_rgba(0,0,0,0.5)] brightness-[1.05]"
                    />
                 </motion.div>
              </div>
          </motion.div>

          {/* SVG Layer: Orbit & Ticks */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 1000 1000">
            {/* Ticks/Dial markings */}
            {[...Array(60)].map((_, i) => (
               <line
                 key={i}
                 x1="500"
                 y1="100"
                 x2="500"
                 y2={i % 5 === 0 ? "120" : "110"}
                 stroke="currentColor"
                 strokeWidth={i % 5 === 0 ? "1.5" : "0.5"}
                 className="text-[var(--foreground)] opacity-[var(--dot-opacity)]"
                 transform={`rotate(${i * 6} 500 500)`}
               />
            ))}

            {/* Main Orbit Circle */}
            <circle cx="500" cy="500" r="340" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 6" className="text-[var(--foreground)] opacity-[var(--dot-opacity)]" />
            
            {/* Animated Glow Path */}
            <motion.circle
              cx="500"
              cy="500"
              r="340"
              fill="none"
              stroke="url(#orbitGlow)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="100, 2000"
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />

            <defs>
              <linearGradient id="orbitGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Milestone Nodes */}
          {milestones.map((node, idx) => {
            const radius = 340;
            const x = 500 + radius * Math.cos((node.angle * Math.PI) / 180);
            const y = 500 + radius * Math.sin((node.angle * Math.PI) / 180);

            // Determine label position based on angle
            const isLeft = node.angle === 180;
            const isTop = node.angle === 270;
            const isBottom = node.angle === 90;

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 + idx * 0.1 }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  left: `${(x / 1000) * 100}%`,
                  top: `${(y / 1000) * 100}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30 group"
              >
                {/* Connection Node */}
                <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center bg-[var(--background)] border border-[var(--card-border)] group-hover:border-[var(--accent-blue)] transition-all duration-500 shadow-2xl cursor-pointer">
                   <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${node.color} opacity-0 group-hover:opacity-20 transition-opacity blur-xl`} />
                   <div className="text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors relative z-10">
                     {node.icon}
                   </div>

                   {/* Phase Label & Institution Name */}
                   <div className={`absolute whitespace-nowrap pointer-events-none transition-all duration-500
                    ${isLeft ? "right-20 text-right" : ""}
                    ${isTop ? "bottom-20 -translate-x-1/2 left-1/2 text-center" : ""}
                    ${isBottom ? "top-20 -translate-x-1/2 left-1/2 text-center" : ""}
                    ${!isLeft && !isTop && !isBottom ? "left-20 text-left" : ""}
                   `}>
                      <h4 className="text-2xl font-black text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors tracking-tighter">
                        {node.title}
                      </h4>
                   </div>
                   
                   {/* Disclosure Card (Hover) */}
                   <AnimatePresence>
                    {hoveredNode === node.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 15 }}
                        className={`absolute w-80 pointer-events-none p-8 rounded-[2.5rem] bg-[var(--background)] border border-[var(--card-border)] backdrop-blur-3xl shadow-2xl z-50
                          ${isLeft ? "right-24 top-1/2 -translate-y-1/2" : ""}
                          ${isTop ? "top-24 left-1/2 -translate-x-1/2" : ""}
                          ${isBottom ? "bottom-24 left-1/2 -translate-x-1/2" : ""}
                          ${!isLeft && !isTop && !isBottom ? "left-24 top-1/2 -translate-y-1/2" : ""}
                        `}
                      >
                         <div className="flex items-center gap-3 mb-4">
                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-[var(--card-border)] border border-[var(--card-border)] ${node.accent}`}>{node.period}</span>
                         </div>
                         <h4 className="text-2xl font-black text-[var(--foreground)] mb-2 tracking-tighter">
                            {node.institution}
                         </h4>
                         <p className="text-[11px] text-[var(--muted)] leading-relaxed font-medium mt-4">
                            {node.description}
                         </p>
                      </motion.div>
                    )}
                   </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
        </div>
      </div>
    </section>
  );
}
