"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Command, Linkedin, Github, Mail, Send, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────────── */
type Message = {
  role: "system" | "user" | "assistant";
  content: string | React.ReactNode;
};

/* ─── Help panel ────────────────────────────────────────── */
function HelpMessage() {
  return (
    <div className="flex flex-col gap-1 mt-1 mb-2">
      <div className="text-[var(--terminal-accent)] font-bold mb-2 flex items-center gap-2 text-xs">
        <Command size={13} /> Available commands
      </div>
      <div className="grid grid-cols-[100px_1fr] gap-y-1.5 gap-x-3">
        {[
          ["about",   "Who Anish is"],
          ["work",    "Experience & projects"],
          ["skills",  "Technical stack"],
          ["contact", "Get in touch"],
          ["clear",   "Reset conversation"],
          ["sudo",    "Try your luck"],
        ].map(([cmd, desc]) => (
          <React.Fragment key={cmd}>
            <span className="text-[var(--terminal-user)] text-[11px] font-bold uppercase tracking-wide">{cmd}</span>
            <span className="text-[var(--terminal-output)] text-[11px] opacity-70">{desc}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ─── Contact cards ─────────────────────────────────────── */
function ContactMessage() {
  return (
    <div className="flex flex-col gap-2 mt-1">
      <p className="text-[var(--terminal-output)] text-xs mb-1">Opening secure channels…</p>
      {[
        { href: "https://linkedin.com/in/anish-shirodkar", icon: Linkedin, label: "LinkedIn", sub: "anish-shirodkar", color: "text-blue-500" },
        { href: "https://github.com/Anish0104",            icon: Github,   label: "GitHub",   sub: "Anish0104",       color: "text-[var(--foreground)]" },
        { href: "mailto:avs181@scarletmail.rutgers.edu",   icon: Mail,     label: "Email",    sub: "avs181@scarletmail.rutgers.edu", color: "text-red-500" },
      ].map(({ href, icon: Icon, label, sub, color }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--terminal-header)] border border-[var(--card-border)] hover:border-[var(--accent-blue)]/40 hover:bg-[var(--accent-blue)]/5 transition-all"
        >
          <Icon size={14} className={color} />
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest text-[var(--muted)]">{label}</div>
            <div className="text-[11px] text-[var(--terminal-output)]">{sub}</div>
          </div>
        </a>
      ))}
    </div>
  );
}

/* ─── Responses ─────────────────────────────────────────── */
const responses: Record<string, React.ReactNode | string> = {
  about:
    "I'm Anish — an MS CS student at Rutgers specialising in ML, NLP, and AI engineering. I've shipped 4 production AI systems (computer vision, RAG pipelines, LLM apps) and hold a government-registered copyright for a weather-forecasting model (IP India, 2025).",
  work:
    "Key projects: VTrack (YOLOv8 + ByteTrack traffic analysis), SkillGap (Gemini 2.5 AI career simulator), DocPilot (LLaMA 3.1 RAG pipeline), QuantVision (PPO RL trading studio), Vouch (Auth0 AI-agent trust layer), VeritasAI (news aggregator agent). Check the Works section!",
  skills:
    "Python · PyTorch · TensorFlow · LangChain · RAG · YOLOv8 · Next.js · FastAPI · Supabase · Docker. Six categories of skills — head over to the Tech section for the full breakdown.",
  contact: <ContactMessage />,
  sudo: (
    <span className="text-[var(--terminal-error)] font-bold font-mono tracking-wide">
      [SUDO] Permission denied. Incident logged. Admin notified. 🚨
    </span>
  ),
};

/* ─── Initial messages ───────────────────────────────────── */
const initialMessages: Message[] = [
  {
    role: "system",
    content: (
      <div className="text-[var(--terminal-success)] flex items-start gap-2 text-xs font-bold">
        <Sparkles size={13} className="mt-0.5 flex-shrink-0" />
        <span className="uppercase tracking-widest leading-relaxed">
          Hi! I&apos;m APEX — Anish&apos;s Personal EXpert.
          Type <span className="text-[var(--terminal-accent)]">help</span> to see what I can do.
        </span>
      </div>
    ),
  },
];

/* ─── Sudo Danger Overlay ────────────────────────────────── */
function SudoDangerOverlay({ active }: { active: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {active && (
        <>
          {/* Red vignette */}
          <motion.div
            key="vignette"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 pointer-events-none"
            style={{
              zIndex: 99998,
              background: "radial-gradient(ellipse at center, transparent 40%, rgba(220,38,38,0.35) 100%)",
              boxShadow: "inset 0 0 120px rgba(220,38,38,0.5)",
            }}
          />

          {/* Scanlines */}
          <motion.div
            key="scanlines"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none"
            style={{
              zIndex: 99998,
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(220,38,38,0.04) 2px, rgba(220,38,38,0.04) 4px)",
            }}
          />

          {/* Warning banner — above everything including navbar */}
          <motion.div
            key="banner"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 right-0 flex items-center justify-center gap-4 px-6 py-3 pointer-events-none"
            style={{ zIndex: 99999, background: "rgba(185,28,28,0.95)", backdropFilter: "blur(12px)" }}
          >
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.4, repeat: 4 }}>
              <ShieldAlert size={16} className="text-white" />
            </motion.div>
            <span className="font-mono font-black text-white text-[11px] tracking-[0.35em] uppercase">
              ⚠ Unauthorized Access Attempt — Incident Logged
            </span>
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.4, repeat: 4, delay: 0.1 }}>
              <ShieldAlert size={16} className="text-white" />
            </motion.div>
          </motion.div>

          {/* Flicker pulses */}
          {[0, 0.3, 0.6].map((delay) => (
            <motion.div
              key={`flicker-${delay}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.12, 0] }}
              transition={{ delay, duration: 0.15 }}
              className="fixed inset-0 pointer-events-none bg-red-600"
              style={{ zIndex: 99997 }}
            />
          ))}
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ─── Main component ─────────────────────────────────────── */
export default function FloatingChat() {
  const [open, setOpen]           = useState(false);
  const [messages, setMessages]   = useState<Message[]>(initialMessages);
  const [inputVal, setInputVal]   = useState("");
  const [isTyping, setIsTyping]   = useState(false);
  const [pulse, setPulse]         = useState(true);
  const [sudoAlert, setSudoAlert] = useState(false);
  const scrollRef                 = useRef<HTMLDivElement>(null);
  const inputRef                  = useRef<HTMLInputElement>(null);

  /* Stop pulse after first open */
  useEffect(() => {
    if (open) setPulse(false);
  }, [open]);

  /* Auto-scroll */
  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  /* Focus input when panel opens */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  /* Global Ctrl/Cmd+K shortcut */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((p) => !p);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const triggerSudoDanger = () => {
    /* Screen shake via CSS class on <html> */
    document.documentElement.classList.add("danger-shake");
    setTimeout(() => document.documentElement.classList.remove("danger-shake"), 700);

    setSudoAlert(true);
    setTimeout(() => setSudoAlert(false), 2800);
  };

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;

    if (t.toLowerCase() === "clear") {
      setMessages(initialMessages);
      setInputVal("");
      return;
    }

    setMessages((p) => [...p, { role: "user", content: t }]);
    setInputVal("");
    setIsTyping(true);

    const lo = t.toLowerCase();
    const isSudo = lo === "sudo";

    if (isSudo) triggerSudoDanger();

    setTimeout(() => {
      let content: React.ReactNode;

      if (lo === "help")                                     content = <HelpMessage />;
      else if (lo.includes("work") || lo.includes("proj"))  content = responses.work;
      else if (lo.includes("skill") || lo.includes("tech")) content = responses.skills;
      else if (lo.includes("about") || lo.includes("who"))  content = responses.about;
      else if (lo.includes("contact") || lo.includes("hire") || lo.includes("email")) content = responses.contact;
      else if (isSudo)                                       content = responses.sudo;
      else content = (
        <span className="text-[var(--terminal-error)]">
          Unknown command: <span className="font-bold">{t}</span>. Type <span className="font-bold text-[var(--terminal-accent)]">help</span>.
        </span>
      );

      setMessages((p) => [...p, { role: "assistant", content }]);
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 60);
    }, 400 + Math.random() * 350);
  };

  return (
    <>
      {/* ── Sudo danger overlay (portal-style fixed layer) ── */}
      <SudoDangerOverlay active={sudoAlert} />

      {/* ── Floating toggle button ── */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 260, damping: 22 }}
        onClick={() => setOpen((p) => !p)}
        className="fixed bottom-6 right-6 z-[200] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.04] active:scale-[0.97]"
        style={{
          background: "linear-gradient(135deg, #0891b2, #06b6d4)",
          color: "#fff",
        }}
        aria-label="Toggle APEX assistant"
      >
        {/* Pulse ring when unread */}
        {pulse && !open && (
          <motion.span
            className="absolute inset-0 rounded-2xl"
            animate={{ scale: [1, 1.18, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{ background: "linear-gradient(135deg, #0891b2, #06b6d4)" }}
          />
        )}

        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={16} strokeWidth={2.5} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <Sparkles size={16} strokeWidth={2} />
            </motion.div>
          )}
        </AnimatePresence>

        <span className="text-[11px] font-black uppercase tracking-[0.2em] relative">
          APEX
        </span>
      </motion.button>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-[5.5rem] right-6 z-[199] w-[min(380px,calc(100vw-2rem))] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-[var(--card-border)]"
            style={{ background: "var(--terminal-body)" }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-5 py-4 border-b border-[var(--card-border)]"
              style={{ background: "var(--terminal-header)" }}
            >
              {/* Traffic lights */}
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/30 border border-[#ff5f56]/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/30 border border-[#ffbd2e]/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/30 border border-[#27c93f]/50" />
              </div>
              {/* Gradient dot + name */}
              <div className="flex-1 flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#0891b2,#06b6d4)", boxShadow: "0 0 6px #06b6d480" }}
                />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)]">
                  APEX · Anish&apos;s Personal EXpert
                </span>
              </div>
              <span className="text-[9px] text-[var(--muted)] opacity-40 tracking-widest hidden sm:block">
                ⌘K
              </span>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-5 space-y-3 font-mono text-[13px] max-h-[360px] min-h-[200px]"
            >
              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className="leading-relaxed"
                  >
                    {msg.role === "user" ? (
                      <div className="flex items-start gap-2.5">
                        <span className="text-[var(--terminal-prompt)] font-black opacity-80 select-none">❯</span>
                        <span className="text-[var(--terminal-user)] font-bold">you</span>
                        <span className="text-[var(--terminal-command)] font-medium">{msg.content}</span>
                      </div>
                    ) : (
                      <div className={cn("pl-0 text-[var(--terminal-output)] font-medium")}>
                        {msg.content}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1.5 text-[var(--terminal-success)] text-xs font-bold tracking-wider uppercase italic opacity-60"
                >
                  {[0, 0.15, 0.3].map((d) => (
                    <motion.span
                      key={d}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: d }}
                    >
                      ·
                    </motion.span>
                  ))}
                  <span className="ml-1">APEX is thinking</span>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div
              className="flex items-center gap-2 px-4 py-3 border-t border-[var(--card-border)]"
              style={{ background: "var(--terminal-header)" }}
            >
              <span className="text-[var(--terminal-prompt)] font-black select-none text-sm">❯</span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send(inputVal)}
                disabled={isTyping}
                placeholder="Type a command…"
                spellCheck={false}
                autoComplete="off"
                className="flex-1 bg-transparent border-none outline-none text-[var(--terminal-command)] text-[13px] font-medium placeholder:text-[var(--muted)] placeholder:opacity-40 disabled:opacity-40"
              />
              <button
                onClick={() => send(inputVal)}
                disabled={!inputVal.trim() || isTyping}
                className="w-7 h-7 flex items-center justify-center rounded-lg disabled:opacity-30 transition-opacity hover:opacity-80"
                style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)", color: "#fff" }}
              >
                <Send size={12} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
