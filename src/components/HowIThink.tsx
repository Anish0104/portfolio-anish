"use client";

import React from "react";
import { motion } from "framer-motion";
import { Microscope, Binary, Activity } from "lucide-react";
import SectionHeading from "./SectionHeading";

const THINKING_STEPS = [
  {
    number: "01",
    title: "Understand",
    description: "I begin by understanding the problem deeply: the objective, constraints, users, and tradeoffs. Strong solutions start with clear problem framing.",
    icon: <Microscope className="w-6 h-6" />,
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/20"
  },
  {
    number: "02",
    title: "Architect",
    description: "I break the problem into systems, models, and workflows. I choose tools carefully and design solutions that are scalable, efficient, and maintainable.",
    icon: <Binary className="w-6 h-6" />,
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/20"
  },
  {
    number: "03",
    title: "Iterate",
    description: "I test, measure, and refine continuously. I improve performance, handle edge cases, and optimize based on real-world feedback.",
    icon: <Activity className="w-6 h-6" />,
    color: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/20"
  }
];

export default function HowIThink() {
  return (
    <section id="how-i-think" className="py-32 bg-transparent relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Technical Header */}
        <SectionHeading 
          title="How I Think"
          centered
        />

        {/* Schematic Process Flow */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[60px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--card-border)] to-transparent z-0" />
          
          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            {THINKING_STEPS.map((step, idx) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Process Node */}
                <div className="relative mb-12">
                   {/* Measurement Circles */}
                   <div className="absolute -inset-4 border border-[var(--card-border)] rounded-full opacity-20 group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute -inset-8 border border-[var(--card-border)] rounded-full opacity-10 group-hover:scale-125 transition-transform duration-1000" />
                   
                   {/* Main Icon Hub */}
                   <div className="w-24 h-24 rounded-3xl glass-card flex items-center justify-center relative z-10 group-hover:border-[var(--accent-blue)]/50 transition-colors shadow-2xl">
                      <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-10 group-hover:opacity-30 transition-opacity rounded-3xl`} />
                      <div className="text-[var(--foreground)] opacity-40 group-hover:opacity-100 transition-all scale-110">
                        {step.icon}
                      </div>
                      
                      {/* Step Number */}
                      <span className="absolute -top-3 -right-3 px-3 py-1 bg-[var(--background)] border border-[var(--card-border)] rounded-lg text-[9px] font-black font-mono text-[var(--accent-blue)] shadow-xl">
                        {step.number}
                      </span>
                   </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-black text-[var(--foreground)] mb-4 tracking-tighter uppercase group-hover:text-[var(--accent-blue)] transition-colors">
                  {step.title}
                </h3>
                <p className="text-[13px] text-[var(--muted)] leading-relaxed font-medium max-w-[280px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
