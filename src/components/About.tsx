"use client";

import React from "react";
import { motion } from "framer-motion";
import { Globe2, GraduationCap, Microscope } from "lucide-react";
import SectionHeading from "./SectionHeading";

export default function About() {
  const [estTime, setEstTime] = React.useState("");

  React.useEffect(() => {
    const updateTime = () => {
      setEstTime(new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(new Date()));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="about" className="py-32 bg-transparent relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <SectionHeading 
          title="About me"
          centered
        />

        <div className="flex flex-col items-center gap-20">
           {/* Mission & Bio */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="max-w-3xl text-center space-y-12"
           >
              <div className="space-y-8">
                 <h3 className="text-4xl md:text-5xl font-black text-[var(--foreground)] tracking-tighter leading-none uppercase">
                   Building Machines that <br/> <span className="text-[var(--muted)]">Understand the World.</span>
                 </h3>
                  <p className="text-xl text-[var(--muted)] leading-relaxed font-semibold italic border-l-2 md:border-l-0 md:border-t-2 border-[var(--accent-blue)]/20 pl-6 md:pl-0 md:pt-6">
                    "I build and ship end-to-end AI-powered systems - from computer vision pipelines to RAG-based NLP architectures."
                  </p>
                  <p className="text-lg text-[var(--muted)] leading-relaxed font-medium opacity-80">
                    Currently an M.S. CS candidate at Rutgers University, I specialize in ML, NLP, and AI engineering. My work bridges the gap between complex research and production-ready applications.
                  </p>
               </div>
            </motion.div>

           {/* Dashboard Grid (Bento Style) */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="w-full"
           >
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto">
                  
                  {/* LOCATION CARD */}
                  <div className="lg:col-span-6 lg:row-span-2 relative group p-8 rounded-[2rem] bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--accent-blue)]/20 transition-all duration-500 overflow-hidden">
                     <div className="space-y-6 relative z-10">
                        <div className="flex items-center gap-3 text-[var(--accent-blue)]">
                           <Globe2 size={20} />
                           <span className="text-[10px] font-black uppercase tracking-[0.4em]">Current HQ</span>
                        </div>
                        
                        <div className="space-y-2 text-left">
                           <h4 className="text-3xl font-black text-[var(--foreground)] tracking-tighter uppercase leading-none">New Jersey, USA</h4>
                           <div className="flex items-center gap-2 text-[var(--muted)] pt-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)]" />
                              <span className="text-[11px] font-black uppercase tracking-tighter">{estTime || "Loading..."} ET</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* EDUCATION CARD */}
                  <div className="lg:col-span-6 lg:row-span-1 relative group p-8 rounded-[2rem] bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--accent-blue)]/20 transition-all duration-500 min-h-[160px]">
                     <div className="flex items-center gap-3 mb-4 text-[var(--accent-blue)]">
                        <GraduationCap size={18} />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Education</span>
                     </div>
                     <div>
                        <h4 className="text-xl font-black text-[var(--foreground)] tracking-tighter uppercase mb-0.5">MSCS @ Rutgers</h4>
                        <p className="text-xs font-bold text-[var(--muted)] opacity-60 uppercase tracking-wide">Major in AI • GPA: 3.50</p>
                     </div>
                  </div>

                  {/* IMPACT CARD */}
                  <div className="lg:col-span-6 lg:row-span-1 relative group p-8 rounded-[2rem] bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--accent-blue)]/20 transition-all duration-500 flex items-center gap-6 min-h-[160px]">
                     <div className="p-4 rounded-2xl bg-[var(--accent-blue)]/5 border border-[var(--accent-blue)]/10 text-[var(--accent-blue)]">
                        <Microscope size={24} />
                     </div>

                     <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 text-[var(--accent-blue)] opacity-60 mb-1">
                           <span className="text-[9px] font-black uppercase tracking-[0.2em]">Scientific Recognition</span>
                        </div>
                        <h4 className="text-xl font-black text-[var(--foreground)] tracking-tighter uppercase mb-0.5">01 Patent Recognized</h4>
                        <p className="text-[10px] font-bold text-[var(--muted)] opacity-60 uppercase tracking-[0.2em] italic">IP INDIA • 2025</p>
                     </div>
                  </div>

               </div>
            </motion.div>
        </div>
      </div>
    </section>
  );
}
