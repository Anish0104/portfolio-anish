"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FileText, Send } from "lucide-react";
import ChatAssistant from "./ChatAssistant";

const phrases = [
  { greeting: "Hi, I'm", name: "Anish Shirodkar" },
  { greeting: "नमस्ते, मैं हूँ", name: "Anish Shirodkar" },
  { greeting: "Hola, soy", name: "Anish Shirodkar" },
  { greeting: "Bonjour, je suis", name: "Anish Shirodkar" },
  { greeting: "Ciao, sono", name: "Anish Shirodkar" },
];

const Typewriter = () => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const blinkTimeout = setTimeout(() => setBlink((prev) => !prev), 500);
    return () => clearTimeout(blinkTimeout);
  }, [blink]);

  useEffect(() => {
    const currentPhrase = `${phrases[index].greeting} ${phrases[index].name}`;

    if (subIndex === currentPhrase.length + 1 && !reverse) {
      const pauseTimeout = setTimeout(() => setReverse(true), 2000);
      return () => clearTimeout(pauseTimeout);
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % phrases.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 30 : 60);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, phrases]);

  const greetingLength = phrases[index].greeting.length;
  const currentPhrase = `${phrases[index].greeting} ${phrases[index].name}`;
  const visibleText = currentPhrase.substring(0, subIndex);
  
  return (
    <h1 className="text-[32px] md:text-[52px] lg:text-[72px] font-bold tracking-tight leading-tight min-h-[1.5em] flex flex-wrap justify-center items-center gap-x-3">
      <span className="opacity-80">
        {visibleText.substring(0, Math.min(subIndex, greetingLength))}
      </span>
      {subIndex > greetingLength && (
        <span className="text-[var(--foreground)]">
          {visibleText.substring(greetingLength + 1)}
        </span>
      )}
      <span className={`inline-block w-[3px] h-[1em] bg-[var(--accent-blue)] ml-1 transition-opacity duration-100 ${blink ? 'opacity-100' : 'opacity-0'}`} />
    </h1>
  );
};

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-dot-grid">
        <div className="w-32 h-32 rounded-full bg-[var(--card-bg)] animate-pulse" />
      </section>
    );
  }

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center pt-24 md:pt-32 pb-10 overflow-hidden transition-colors duration-500">
      {/* Background Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--accent-blue)]/5 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[var(--accent-purple)]/5 rounded-full blur-[150px] -z-10" />

      {/* Avatar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative mb-4 md:mb-6 flex justify-center z-10"
      >
        <Image
          src="/avatar-nobg.png"
          alt="Anish Shirodkar"
          width={320}
          height={320}
          className="object-contain drop-shadow-2xl brightness-[1.1] contrast-[1.1]"
          priority
        />
      </motion.div>

      {/* Greeting Content */}
      <div className="text-center mb-6 relative z-10 px-4">
        <Typewriter />

        {/* Metadata */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-4 flex flex-wrap justify-center gap-4 text-[var(--muted)]"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)]" />
             MSCS @ Rutgers
          </span>
          <span className="opacity-20 hidden md:block">/</span>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-purple)]" />
             AI/ML Engineer
          </span>
        </motion.div>
      </div>

      {/* Hero Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8 relative z-10">
        <a href="/Anish_Shirodkar_Resume.pdf" target="_blank" className="btn-tech-primary">
          <FileText size={14} className="text-[var(--accent-blue)]" />
          <span>Resume</span>
        </a>
        <a href="#contact" className="btn-tech-secondary">
          <Send size={14} className="text-[var(--accent-purple)]" />
          <span>Connect</span>
        </a>
      </div>

      {/* Chat Bot */}
      <div className="w-full max-w-4xl px-4 z-10">
        <ChatAssistant />
      </div>
    </section>
  );
}
