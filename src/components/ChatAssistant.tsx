"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Terminal, Command, Sparkles, Linkedin, Github, Mail } from "lucide-react";

type Message = {
  role: "system" | "user" | "assistant";
  content: string | React.ReactNode;
};

// Help command output as a specific structure mapping colors better
const HelpMessage = () => (
  <div className="flex flex-col gap-1 mt-1 mb-2">
    <div className="text-[var(--terminal-accent)] font-bold mb-1 flex items-center gap-2">
      <Command size={14} /> Available commands:
    </div>
    <div className="grid grid-cols-[120px_1fr] gap-2">
      <div className="text-[var(--terminal-user)] text-xs font-bold uppercase tracking-wider">about</div>
      <div className="text-[var(--terminal-output)] text-xs opacity-70">- Learn more about who I am</div>
      <div className="text-[var(--terminal-user)] text-xs font-bold uppercase tracking-wider">work</div>
      <div className="text-[var(--terminal-output)] text-xs opacity-70">- See my experience and projects</div>
      <div className="text-[var(--terminal-user)] text-xs font-bold uppercase tracking-wider">skills</div>
      <div className="text-[var(--terminal-output)] text-xs opacity-70">- View my technical stack</div>
      <div className="text-[var(--terminal-user)] text-xs font-bold uppercase tracking-wider">contact</div>
      <div className="text-[var(--terminal-output)] text-xs opacity-70">- Get my social links & email</div>
      <div className="text-[var(--terminal-user)] text-xs font-bold uppercase tracking-wider">clear</div>
      <div className="text-[var(--terminal-output)] text-xs opacity-70">- Clear the terminal</div>
      <div className="text-[var(--terminal-user)] text-xs font-bold uppercase tracking-wider">sudo</div>
      <div className="text-[var(--terminal-output)] text-xs opacity-70">- Administrator access</div>
      <div className="text-[var(--terminal-user)] text-xs font-bold uppercase tracking-wider">help</div>
      <div className="text-[var(--terminal-output)] text-xs opacity-70">- Show this help message</div>
    </div>
  </div>
);

const initialMessages: Message[] = [
  {
    role: "system",
    content: (
      <div className="text-[var(--terminal-success)] mb-4 flex items-center gap-2">
        <Sparkles size={14} />
        <span className="text-xs uppercase font-black tracking-widest">Welcome to Anish&apos;s Command Interface v1.0. Type &apos;help&apos; to begin.</span>
      </div>
    ),
  },
];

const responses: Record<string, string | React.ReactNode> = {
  work: "I've worked on high-impact projects like VTrack (real-time CV traffic analysis), SkillGap (AI career assistant), and DocPilot (RAG-based docs). Check out the Projects section below!",
  skills: "I'm proficient in Python, PyTorch, TensorFlow, and specialize in LLM applications, Computer Vision (YOLOv8), and Full-stack AI using Next.js and FastAPI.",
  about: "I'm an MS CS student at Rutgers with a passion for building production-ready AI products. I even have a registered copyright for a weather forecasting system (IP India, 2025)!",
  contact: (
     <div className="flex flex-col gap-3">
       <p className="text-[var(--terminal-output)] text-[13px]">Establishing secure connections...</p>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
         <a href="https://linkedin.com/in/anish-shirodkar" target="_blank" className="flex items-center gap-3 p-3 rounded-xl bg-[var(--terminal-header)]/50 border border-[var(--terminal-accent)]/10 hover:border-[var(--terminal-accent)]/40 hover:bg-[var(--terminal-accent)]/10 transition-all group backdrop-blur-md">
            <Linkedin size={16} className="text-blue-400 group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-blue-500/50 uppercase tracking-widest">LinkedIn</span>
              <span className="text-[var(--terminal-output)] text-[11px]">anish-shirodkar</span>
            </div>
         </a>
         <a href="https://github.com/Anish0104" target="_blank" className="flex items-center gap-3 p-3 rounded-xl bg-[var(--terminal-header)]/50 border border-[var(--terminal-accent)]/10 hover:border-[var(--terminal-accent)]/40 hover:bg-[var(--terminal-accent)]/10 transition-all group backdrop-blur-md">
            <Github size={16} className="text-[var(--foreground)] group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-[var(--foreground)]/30 uppercase tracking-widest">GitHub</span>
              <span className="text-[var(--terminal-output)] text-[11px]">Anish0104</span>
            </div>
         </a>
         <a href="mailto:avs181@scarletmail.rutgers.edu" className="flex items-center gap-3 p-3 rounded-xl bg-[var(--terminal-header)]/50 border border-[var(--terminal-accent)]/10 hover:border-[var(--terminal-accent)]/40 hover:bg-[var(--terminal-accent)]/10 transition-all group backdrop-blur-md md:col-span-2">
            <Mail size={16} className="text-red-400 group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-red-500/50 uppercase tracking-widest">Official Email</span>
              <span className="text-[var(--terminal-output)] text-[11px]">avs181@scarletmail.rutgers.edu</span>
            </div>
         </a>
       </div>
     </div>
  ),
  sudo: "Nice try! Incident reported. 🚨",
};

export default function ChatAssistant() {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    
    // Add Cmd+K / Ctrl+K listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleSend = (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    if (trimmedText.toLowerCase() === 'clear') {
      setMessages(initialMessages);
      setInputValue("");
      return;
    }

    const userMsg: Message = { role: "user", content: trimmedText };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response logic
    setTimeout(() => {
      const lowerText = trimmedText.toLowerCase();
      let aiContent: React.ReactNode | string = "";

      if (lowerText === "help") {
        aiContent = <HelpMessage />;
      } else if (lowerText.includes("work") || lowerText.includes("project")) {
        aiContent = responses.work;
      } else if (lowerText.includes("skill") || lowerText.includes("tech")) {
        aiContent = responses.skills;
      } else if (lowerText.includes("about") || lowerText.includes("who")) {
        aiContent = responses.about;
      } else if (lowerText.includes("contact") || lowerText.includes("hire") || lowerText.includes("email")) {
        aiContent = responses.contact;
      } else if (lowerText === "sudo") {
        aiContent = <span className="text-[var(--terminal-error)]">{responses.sudo}</span>;
      } else {
        aiContent = <span className="text-[var(--terminal-error)]">Command not found: {trimmedText}. Type &apos;help&apos; for available commands.</span>;
      }

      const aiMsg: Message = { role: "assistant", content: aiContent };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 400 + Math.random() * 400); // Variable typing delay
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend(inputValue);
    }
  };

  if (!mounted) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 px-4 group/terminal">
      {/* Terminal Window Container */}
      <div 
        className="relative bg-[var(--terminal-body)] rounded-2xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.3)] flex flex-col h-[480px] border border-[var(--card-border)] font-mono text-[13px] cursor-text transition-all duration-500 hover:shadow-[0_40px_120px_rgba(0,0,0,0.4)]"
        onClick={focusInput}
      >
        {/* Aesthetic Header */}
        <div className="flex items-center px-5 h-14 bg-[var(--terminal-header)] backdrop-blur-md border-b border-[var(--card-border)] shrink-0 relative transition-colors duration-500">
          <div className="flex gap-2 shrink-0 z-10">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56]/20 border border-[#FF5F56]/40 group-hover/terminal:bg-[#FF5F56] transition-colors duration-500"></div>
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]/20 border border-[#FFBD2E]/40 group-hover/terminal:bg-[#FFBD2E] transition-colors duration-500"></div>
            <div className="w-3 h-3 rounded-full bg-[#27C93F]/20 border border-[#27C93F]/40 group-hover/terminal:bg-[#27C93F] transition-colors duration-500"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center text-[var(--muted)] text-[9px] font-black pointer-events-none tracking-[0.3em] uppercase opacity-40">
            ANISH&apos;S TERMINAL
          </div>
        </div>

        {/* Console Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-3 scrollbar-hide text-[var(--foreground)]"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="leading-relaxed"
              >
                {msg.role === "user" ? (
                  <div className="flex items-start gap-3">
                    <span className="text-[var(--terminal-prompt)] font-black opacity-80 shrink-0 select-none">❯</span>
                    <span className="text-[var(--terminal-user)] shrink-0 font-bold opacity-90">anish</span>
                    <span className="text-[var(--terminal-command)] font-medium">{msg.content}</span>
                  </div>
                ) : (
                  <div className={cn("pl-0", msg.role === 'assistant' ? "text-[var(--terminal-output)] font-medium" : "")}>
                    {msg.content}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Active Input Line */}
          <div className="flex items-center gap-3 mt-4 relative">
            <span className="text-[var(--terminal-prompt)] font-black shrink-0 select-none animate-pulse">❯</span>
            <span className="text-[var(--terminal-user)] shrink-0 font-bold opacity-90">anish</span>
            
            <div className="flex-1 flex items-center relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleInputKeyDown}
                disabled={isTyping}
                spellCheck={false}
                autoComplete="off"
                className="w-full bg-transparent border-none outline-none text-[var(--terminal-command)] focus:ring-0 p-0 text-[14px] font-medium disabled:opacity-50 placeholder:opacity-20"
                placeholder={messages.length === 1 && !inputValue ? "Type 'help' to start..." : ""}
              />
              {/* Custom blinking cursor for idle state */}
              {!inputValue && !isTyping && (
                <motion.div 
                  animate={{ opacity: [1, 0, 1] }} 
                  transition={{ repeat: Infinity, duration: 1 }} 
                  className="w-2.5 h-[1.2em] bg-[var(--terminal-accent)]/80 absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none rounded-sm shadow-[0_0_10px_var(--terminal-accent)]"
                />
              )}
            </div>
          </div>

          {isTyping && (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-[var(--terminal-success)] mt-4 flex items-center gap-2 italic text-xs font-bold tracking-wider uppercase opacity-60"
             >
               <span className="flex gap-1">
                 <span className="animate-bounce">.</span>
                 <span className="animate-bounce [animation-delay:0.2s]">.</span>
                 <span className="animate-bounce [animation-delay:0.4s]">.</span>
               </span>
               Processing Command
             </motion.div>
          )}
          
          {/* spacer for scrolling padding */}
          <div className="h-6"></div>
        </div>
      </div>
    </div>
  );
}
