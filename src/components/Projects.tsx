"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, ArrowRight } from "lucide-react";
import NextImage from "next/image";
import SectionHeading from "./SectionHeading";

const projects = [
  {
    number: "01",
    tag: "COMPUTER VISION",
    title: "Vtrack",
    description: "Multi-class object detection pipeline (YOLOv8, ByteTrack) achieving 25-30 FPS with real-time speed estimation and 3D dashboard integration.",
    image: "/project-vtrack.png", 
    gradient: "from-orange-500/20 to-orange-600/40",
    accent: "bg-orange-500",
    tech: ["YOLOv8", "BYTETRACK", "FASTAPI", "R3F", "SUPABASE"],
    github: "https://github.com/Anish0104/Vtrack-Traffic_Analysis_System",
    link: "https://vtrack-traffic-analysis-system.vercel.app/",
  },
  {
    number: "02",
    tag: "AI ASSISTANT",
    title: "SkillGap",
    description: "AI career simulator using Gemini 2.5 Flash for multi-turn technical interviews and structured performance evaluation based on resume-job gaps.",
    image: "/project-skillgap.png",
    gradient: "from-blue-500/20 to-blue-600/40",
    accent: "bg-blue-500",
    tech: ["NEXT.JS 15", "GEMINI 2.5", "SUPABASE", "PDF.JS"],
    github: "https://github.com/Anish0104/SkillGap",
    link: "https://skillgapai.vercel.app/",
  },
  {
    number: "03",
    tag: "NLP / RAG",
    title: "DocPilot",
    description: "RAG pipeline for millisecond-latency Q&A over 500+ documentation pages, utilizing Llama 3.1 and ChromaDB for hallucination-reduced inference.",
    image: "/project-docpilot.png",
    gradient: "from-emerald-500/20 to-emerald-600/40",
    accent: "bg-emerald-500",
    tech: ["LLAMA 3.1", "CHROMADB", "HUGGINGFACE", "STREAMLIT"],
    github: "https://github.com/Anish0104/DocPilot",
    link: "https://docpilot-ai.streamlit.app/",
  },
  {
    number: "04",
    tag: "QUANT FINANCE",
    title: "QuantVision",
    description: "Backtesting pipeline that generates trading signals, evaluates cumulative returns vs buy-and-hold, and tunes parameters for strategy optimization across historical price data.",
    image: "/project-trading.png",
    gradient: "from-violet-500/20 to-violet-600/40",
    accent: "bg-violet-500",
    tech: ["PYTHON", "PANDAS", "NUMPY", "MATPLOTLIB", "JUPYTER"],
    github: "https://github.com/Anish0104/QuantVision",
    link: "https://quant-vision.vercel.app",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-20 bg-transparent relative overflow-hidden transition-colors duration-500">
      <div className="container mx-auto px-6">
        
        <SectionHeading 
          title="Featured Projects"
          centered
        />

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-24 max-w-7xl mx-auto">
          {projects.map((project, idx) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="group relative"
            >
              {/* Project Card */}
              <div className="relative aspect-[16/11] rounded-[3rem] bg-[var(--card-bg)] border border-[var(--card-border)] overflow-hidden p-1 bg-gradient-to-br from-[var(--foreground)]/5 to-transparent">
                 <div className="absolute inset-0 bg-[var(--background)] rounded-[2.9rem] m-[1px] opacity-100 dark:opacity-40" />
                 
                 {/* Visual Background Gradient */}
                 <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-10 group-hover:opacity-30 transition-opacity duration-700`} />
                 
                 {/* Content Wrapper */}
                 <div className="relative h-full flex flex-col p-10 z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                            <span className="text-[12px] font-black text-[var(--foreground)]/10">{project.number}</span>
                            <div className={`w-2 h-2 rounded-full ${project.accent} shadow-[0_0_15px_rgba(0,0,0,0.1)]`} />
                            <span className="text-[10px] font-black text-[var(--muted)]/60 uppercase tracking-widest">{project.tag}</span>
                        </div>
                        <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0">
                            {project.github && (
                                <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--muted)] hover:text-[var(--foreground)] transition-all" title="View Github">
                                    <Github size={18} />
                                </a>
                            )}
                            {project.link && (
                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--muted)] hover:text-[var(--foreground)] transition-all" title="Live Demo">
                                    <ExternalLink size={18} />
                                </a>
                            )}
                        </div>
                    </div>

                    <h3 className="text-xl md:text-2xl font-black text-[var(--foreground)] mb-2 tracking-tighter group-hover:translate-x-2 transition-transform duration-500 uppercase">{project.title}</h3>
                    <p className="text-[var(--muted)] text-[12px] md:text-[13px] font-medium leading-relaxed max-w-full md:max-w-[90%] mb-6">
                        {project.description}
                    </p>

                    {/* Tech Stack Chips */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                        {project.tech.map(t => (
                        <span key={t} className="px-3 py-1 rounded-full bg-[var(--foreground)]/[0.03] border border-[var(--card-border)] text-[9px] font-black text-[var(--muted)] tracking-widest uppercase">
                            {t}
                        </span>
                        ))}
                    </div>
                    
                    {/* Perspective Image / Decoration */}
                    <div className="absolute -bottom-8 -right-8 md:-bottom-10 md:-right-10 w-1/2 md:w-2/3 aspect-video bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] rounded-tl-2xl md:rounded-tl-3xl shadow-2xl skew-x-[-10deg] skew-y-[5deg] group-hover:skew-x-0 group-hover:skew-y-0 transition-all duration-700 pointer-events-none overflow-hidden">
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                         <img 
                           src={project.image} 
                           alt={project.title}
                           className="w-full h-full object-cover object-top opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                         />
                    </div>
                 </div>
              </div>

              {/* View Project Floating Label */}
              <div className="mt-8 flex items-center justify-between px-4">
                 <a 
                   href={project.link || project.github} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="flex items-center gap-2 group/btn cursor-pointer"
                 >
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground)] group-hover:text-[var(--accent-blue)] transition-colors">
                        {project.link ? "Live Demo" : "View Source"}
                    </span>
                    <ArrowRight size={14} className="text-[var(--foreground)] group-hover:text-[var(--accent-blue)] transform group-hover:translate-x-1 transition-all" />
                 </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
