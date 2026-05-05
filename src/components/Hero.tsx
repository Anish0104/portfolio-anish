"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FileText, Send, ArrowDown } from "lucide-react";
import { CountUp } from "@/components/ui/count-up";

const phrases = [
  { greeting: "Hi, I'm",       name: "Anish Shirodkar" },
  { greeting: "नमस्ते, मैं हूँ", name: "Anish Shirodkar" },
  { greeting: "Hola, soy",     name: "Anish Shirodkar" },
  { greeting: "Bonjour, je suis", name: "Anish Shirodkar" },
  { greeting: "Ciao, sono",    name: "Anish Shirodkar" },
];

const stats = [
  { to: 4,   fmt: (n: number) => String(Math.round(n)),                  label: "AI Systems Shipped" },
  { to: 1,   fmt: (n: number) => String(Math.round(n)).padStart(2, "0"), label: "Govt. Copyright" },
  { to: 3.5, fmt: (n: number) => n.toFixed(2),                           label: "GPA @ Rutgers" },
  { to: 2,   fmt: (n: number) => { const r = Math.round(n); return r + (r === 1 ? "st" : "nd"); }, label: "Batch Rank (B.Tech)" },
];

const Typewriter = () => {
  const [index, setIndex]       = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse]   = useState(false);
  const [blink, setBlink]       = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setBlink((p) => !p), 500);
    return () => clearTimeout(t);
  }, [blink]);

  useEffect(() => {
    const phrase = `${phrases[index].greeting} ${phrases[index].name}`;
    if (subIndex === phrase.length + 1 && !reverse) {
      const t = setTimeout(() => setReverse(true), 2000);
      return () => clearTimeout(t);
    }
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((p) => (p + 1) % phrases.length);
      return;
    }
    const t = setTimeout(
      () => setSubIndex((p) => p + (reverse ? -1 : 1)),
      reverse ? 30 : 60
    );
    return () => clearTimeout(t);
  }, [subIndex, index, reverse]);

  const greetingLen = phrases[index].greeting.length;
  const full        = `${phrases[index].greeting} ${phrases[index].name}`;
  const visible     = full.substring(0, subIndex);

  return (
    <h1 className="text-[32px] md:text-[52px] lg:text-[68px] font-bold tracking-tight leading-tight min-h-[1.5em] flex flex-wrap justify-center items-center gap-x-3">
      <span className="text-[var(--muted)]">
        {visible.substring(0, Math.min(subIndex, greetingLen))}
      </span>
      {subIndex > greetingLen && (
        <span className="text-[var(--foreground)]">
          {visible.substring(greetingLen + 1)}
        </span>
      )}
      <span
        className={`inline-block w-[3px] h-[1em] bg-[var(--accent-blue)] ml-1 transition-opacity duration-100 ${
          blink ? "opacity-100" : "opacity-0"
        }`}
      />
    </h1>
  );
};

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <section className="relative min-h-screen flex flex-col items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-[var(--card-bg)] animate-pulse" />
      </section>
    );
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center pt-24 md:pt-28 pb-16 overflow-hidden"
    >
      {/* Avatar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-2 flex justify-center z-10"
      >
        <Image
          src="/avatar-nobg.png"
          alt="Anish Shirodkar"
          width={380}
          height={380}
          className="object-contain drop-shadow-2xl"
          priority
        />
      </motion.div>

      {/* Greeting + metadata */}
      <div className="text-center relative z-10 px-4">
        <Typewriter />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="mt-4 flex flex-wrap justify-center gap-4"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.45em] text-[var(--muted)] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)]" />
            MSCS @ Rutgers
          </span>
          <span className="opacity-20 hidden md:block text-[var(--muted)]">/</span>
          <span className="text-[10px] font-black uppercase tracking-[0.45em] text-[var(--muted)] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-purple)]" />
            AI / ML Engineer
          </span>
        </motion.div>

      </div>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.7 }}
        className="flex flex-wrap justify-center gap-4 mt-7 relative z-10"
      >
        <a
          href="https://bit.ly/resume_anish"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-tech-primary"
        >
          <FileText size={14} className="brightness-[3] text-[var(--accent-blue)]" />
          <span>Resume</span>
        </a>
        <a href="#contact" className="btn-tech-secondary">
          <Send size={14} className="text-[var(--accent-purple)]" />
          <span>Connect</span>
        </a>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-14 flex flex-wrap justify-center gap-4 md:gap-6 relative z-10 px-6"
      >
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05 + i * 0.08, duration: 0.5 }}
            className="flex flex-col items-center gap-0.5 px-5 py-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-sm"
          >
            <span
              className="text-lg md:text-xl font-black tracking-tight"
              style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              <CountUp to={s.to} format={s.fmt} />
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--muted)] text-center leading-tight">
              {s.label}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10"
      >
        <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--muted)] opacity-40">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={14} className="text-[var(--muted)] opacity-40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
