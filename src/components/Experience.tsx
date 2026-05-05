"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap, Briefcase, Microscope, BookOpen, Rocket } from "lucide-react";
import SectionHeading from "./SectionHeading";

const milestones = [
  {
    id: "gsoc",
    year: "2026",
    org: "Google Summer of Code",
    role: "Applicant · Proposal Submitted",
    period: "Jan 2026 – Present",
    location: "Remote",
    description:
      "Submitted proposals for OLMo-7B LLM integration into DeepChem's molecular property prediction pipeline and probabilistic weather forecasting with neural-lam for MLLAM. Opened PR #4876 on DeepChem.",
    accent: "#f59e0b",
    icon: Rocket,
    badge: "Active",
    tags: ["DeepChem", "OLMo-7B", "neural-lam", "MLLAM"],
  },
  {
    id: "rutgers",
    year: "2025",
    org: "Rutgers University",
    role: "M.S. Computer Science",
    period: "Sep 2025 – Present",
    location: "New Brunswick, NJ",
    description:
      "Specializing in ML, NLP, and AI Engineering. Building RAG pipelines, agentic systems, and production-ready LLM applications from model to deployment.",
    accent: "#cc0033",
    icon: BookOpen,
    badge: "Current",
    tags: ["GPA 3.50", "ML / NLP", "Agentic Systems", "AI Engineering"],
  },
  {
    id: "imd",
    year: "2023",
    org: "Indian Meteorological Dept.",
    role: "ML Project Member · Govt. of India",
    period: "Apr 2023 – Jun 2025",
    location: "Gujarat, India",
    description:
      "Led end-to-end ML model development for a live government weather forecasting system using attention-LSTM architectures. Work registered as copyright (IP India, No. LD-20250175526, 2025).",
    accent: "#7c3aed",
    icon: Microscope,
    badge: "© Registered",
    tags: ["Attention-LSTM", "IoT Pipeline", "IP India 2025", "Production"],
  },
  {
    id: "cognori",
    year: "2024",
    org: "CognoRise InfoTech",
    role: "Artificial Intelligence Intern",
    period: "Apr – May 2024",
    location: "Mumbai, India",
    description:
      "Developed and optimized ML models for production. Conducted experiments on preprocessing strategies and feature engineering pipelines using NumPy and Pandas.",
    accent: "#ea580c",
    icon: Briefcase,
    badge: "Industry",
    tags: ["Production ML", "Feature Engineering", "Python"],
  },
  {
    id: "tcet",
    year: "2021",
    org: "TCET Mumbai",
    role: "B.Tech — Internet of Things",
    period: "Dec 2021 – May 2025",
    location: "University of Mumbai",
    description:
      "Built foundations in algorithms, IoT systems, and full-stack development. Achieved CGPA of 9.50/10, ranked 2nd in the batch while leading technical initiatives.",
    accent: "#2563eb",
    icon: GraduationCap,
    badge: "Foundation",
    tags: ["CGPA 9.50/10", "Rank 2", "IoT Systems", "B.Tech"],
  },
];

/* ── Single card ── */
function Card({ m, side }: { m: typeof milestones[0]; index: number; side: "left" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = m.icon;
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - rect.left) / rect.width  - 0.5;   // -0.5 → 0.5
    const dy = (e.clientY - rect.top)  / rect.height - 0.5;
    setTilt({ x: dy * -12, y: dx * 12 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: side === "left" ? -48 : 48, y: 16 }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={`w-full md:w-[calc(50%-2rem)] ${side === "right" ? "md:ml-auto" : ""}`}
      style={{ perspective: 900 }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX: tilt.x, rotateY: tilt.y, y: tilt.x !== 0 || tilt.y !== 0 ? -5 : 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
        className="relative bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-7 shadow-sm hover:shadow-lg transition-shadow duration-500 overflow-hidden group cursor-default">

        {/* Accent top bar — draws left→right on enter */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-0 left-6 right-6 h-[2px] rounded-full origin-left"
          style={{ background: `linear-gradient(90deg, ${m.accent}, transparent)` }}
        />

        {/* Hover glow blob */}
        <div
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-[0.07] transition-opacity duration-700 pointer-events-none"
          style={{ background: m.accent }}
        />

        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-start justify-between mb-5 relative z-10"
        >
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={inView ? { scale: 1, rotate: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${m.accent}18`, border: `1.5px solid ${m.accent}35`, color: m.accent }}
            >
              <Icon size={16} />
            </motion.div>
            <span
              className="text-[9px] font-black uppercase tracking-[0.3em] px-2.5 py-0.5 rounded-full"
              style={{ background: `${m.accent}14`, color: m.accent, border: `1px solid ${m.accent}28` }}
            >
              {m.badge}
            </span>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-semibold text-[var(--muted)] opacity-60">{m.period}</p>
            <p className="text-[10px] text-[var(--muted)] opacity-40">{m.location}</p>
          </div>
        </motion.div>

        {/* Org + role */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="relative z-10 mb-4"
        >
          <h3 className="text-xl md:text-2xl font-black tracking-tight text-[var(--foreground)] leading-tight uppercase mb-1">
            {m.org}
          </h3>
          <p className="text-sm font-semibold" style={{ color: m.accent }}>
            {m.role}
          </p>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.26 }}
          className="text-[13px] text-[var(--muted)] leading-relaxed mb-5 relative z-10"
        >
          {m.description}
        </motion.p>

        {/* Tags — staggered */}
        <div className="flex flex-wrap gap-2 relative z-10">
          {m.tags.map((tag, ti) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.32 + ti * 0.06, type: "spring", stiffness: 300, damping: 22 }}
              className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{
                background: `${m.accent}0A`,
                border: `1px solid ${m.accent}22`,
                color: `${m.accent}CC`,
              }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Centre spine dot ── */
function YearDot({ m }: { m: typeof milestones[0]; side: "left" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="hidden md:flex absolute left-1/2 -translate-x-1/2 flex-col items-center gap-0 z-10">
      {/* Line above */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : {}}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-px h-8 origin-top"
        style={{ background: `${m.accent}50` }}
      />

      {/* Dot + ripple */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
        className="relative flex items-center justify-center my-2"
      >
        {/* Ripple ring */}
        <motion.div
          animate={inView ? { scale: [1, 2.2, 1], opacity: [0.5, 0, 0.5] } : {}}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          className="absolute w-4 h-4 rounded-full"
          style={{ background: m.accent }}
        />
        {/* Solid dot */}
        <div
          className="relative w-4 h-4 rounded-full ring-4 ring-[var(--background)] z-10"
          style={{ background: m.accent, boxShadow: `0 0 14px ${m.accent}70` }}
        />
      </motion.div>

      {/* Year badge */}
      <motion.span
        initial={{ opacity: 0, y: -6 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="text-[10px] font-black tabular-nums px-2.5 py-0.5 rounded-full mb-1"
        style={{ background: `${m.accent}14`, color: m.accent, border: `1px solid ${m.accent}28` }}
      >
        {m.year}
      </motion.span>

      {/* Line below */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : {}}
        transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="w-px h-8 origin-top"
        style={{ background: `${m.accent}50` }}
      />
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      <div aria-hidden="true" className="absolute top-0 right-4 md:right-10 text-[140px] md:text-[200px] font-black leading-none select-none pointer-events-none opacity-[0.025] text-[var(--foreground)]">02</div>
      <div className="container mx-auto px-6 max-w-5xl">
        <SectionHeading
          title="My Journey"
          subtitle="From engineering foundations to AI research — the milestones that shaped how I build."
          centered
        />

        <div className="relative mt-16">
          {/* Static spine line */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-[var(--card-border)]" />

          <div className="flex flex-col gap-10">
            {milestones.map((m, i) => {
              const side = i % 2 === 0 ? "right" : "left";
              return (
                <div key={m.id} className="relative flex items-center md:block">
                  {/* Mobile year badge */}
                  <div
                    className="md:hidden w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mr-4 text-[10px] font-black"
                    style={{ background: `${m.accent}14`, color: m.accent, border: `1.5px solid ${m.accent}30` }}
                  >
                    {m.year}
                  </div>

                  <YearDot m={m} side={side} />
                  <Card m={m} side={side} index={i} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
