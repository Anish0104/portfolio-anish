"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, User, Briefcase, Cpu, Code, Joystick, Award, Mail,
  FileText, Github, Linkedin, Copy, Check, ArrowRight, Command, Search,
} from "lucide-react";

type Cmd = {
  id:       string;
  label:    string;
  category: "Navigate" | "Actions";
  icon:     React.ElementType;
  action:   () => void;
  kbd?:     string;
};

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: "smooth" });
};

export default function CommandPalette() {
  const [open,   setOpen]   = useState(false);
  const [query,  setQuery]  = useState("");
  const [cursor, setCursor] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef            = useRef<HTMLInputElement>(null);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText("avs181@scarletmail.rutgers.edu");
    setCopied(true);
    setTimeout(() => { setCopied(false); setOpen(false); }, 1200);
  }, []);

  const CMDS: Cmd[] = [
    { id: "home",         label: "Home",             category: "Navigate", icon: Home,                  action: () => { scrollTo("home");         setOpen(false); }, kbd: "H" },
    { id: "about",        label: "About",            category: "Navigate", icon: User,                  action: () => { scrollTo("about");        setOpen(false); }, kbd: "A" },
    { id: "experience",   label: "Journey",          category: "Navigate", icon: Briefcase,             action: () => { scrollTo("experience");   setOpen(false); }, kbd: "J" },
    { id: "skills",       label: "Tech Stack",       category: "Navigate", icon: Cpu,                   action: () => { scrollTo("skills");       setOpen(false); }, kbd: "T" },
    { id: "projects",     label: "Works",            category: "Navigate", icon: Code,                  action: () => { scrollTo("projects");     setOpen(false); }, kbd: "W" },
    { id: "game",         label: "Lab",              category: "Navigate", icon: Joystick,              action: () => { scrollTo("game");         setOpen(false); }, kbd: "L" },
    { id: "achievements", label: "Achievements",     category: "Navigate", icon: Award,                 action: () => { scrollTo("achievements"); setOpen(false); }, kbd: "M" },
    { id: "contact",      label: "Contact",          category: "Navigate", icon: Mail,                  action: () => { scrollTo("contact");      setOpen(false); }, kbd: "C" },
    { id: "resume",       label: "Open Resume",      category: "Actions",  icon: FileText,              action: () => { window.open("https://bit.ly/resume_anish", "_blank"); setOpen(false); } },
    { id: "github",       label: "GitHub Profile",   category: "Actions",  icon: Github,                action: () => { window.open("https://github.com/Anish0104", "_blank"); setOpen(false); } },
    { id: "linkedin",     label: "LinkedIn Profile", category: "Actions",  icon: Linkedin,              action: () => { window.open("https://linkedin.com/in/anish-shirodkar", "_blank"); setOpen(false); } },
    { id: "email",        label: copied ? "Copied!" : "Copy Email", category: "Actions", icon: copied ? Check : Copy, action: handleCopy },
  ];

  const filtered = query.trim()
    ? CMDS.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase())
      )
    : CMDS;

  const groups = filtered.reduce<Record<string, Cmd[]>>((acc, c) => {
    (acc[c.category] ??= []).push(c);
    return acc;
  }, {});

  useEffect(() => { setCursor(0); }, [query]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "/") { e.preventDefault(); setOpen(p => !p); }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  useEffect(() => {
    if (open) { setQuery(""); setCursor(0); setTimeout(() => inputRef.current?.focus(), 60); }
  }, [open]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor(p => Math.min(p + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setCursor(p => Math.max(p - 1, 0)); }
    else if (e.key === "Enter")   { filtered[cursor]?.action(); }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cp-bg"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[400] bg-black/50 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            key="cp-panel"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[16vh] left-1/2 -translate-x-1/2 z-[401] w-[min(560px,calc(100vw-2rem))] rounded-2xl overflow-hidden shadow-2xl border border-[var(--card-border)]"
            style={{ background: "var(--card-bg)" }}
          >
            {/* Search bar */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--card-border)]">
              <Search size={14} className="text-[var(--muted)] opacity-50 flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type a command or search…"
                className="flex-1 bg-transparent outline-none text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] placeholder:opacity-40"
                spellCheck={false}
                autoComplete="off"
              />
              <kbd className="text-[9px] px-1.5 py-0.5 rounded-md border border-[var(--card-border)] text-[var(--muted)] opacity-30 font-mono">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[360px] overflow-y-auto py-2">
              {Object.entries(groups).map(([cat, cmds]) => (
                <div key={cat}>
                  <p className="px-5 pt-3 pb-1.5 text-[9px] font-black uppercase tracking-[0.35em] text-[var(--muted)] opacity-40">
                    {cat}
                  </p>
                  {cmds.map(cmd => {
                    const idx    = filtered.indexOf(cmd);
                    const active = idx === cursor;
                    const Icon   = cmd.icon;
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => cmd.action()}
                        onMouseEnter={() => setCursor(idx)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-75"
                        style={{ background: active ? "var(--card-border)" : "transparent" }}
                      >
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                          style={{
                            background: active ? "rgba(8,145,178,0.15)" : "rgba(128,128,128,0.07)",
                            color:      active ? "#06b6d4"              : "var(--muted)",
                          }}
                        >
                          <Icon size={14} />
                        </div>
                        <span className="flex-1 text-[13px] font-medium text-[var(--foreground)]">
                          {cmd.label}
                        </span>
                        {cmd.kbd && (
                          <kbd className="text-[9px] px-1.5 py-0.5 rounded-md border border-[var(--card-border)] text-[var(--muted)] opacity-30 font-mono hidden sm:block">
                            {cmd.kbd}
                          </kbd>
                        )}
                        {active && (
                          <ArrowRight size={12} style={{ color: "#06b6d4", opacity: 0.7 }} className="flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="px-5 py-10 text-center text-[13px] text-[var(--muted)] opacity-40">
                  No results for &ldquo;{query}&rdquo;
                </div>
              )}
            </div>

            {/* Footer hints */}
            <div className="flex items-center gap-4 px-5 py-2.5 border-t border-[var(--card-border)]">
              {(["↑↓ navigate", "↵ select", "esc close"] as const).map(hint => {
                const [key, ...rest] = hint.split(" ");
                return (
                  <div key={hint} className="flex items-center gap-1.5 text-[9px] text-[var(--muted)] opacity-30">
                    <kbd className="font-mono px-1 py-0.5 rounded border border-[var(--card-border)]">{key}</kbd>
                    <span>{rest.join(" ")}</span>
                  </div>
                );
              })}
              <div className="ml-auto flex items-center gap-1 text-[9px] text-[var(--muted)] opacity-25">
                <Command size={9} /><span>/</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
