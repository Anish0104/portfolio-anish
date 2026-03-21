"use client";

import React from "react";
import SubPageLayout from "@/components/SubPageLayout";
import { motion } from "framer-motion";
import { Microscope, ExternalLink, Calendar, Users, Target, FileText, Award } from "lucide-react";

const publications = [
  {
    title: "Smart Weather Forecasting: IoT-Integrated Decision Support System for Real-Time Analysis",
    type: "IP India Patent (Publication)",
    year: "2025",
    description: "Developed a mission-critical weather forecasting system utilizing Attention-based LSTM networks for high-precision rainfall prediction. Integrated IoT-sensor data with historical imagery to provide real-time decision support for meteorological departments.",
    authors: ["Shirodkar, A. V.", "IMD Research Team"],
    tags: ["Deep Learning", "IoT", "Meteorology", "LSTM"],
    doi: "Pending - IP India 2025 Release",
    documents: [
      { label: "Research Paper", icon: "paper", path: "/research-paper.pdf" },
      { label: "Copyright Certificate", icon: "cert", path: "/copyright-cert.pdf" },
    ],
  },
];

export default function PublicationsPage() {
  return (
    <SubPageLayout
      title="Publications"
      subtitle="A collection of my published research and patents, focusing on pushing the boundaries of AI in meteorology and intelligent systems."
    >
      <div className="space-y-12">
        {publications.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-8 md:p-12 glass-card relative overflow-hidden group"
          >
            {/* Background Glow */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] group-hover:bg-orange-500/10 transition-colors" />

            <div className="flex flex-col md:flex-row gap-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl border-2 border-orange-500/30 flex items-center justify-center shrink-0 bg-orange-500/5">
                <Microscope size={32} className="text-orange-400" />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-[10px] font-black uppercase tracking-widest border border-orange-500/20">
                    {item.type}
                  </span>
                  <div className="flex items-center gap-1.5 text-[var(--muted)] text-[10px] font-black uppercase tracking-widest">
                    <Calendar size={12} /> {item.year}
                  </div>
                </div>

                <h3 className="text-3xl font-black tracking-tight mb-6 text-white group-hover:text-orange-400 transition-colors leading-tight">
                  {item.title}
                </h3>

                <p className="text-[var(--muted)] text-lg leading-relaxed mb-8 font-medium">
                  {item.description}
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-10">
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white mb-4">
                      <Users size={14} className="text-orange-400" /> Authors
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {item.authors.map((author) => (
                        <span key={author} className="text-sm text-[var(--muted)] font-bold">{author}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white mb-4">
                      <Target size={14} className="text-orange-400" /> Research Focus
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-black text-[var(--muted)] border border-white/10">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Documents Row */}
                <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-white/5">
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mr-auto">
                    ID: {item.doi}
                  </div>
                  {item.documents.map((doc) => (
                    <a
                      key={doc.label}
                      href={doc.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-orange-500/20 bg-orange-500/5 text-orange-400 hover:bg-orange-500/15 hover:border-orange-500/40 transition-all text-[11px] font-black uppercase tracking-widest"
                    >
                      {doc.icon === "cert" ? <Award size={13} /> : <FileText size={13} />}
                      {doc.label}
                      <ExternalLink size={11} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </SubPageLayout>
  );
}
