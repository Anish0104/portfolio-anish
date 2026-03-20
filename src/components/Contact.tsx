"use client";

import React, { useState, useEffect } from "react";
import SectionHeading from "./SectionHeading";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";
import Magnetic from "./ui/magnetic";

export default function Contact() {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    formData.append("access_key", "e0635982-b4e2-4aab-9970-a678016f8b36");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("error");
    }
  };

  if (!mounted) return null;

  return (
    <section id="contact" className="py-40 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <SectionHeading 
          title="Connect" 
          centered
        />

        <motion.div
           initial={{ opacity: 0, scale: 0.98 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
           className="w-full relative rounded-[3rem] bg-[var(--card-bg)] border border-[var(--card-border)] overflow-hidden"
        >
          <Spotlight
            className="-top-40 right-0 md:right-20 md:-top-20 h-full w-full"
            fill="white"
          />
          
          <div className="relative min-h-[500px] flex flex-col md:flex-row items-stretch">
            {/* Form Section */}
            <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
              <div className="space-y-4 mb-10 text-left">
                 <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500 tracking-tighter uppercase leading-[1]">
                   Let&apos;s Build <br/> Together
                 </h1>
                 <p className="text-neutral-500 text-sm font-medium tracking-wide">
                   Open to AI/ML Research & Software Engineering Internship opportunities.
                 </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                 <div className="grid sm:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      placeholder="Your Name"
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-white/20 transition-all text-sm font-medium placeholder:text-neutral-600 focus:bg-white/[0.08]" 
                    />
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      placeholder="Your Email"
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-white/20 transition-all text-sm font-medium placeholder:text-neutral-600 focus:bg-white/[0.08]" 
                    />
                 </div>

                 <textarea 
                   name="message" 
                   required 
                   rows={4}
                   placeholder="Your detailed message..."
                   className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-white/20 transition-all text-sm font-medium resize-none placeholder:text-neutral-600 focus:bg-white/[0.08]" 
                 />

                 <Magnetic strength={0.1}>
                   <button 
                     type="submit"
                     disabled={status === "loading"}
                     className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 transition-all active:scale-[0.99] border shadow-xl ${
                       status === "success" 
                         ? "bg-green-500/20 border-green-500/50 text-green-400" 
                         : status === "error"
                         ? "bg-red-500/20 border-red-500/50 text-red-400"
                         : "bg-white text-black hover:bg-neutral-200 border-white"
                     }`}
                   >
                     {status === "loading" ? "SENDING..." : 
                      status === "success" ? "SENT" : 
                      status === "error" ? "ERROR" : 
                      "LAUNCH MESSAGE"} 
                     <Send size={16} className={`${status === "loading" ? "animate-pulse" : ""}`} />
                   </button>
                 </Magnetic>
              </form>
            </div>

            {/* Decorative Side */}
            <div className="hidden md:flex flex-1 bg-gradient-to-br from-white/[0.02] to-transparent items-center justify-center p-16">
               <div className="relative w-full h-full rounded-[2rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                    <Send className="text-white/20" />
                  </div>
                  <h4 className="text-xl font-black text-white/20 uppercase tracking-tighter italic">Message Stream Active</h4>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
