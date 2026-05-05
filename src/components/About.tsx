"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, GraduationCap, Microscope, Clock, Cpu } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { CountUp } from "@/components/ui/count-up";

const stats = [
  { to: 4,   fmt: (n: number) => String(Math.round(n)),                  label: "Production AI Systems",  color: "#2563eb" },
  { to: 3.5, fmt: (n: number) => n.toFixed(2),                           label: "GPA — MSCS Rutgers",     color: "#7c3aed" },
  { to: 9.5, fmt: (n: number) => n.toFixed(2),                           label: "CGPA — B.Tech (Rank 2)", color: "#059669" },
  { to: 1,   fmt: (n: number) => String(Math.round(n)).padStart(2, "0"), label: "Govt. Copyright · 2025", color: "#f59e0b" },
];

export default function About() {
  const [estTime, setEstTime] = useState("");

  useEffect(() => {
    const update = () =>
      setEstTime(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "America/New_York",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(new Date())
      );
    update();
    const id = setInterval(update, 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="about" className="py-28 relative overflow-hidden">
      <div aria-hidden="true" className="absolute top-0 right-4 md:right-10 text-[140px] md:text-[200px] font-black leading-none select-none pointer-events-none opacity-[0.025] text-[var(--foreground)]">01</div>
      <div className="container mx-auto px-6 max-w-6xl">
        <SectionHeading title="About Me" centered />

        {/* ── Row 1: Identity card + Right stack ────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-5 mt-12"
        >
          {/* IDENTITY — spans 3 cols */}
          <div className="lg:col-span-3 relative bg-[var(--card-bg)] rounded-[2rem] border border-[var(--card-border)] p-8 md:p-10 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-500 group">
            {/* Background gradient blob */}
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
                 style={{ background: "radial-gradient(circle, rgba(37,99,235,0.06), transparent 70%)" }} />

            {/* Avatar row */}
            <div className="flex items-start gap-5 mb-7">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-[var(--card-border)] shadow-sm">
                <Image src="/avatar-nobg.png" alt="Anish" fill className="object-cover object-top scale-110" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-[var(--foreground)]">Anish Shirodkar</h3>
                <p className="text-sm text-[var(--muted)] font-medium">AI / ML Engineer · MS CS @ Rutgers</p>
                {/* Open badge */}
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-black uppercase tracking-[0.2em]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Open to Internships · Summer 2026
                </div>
              </div>
            </div>

            {/* Mission */}
            <h4 className="text-2xl md:text-3xl font-black tracking-tighter text-[var(--foreground)] leading-tight mb-4 uppercase">
              Building Machines<br />
              <span className="text-[var(--muted)]">that Understand the World.</span>
            </h4>

            {/* Bio */}
            <p className="text-[14px] text-[var(--muted)] leading-relaxed mb-6">
              MS CS candidate at Rutgers specialising in ML, NLP, and AI engineering.
              I bridge research and production — shipping everything from computer vision
              pipelines (YOLOv8, ByteTrack) to RAG-based NLP systems (LLaMA 3.1, ChromaDB)
              and full-stack LLM applications. Government-registered copyright holder for
              an attention-LSTM weather forecasting system.
            </p>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-2">
              {["PyTorch", "LangChain", "Next.js", "FastAPI", "Supabase", "Docker"].map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full text-[10px] font-semibold text-[var(--muted)] border border-[var(--card-border)] bg-[var(--background)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT STACK — 2 cols */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* LOCATION */}
            <div className="flex-1 bg-[var(--card-bg)] rounded-[2rem] border border-[var(--card-border)] p-6 shadow-sm hover:shadow-md hover:border-[var(--accent-blue)]/30 transition-all duration-500 group overflow-hidden relative">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                   style={{ background: "radial-gradient(circle at 70% 30%, rgba(37,99,235,0.04), transparent 70%)" }} />

              <div className="flex items-center gap-2 mb-4 text-[var(--accent-blue)]">
                <MapPin size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.35em]">Location</span>
              </div>
              <p className="text-2xl font-black tracking-tighter text-[var(--foreground)] uppercase mb-2 leading-tight">
                New Jersey, USA
              </p>
              <div className="flex items-center gap-2">
                <Clock size={12} className="text-[var(--muted)]" />
                <span className="text-[11px] font-semibold text-[var(--muted)]">{estTime || "—"} ET</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse ml-1" />
              </div>
              <div className="mt-4 flex gap-6 opacity-30 group-hover:opacity-60 transition-opacity">
                <div>
                  <p className="text-[8px] font-black uppercase tracking-wider text-[var(--muted)]">Lat</p>
                  <p className="text-[10px] font-mono text-[var(--foreground)]">40.7128° N</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-wider text-[var(--muted)]">Long</p>
                  <p className="text-[10px] font-mono text-[var(--foreground)]">74.0060° W</p>
                </div>
              </div>
            </div>

            {/* EDUCATION */}
            <div className="bg-[var(--card-bg)] rounded-[2rem] border border-[var(--card-border)] p-6 shadow-sm hover:shadow-md hover:border-[var(--accent-purple)]/30 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                   style={{ background: "radial-gradient(circle at 30% 70%, rgba(124,58,237,0.04), transparent 70%)" }} />

              <div className="flex items-center gap-2 mb-4 text-[var(--accent-purple)]">
                <GraduationCap size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.35em]">Education</span>
              </div>
              <p className="text-lg font-black tracking-tighter text-[var(--foreground)] uppercase mb-0.5">
                MSCS @ Rutgers
              </p>
              <p className="text-[11px] font-semibold text-[var(--muted)] mb-3">Major in AI · GPA 3.50</p>
              <div className="h-px bg-[var(--card-border)] mb-3" />
              <p className="text-[13px] font-semibold text-[var(--foreground)]">TCET · Mumbai</p>
              <p className="text-[11px] text-[var(--muted)]">B.Tech IoT · CGPA 9.50 · Rank 2</p>
            </div>

            {/* COPYRIGHT */}
            <div className="bg-[var(--card-bg)] rounded-[2rem] border border-[var(--card-border)] p-6 shadow-sm hover:shadow-md hover:border-amber-300/40 transition-all duration-500 group relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 text-amber-600">
                  <Microscope size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-600 mb-0.5">
                    Scientific Recognition
                  </p>
                  <p className="text-base font-black tracking-tighter text-[var(--foreground)] uppercase leading-tight">
                    01 Copyright Registered
                  </p>
                  <p className="text-[10px] font-semibold text-[var(--muted)]">IP India · Cert. LD-20250175526 · 2025</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Stats strip ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
              className="bg-[var(--card-bg)] rounded-[1.5rem] border border-[var(--card-border)] p-5 shadow-sm text-center hover:shadow-md transition-shadow duration-300 group"
            >
              <Cpu size={14} className="mx-auto mb-2 opacity-20 group-hover:opacity-40 transition-opacity" style={{ color: s.color }} />
              <p className="text-2xl md:text-3xl font-black tracking-tighter" style={{ color: s.color }}>
                <CountUp to={s.to} format={s.fmt} />
              </p>
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--muted)] mt-1 leading-tight">
                {s.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
