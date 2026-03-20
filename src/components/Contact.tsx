"use client";

import React, { useState, useEffect } from "react";
import SectionHeading from "./SectionHeading";
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { Card } from "@/components/ui/card";
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
    <section id="contact" className="py-40 relative">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <SectionHeading 
          title="Connect" 
          centered
        />

        <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-full min-h-[600px] relative rounded-[3rem]">
            <Spotlight
              className="-top-40 right-0 md:right-20 md:-top-20 h-full w-full"
              fill="white"
            />
            
            <div className="relative min-h-[600px] flex flex-col items-stretch">
              {/* Form Section */}
              <div className="w-full md:w-1/2 p-6 md:p-16 relative z-10 flex flex-col justify-center">
                <div className="space-y-4 mb-10 text-left">
                   <h1 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500 tracking-tighter uppercase leading-[1]">
                     Let&apos;s Build <br/> Together
                   </h1>
                   <p className="text-neutral-500 text-[13px] md:text-sm font-medium tracking-wide max-w-xs md:max-w-none">
                     Open to AI/ML Research & Software Engineering Internship opportunities.
                   </p>
                </div>

                <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit}>
                   <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
                      <div className="flex flex-col items-start">
                         <input 
                           type="text" 
                           name="name" 
                           required 
                           placeholder="Your Name"
                           className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-3.5 md:px-6 md:py-4 text-white outline-none focus:border-white/20 transition-all text-[13px] md:text-sm font-medium placeholder:text-neutral-600 focus:bg-white/[0.08] backdrop-blur-sm" 
                         />
                      </div>
                      <div className="flex flex-col items-start">
                         <input 
                           type="email" 
                           name="email" 
                           required 
                           placeholder="Your Email"
                           className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-3.5 md:px-6 md:py-4 text-white outline-none focus:border-white/20 transition-all text-[13px] md:text-sm font-medium placeholder:text-neutral-600 focus:bg-white/[0.08] backdrop-blur-sm" 
                         />
                      </div>
                   </div>

                   <div className="flex flex-col items-start">
                      <textarea 
                        name="message" 
                        required 
                        rows={4}
                        placeholder="Message payload..."
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-3.5 md:px-6 md:py-4 text-white outline-none focus:border-white/20 transition-all text-[13px] md:text-sm font-medium resize-none placeholder:text-neutral-600 focus:bg-white/[0.08] backdrop-blur-sm" 
                      />
                   </div>

                   <Magnetic strength={0.1}>
                     <button 
                       type="submit"
                       disabled={status === "loading"}
                       className={`w-full py-4 md:py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 transition-all active:scale-[0.99] border shadow-xl z-20 ${
                         status === "success" 
                           ? "bg-green-500/20 border-green-500/50 text-green-400" 
                           : status === "error"
                           ? "bg-red-500/20 border-red-500/50 text-red-400"
                           : "bg-white text-black hover:bg-neutral-200 border-white shadow-white/5"
                       }`}
                     >
                       {status === "loading" ? "Initializing..." : 
                        status === "success" ? "Message Captured" : 
                        status === "error" ? "System Error" : 
                        "Launch Message"} 
                       <Send size={16} className={`${status === "loading" ? "animate-pulse" : ""} ${status === "idle" ? "rotate-12" : ""}`} />
                     </button>
                   </Magnetic>
                </form>
              </div>

              {/* Robot Section - Spline Scene */}
              <div className="w-full md:absolute md:inset-y-0 md:right-[-10%] md:w-[70%] h-[350px] md:h-auto z-0">
                <div 
                  className="w-full h-full"
                  style={{ 
                    maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
                  }}
                >
                  <SplineScene 
                    scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                    className="w-full h-full scale-[1.4] md:scale-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
