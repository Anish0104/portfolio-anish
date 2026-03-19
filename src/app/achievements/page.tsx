"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Award, FileText } from "lucide-react";

const certificates = [
  {
    title: "Model Context Protocol: Advanced Topics",
    description: "Mastered advanced MCP concepts including multi-server orchestration, resource management, and building production-grade AI tool integrations.",
    issuerId: "Anthropic · Skilljar",
    link: "http://verify.skilljar.com/c/e2fnw8e3rqzj",
    color: "from-purple-500/30 to-purple-900/10",
    iconColor: "text-purple-400",
    accentColor: "bg-purple-500",
  },
  {
    title: "Introduction to Agent Skills",
    description: "Completed foundational training on building and deploying intelligent agent skills, covering prompt engineering, tool use, and agentic workflows.",
    issuerId: "Anthropic · Skilljar",
    link: "http://verify.skilljar.com/c/6eoywixe3fv3",
    color: "from-cyan-500/30 to-cyan-900/10",
    iconColor: "text-cyan-400",
    accentColor: "bg-cyan-500",
  },
  {
    title: "AWS Educate: Getting Started with Compute",
    description: "Earned an AWS Educate Training Badge validating foundational knowledge of cloud compute services including EC2, Lambda, and container-based deployments.",
    issuerId: "Issued by Amazon Web Services",
    link: "https://www.credly.com/badges/31cbadf2-2174-4dd5-aace-7a44580e5997/linked_in_profile",
    color: "from-orange-500/30 to-orange-900/10",
    iconColor: "text-orange-400",
    accentColor: "bg-orange-500",
    embedUrl: "https://www.credly.com/badges/31cbadf2-2174-4dd5-aace-7a44580e5997/embedded",
  },
  {
    title: "Fundamentals of LLMs - The LLM Course",
    description: "Certified completion of the Fundamentals of LLMs module in The LLM Course by Hugging Face Instructors - covering transformer architectures, tokenization, and modern LLM training paradigms.",
    issuerId: "Hugging Face Instructors",
    link: "/cert-hf.png",
    image: "/cert-hf.png",
    color: "from-yellow-500/30 to-yellow-900/10",
    iconColor: "text-yellow-400",
    accentColor: "bg-yellow-500",
  },
];

export default function AchievementsPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <Link
          href="/"
          className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-20 w-fit"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Back to home</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-32">
          <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-6 block">
            Milestones &amp; Victories
          </span>
          <h1 className="text-7xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-none">
            My <span className="text-orange-500">Achievements</span>
          </h1>
          <p className="text-white/40 text-xl font-medium max-w-2xl mx-auto">
            From code to peaks, every achievement tells a story of dedication.
          </p>
        </div>

        {/* Detailed Cards */}
        <div className="space-y-12">
          {certificates.map((cert, idx) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="group flex flex-col md:flex-row rounded-[2.5rem] bg-[#0A0A0B]/80 border border-white/5 overflow-hidden hover:border-white/10 transition-colors"
            >
              {/* Visual Left Panel */}
              <div
                className={`md:w-5/12 relative min-h-[280px] md:min-h-[360px] bg-gradient-to-br ${cert.color} flex items-center justify-center overflow-hidden`}
              >
                <div className="absolute inset-0 bg-dot-grid opacity-10" />

                {/* AWS: embed the Credly badge iframe */}
                {cert.embedUrl ? (
                  <div className="relative z-10 w-full h-full flex items-center justify-center p-8">
                    <iframe
                      src={cert.embedUrl}
                      title="AWS Educate Badge"
                      className="w-full max-w-[260px] h-[260px] rounded-2xl border border-white/10 bg-transparent"
                      frameBorder="0"
                      scrolling="no"
                      allowFullScreen
                    />
                  </div>
                ) : cert.image ? (
                  /* Actual certificate image */
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative z-10 w-full max-w-[340px] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                  >
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-auto object-contain"
                    />
                  </motion.div>
                ) : (
                  /* Generic stylised certificate display */
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative z-10 w-[240px] h-[170px] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm flex flex-col items-center justify-center gap-4 shadow-2xl"
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-white/10 ${cert.iconColor}`}>
                      <Award size={28} />
                    </div>
                    <div className="text-center px-4">
                      <p className="text-white/80 text-xs font-black uppercase tracking-widest leading-tight">
                        Certificate of Completion
                      </p>
                      <p className={`text-[10px] font-mono mt-1 ${cert.iconColor}`}>{cert.issuerId}</p>
                    </div>
                    <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl ${cert.accentColor} opacity-60`} />
                  </motion.div>
                )}
              </div>

              {/* Text Segment */}
              <div className="md:w-7/12 p-10 md:p-16 flex flex-col justify-center">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter leading-tight">
                  {cert.title}
                </h2>
                <p className="text-lg text-white/50 leading-relaxed mb-10 font-medium">
                  {cert.description}
                </p>

                <div className="flex items-center justify-between pt-10 border-t border-white/5">
                  <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                    {cert.issuerId}
                  </span>

                  {cert.link ? (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-black text-orange-500 hover:text-orange-400 transition-colors uppercase tracking-widest"
                    >
                      View Certificate <ExternalLink size={14} />
                    </a>
                  ) : (
                    <span className="flex items-center gap-2 text-xs font-black text-white/20 uppercase tracking-widest">
                      <FileText size={14} /> PDF on file
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
