"use client";

import React from "react";
import SubPageLayout from "@/components/SubPageLayout";
import { motion } from "framer-motion";
import { Award, ShieldCheck, CheckCircle2, Calendar, ExternalLink, FileText } from "lucide-react";

const certs = [
  {
    title: "MCP: Advanced Topics",
    issuer: "Anthropic · Skilljar",
    date: "2025",
    description: "Mastered advanced Model Context Protocol concepts including multi-server orchestration, resource management, and building production-grade AI tool integrations.",
    skills: ["MCP", "Multi-server Orchestration", "AI Tool Integration", "LLM Infrastructure"],
    color: "purple",
    link: "http://verify.skilljar.com/c/e2fnw8e3rqzj",
  },
  {
    title: "Introduction to Agent Skills",
    issuer: "Anthropic · Skilljar",
    date: "2025",
    description: "Completed foundational training on building and deploying intelligent agent skills, covering prompt engineering, tool use, and agentic workflows.",
    skills: ["Agent Design", "Tool Use", "Prompt Engineering", "Agentic Workflows"],
    color: "cyan",
    link: "http://verify.skilljar.com/c/6eoywixe3fv3",
  },
  {
    title: "AWS Educate: Getting Started with Compute",
    issuer: "Amazon Web Services",
    date: "2025",
    description: "Earned an AWS Educate Training Badge validating foundational knowledge of cloud compute services including EC2, Lambda, and container deployments.",
    skills: ["EC2", "Lambda", "Cloud Compute", "AWS"],
    color: "orange",
    link: "https://www.credly.com/badges/31cbadf2-2174-4dd5-aace-7a44580e5997/linked_in_profile",
  },
  {
    title: "Fundamentals of LLMs - The LLM Course",
    issuer: "Hugging Face",
    date: "2026-03-12",
    description: "Certified completion of the Fundamentals of LLMs module in The LLM Course by Hugging Face Instructors - covering transformer architectures, tokenization, and modern LLM training paradigms.",
    skills: ["Transformers", "Tokenization", "LLM Training", "Hugging Face Hub"],
    color: "yellow",
    link: "/cert-hf.png",
    image: "/cert-hf.png",
  },
];

const colorMap: Record<string, { border: string; bg: string; icon: string; glow: string; badge: string }> = {
  purple: {
    border: "border-purple-500/30",
    bg: "bg-purple-500/5",
    icon: "text-purple-400",
    glow: "bg-purple-500/10 group-hover:bg-purple-500/20",
    badge: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  },
  cyan: {
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/5",
    icon: "text-cyan-400",
    glow: "bg-cyan-500/10 group-hover:bg-cyan-500/20",
    badge: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  },
  orange: {
    border: "border-orange-500/30",
    bg: "bg-orange-500/5",
    icon: "text-orange-400",
    glow: "bg-orange-500/10 group-hover:bg-orange-500/20",
    badge: "bg-orange-500/10 text-orange-300 border-orange-500/20",
  },
  yellow: {
    border: "border-yellow-500/30",
    bg: "bg-yellow-500/5",
    icon: "text-yellow-400",
    glow: "bg-yellow-500/10 group-hover:bg-yellow-500/20",
    badge: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  },
};

export default function CertificationsPage() {
  return (
    <SubPageLayout
      title="Certifications"
      subtitle="Professional validation of technical expertise in AI Agents, LLM infrastructure, and cloud computing."
    >
      <div className="grid md:grid-cols-2 gap-6">
        {certs.map((cert, idx) => {
          const c = colorMap[cert.color];
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-8 flex flex-col group relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-3xl transition-colors ${c.glow}`} />

              <div className="flex items-center justify-between mb-8">
                <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center ${c.border} ${c.bg}`}>
                  <Award size={24} className={c.icon} />
                </div>
                <div className="flex items-center gap-1.5 text-[var(--muted)] text-[10px] font-black uppercase tracking-widest">
                  <Calendar size={12} /> {cert.date}
                </div>
              </div>

              <h3 className="text-2xl font-black tracking-tight mb-2 text-white group-hover:text-blue-400 transition-colors">
                {cert.title}
              </h3>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-6 border-b border-white/5 pb-4 ${c.icon}`}>
                {cert.issuer}
              </p>

              <p className="text-[var(--muted)] text-sm leading-relaxed mb-8 flex-1 font-medium">
                {cert.description}
              </p>

              <div className="space-y-4 mb-8">
                <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                  <ShieldCheck size={12} className="text-blue-500" /> Validated Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {cert.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${c.badge}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#98C379]">
                  <CheckCircle2 size={12} /> Verified
                </span>

                {cert.link ? (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    View Certificate <ExternalLink size={12} />
                  </a>
                ) : (
                  <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/20">
                    <FileText size={12} /> PDF on file
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </SubPageLayout>
  );
}
