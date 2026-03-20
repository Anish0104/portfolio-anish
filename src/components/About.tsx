"use client";

import React from "react";
import { motion } from "framer-motion";
import { Code2, Globe2, Cpu, Fingerprint, GraduationCap, Microscope } from "lucide-react";
import SectionHeading from "./SectionHeading";

const TechnicalBorder = () => (
   <>
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[var(--accent-blue)] opacity-40 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[var(--accent-blue)] opacity-40 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[var(--accent-blue)] opacity-40 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[var(--accent-blue)] opacity-40 group-hover:opacity-100 transition-opacity" />
   </>
);

const RealMap = () => (
  <div className="absolute inset-0 opacity-20 pointer-events-none -z-10 group-hover:opacity-40 transition-opacity duration-700 overflow-hidden">
     <iframe 
       src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.3059445135!2d-74.259867633214!3d40.69714941381358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1710972745032!5m2!1sen!2sus" 
       width="100%" 
       height="100%" 
       style={{ 
         border: 0, 
         filter: 'grayscale(1) invert(0.9) hue-rotate(190deg) brightness(0.7) contrast(1.2)',
         transform: 'scale(1.2)', // Adjusted zoom for better fit
       }} 
       allowFullScreen 
       loading="lazy" 
       referrerPolicy="no-referrer-when-downgrade"
     />
     {/* Radar Overlay Grid */}
     <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_40%,transparent_0%,var(--background)_80%)] opacity-60" />
     <div className="absolute inset-0 border-[0.5px] border-[var(--accent-blue)] opacity-5 pointer-events-none" style={{ backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)' }} />
  </div>
);

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
    const interval = setInterval(updateTime, 10000); // Update every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="about" className="py-32 bg-transparent relative overflow-hidden transition-colors duration-500">
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
                    Currently an M.S. CS candidate at Rutgers University, I specialize in ML, NLP, and AI engineering. My work bridges the gap between complex research and production-ready applications, leveraging everything from YOLOv8 and ByteTrack to Gemini API and Supabase.
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
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto">
                  
                  {/* LOCATION CARD */}
                  <div className="lg:col-span-6 lg:row-span-2 relative group p-6 md:p-8 rounded-[2rem] bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--accent-blue)]/40 transition-all duration-700 flex flex-col justify-between overflow-hidden min-h-[300px]">
                     <TechnicalBorder />
                     <RealMap />
                     
                     <div className="space-y-4 relative z-10">
                        <div className="flex items-center gap-3 text-[var(--accent-blue)]">
                           <Globe2 size={20} />
                           <span className="text-[10px] font-black uppercase tracking-[0.4em]">GEOLOCATION SYSTEM</span>
                        </div>
                        
                        <div className="space-y-1 text-left">
                           <h4 className="text-2xl md:text-3xl font-black text-[var(--foreground)] tracking-tighter uppercase leading-none">New Jersey, USA</h4>
                           <div className="flex items-center gap-3 text-[var(--muted)] pt-2">
                              <div className="flex items-center gap-2 px-2.5 py-0.5 bg-[var(--accent-blue)]/10 border border-[var(--accent-blue)]/20 rounded-full">
                                 <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse" />
                                 <span className="text-[11px] font-black uppercase tracking-tighter italic">{estTime || "Loading..."} ET</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="pt-6 flex gap-8 opacity-30 group-hover:opacity-60 transition-opacity relative z-10">
                        <div className="space-y-1">
                           <p className="text-[9px] font-black uppercase tracking-wider">LAT</p>
                           <p className="text-[10px] font-mono">40.7128° N</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] font-black uppercase tracking-wider">LONG</p>
                           <p className="text-[10px] font-mono">74.0060° W</p>
                        </div>
                     </div>
                  </div>

                  {/* EDUCATION CARD */}
                  <div className="lg:col-span-6 lg:row-span-1 relative group p-6 rounded-[2rem] bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--accent-blue)]/40 transition-all duration-700 flex flex-col justify-between min-h-[160px]">
                     <TechnicalBorder />
                     <div className="flex items-center justify-between mb-2 text-[var(--accent-blue)]">
                        <div className="flex items-center gap-3">
                           <GraduationCap size={18} />
                           <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Education</span>
                        </div>
                     </div>
                     <div>
                        <h4 className="text-xl font-black text-[var(--foreground)] tracking-tighter uppercase mb-0.5">MSCS @ Rutgers</h4>
                        <p className="text-xs font-bold text-[var(--muted)] opacity-60 uppercase italic tracking-wide">Major in AI • GPA: 3.50</p>
                     </div>
                  </div>

                  {/* IMPACT CARD */}
                  <div className="lg:col-span-6 lg:row-span-1 relative group p-6 rounded-[2rem] bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--accent-blue)]/40 transition-all duration-700 flex items-center gap-6 overflow-hidden min-h-[160px]">
                     <TechnicalBorder />
                     
                     <div className="p-3 rounded-2xl bg-[var(--accent-blue)]/5 border border-[var(--accent-blue)]/10 text-[var(--accent-blue)] group-hover:bg-[var(--accent-blue)]/10 transition-colors">
                        <Microscope size={24} />
                     </div>

                     <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 text-[var(--accent-blue)] opacity-60 mb-1">
                           <span className="text-[9px] font-black uppercase tracking-[0.2em]">Scientific Recognition</span>
                        </div>
                        <div className="flex justify-between items-end">
                           <div className="space-y-0.5">
                              <h4 className="text-xl font-black text-[var(--foreground)] tracking-tighter uppercase mb-0.5">01 Patent Recognized</h4>
                              <p className="text-[10px] font-bold text-[var(--muted)] opacity-60 uppercase tracking-[0.2em] italic">IP INDIA • 2025</p>
                           </div>
                        </div>
                     </div>
                  </div>

               </div>
           </motion.div>
        </div>
      </div>
    </section>
  );
}
