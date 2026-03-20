"use client";

import React, { useState, useEffect } from "react";
import SectionHeading from "./SectionHeading";
import { motion } from "framer-motion";
import { Send, Mail, Github, Linkedin, Twitter, ArrowUpRight, MapPin, Clock } from "lucide-react";
import Magnetic from "./ui/magnetic";

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    handle: "@anish0104",
    href: "https://github.com/anish0104",
    icon: Github,
    color: "#ffffff",
  },
  {
    label: "LinkedIn",
    handle: "anish-shirodkar",
    href: "https://linkedin.com/in/anish-shirodkar",
    icon: Linkedin,
    color: "#0A66C2",
  },
  {
    label: "Email",
    handle: "avs181@scarletmail.rutgers.edu",
    href: "mailto:avs181@scarletmail.rutgers.edu",
    icon: Mail,
    color: "#a855f7",
  },
];

export default function Contact() {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [estTime, setEstTime] = useState("");

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      setEstTime(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "America/New_York",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(new Date())
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    formData.append("access_key", "e0635982-b4e2-4aab-9970-a678016f8b36");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (!mounted) return null;

  return (
    <section id="contact" className="py-32 relative">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <SectionHeading title="Connect" centered />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="grid lg:grid-cols-2 gap-8 items-start"
        >
          {/* LEFT — CTA + Social + Status */}
          <div className="space-y-8">
            {/* Hero text */}
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-[var(--foreground)] leading-none uppercase">
                Let&apos;s Build<br />
                <span className="text-[var(--muted)]">Something</span><br />
                Together.
              </h2>
              <p className="text-[var(--muted)] text-sm font-medium leading-relaxed max-w-sm">
                Open to AI/ML Research & Software Engineering opportunities. I reply within 24 hours.
              </p>
            </div>

            {/* Status pill */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--foreground)]">
                Available for work
              </span>
            </div>

            {/* Location + Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-2">
                <div className="flex items-center gap-2 text-[var(--accent-blue)]">
                  <MapPin size={14} />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em]">Location</span>
                </div>
                <p className="text-sm font-bold text-[var(--foreground)] tracking-tight">New Jersey, USA</p>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-2">
                <div className="flex items-center gap-2 text-[var(--accent-purple)]">
                  <Clock size={14} />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em]">Local Time</span>
                </div>
                <p className="text-sm font-bold text-[var(--foreground)] tracking-tight">{estTime} ET</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--muted)]">Find me on</p>
              {SOCIAL_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-5 py-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--accent-blue)]/40 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: `${link.color}15`, border: `1px solid ${link.color}30` }}
                      >
                        <Icon size={16} style={{ color: link.color }} />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-[var(--foreground)]">{link.label}</p>
                        <p className="text-[10px] font-medium text-[var(--muted)]">{link.handle}</p>
                      </div>
                    </div>
                    <ArrowUpRight
                      size={14}
                      className="text-[var(--muted)] group-hover:text-[var(--foreground)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                    />
                  </a>
                );
              })}
            </div>
          </div>

          {/* RIGHT — Contact Form */}
          <div className="relative">
            {/* Subtle accent glow */}
            <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-br from-[var(--accent-blue)]/10 via-transparent to-[var(--accent-purple)]/10 pointer-events-none" />

            <div className="relative p-8 md:p-10 rounded-[2rem] bg-[var(--card-bg)] border border-[var(--card-border)]">
              {/* Form header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-9 h-9 rounded-xl bg-[var(--accent-blue)]/10 border border-[var(--accent-blue)]/20 flex items-center justify-center">
                  <Mail size={16} className="text-[var(--accent-blue)]" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent-blue)]">Send a message</p>
                  <p className="text-[11px] text-[var(--muted)] font-medium">I&apos;ll get back to you soon</p>
                </div>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-[var(--muted)] mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Your Name"
                      className="w-full bg-[var(--background)]/50 border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] text-sm font-medium outline-none focus:border-[var(--accent-blue)]/50 transition-all placeholder:text-[var(--muted)]/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-[var(--muted)] mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="your@email.com"
                      className="w-full bg-[var(--background)]/50 border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] text-sm font-medium outline-none focus:border-[var(--accent-blue)]/50 transition-all placeholder:text-[var(--muted)]/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-[var(--muted)] mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Internship Opportunity / Collaboration / Other"
                    className="w-full bg-[var(--background)]/50 border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] text-sm font-medium outline-none focus:border-[var(--accent-blue)]/50 transition-all placeholder:text-[var(--muted)]/40"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-[var(--muted)] mb-2">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell me about your project or opportunity..."
                    className="w-full bg-[var(--background)]/50 border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] text-sm font-medium outline-none focus:border-[var(--accent-blue)]/50 transition-all resize-none placeholder:text-[var(--muted)]/40"
                  />
                </div>

                <Magnetic strength={0.08}>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.99] border ${
                      status === "success"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : status === "error"
                        ? "bg-red-500/10 border-red-500/30 text-red-400"
                        : "bg-[var(--foreground)] text-[var(--background)] border-transparent hover:opacity-90"
                    }`}
                  >
                    {status === "loading"
                      ? "Sending..."
                      : status === "success"
                      ? "✓ Message Sent!"
                      : status === "error"
                      ? "Failed — Try Again"
                      : "Send Message"}
                    {status === "idle" && <Send size={13} />}
                  </button>
                </Magnetic>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
