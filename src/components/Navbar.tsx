"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sun, Moon, Home, User, Briefcase, Cpu, Code, 
  Joystick, Brain, Award, Mail 
} from "lucide-react";
import { useTheme } from "@/app/ThemeProvider";
import Magnetic from "./ui/magnetic";

const NAV_ITEMS = [
  { label: "Home", href: "#home", icon: Home },
  { label: "Bio", href: "#about", icon: User },
  { label: "Exp", href: "#experience", icon: Briefcase },
  { label: "Tech", href: "#skills", icon: Cpu },
  { label: "Works", href: "#projects", icon: Code },
  { label: "Lab", href: "#game", icon: Joystick },
  { label: "Logic", href: "#how-i-think", icon: Brain },
  { label: "Meta", href: "#achievements", icon: Award },
  { label: "Comm", href: "#contact", icon: Mail },
];

export default function Navbar() {
  const [activeSegment, setActiveSegment] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      setScrolled(scrollPos > 50);

      const sections = NAV_ITEMS.map(item => item.href.substring(1));
      const sectionElements = sections.map(id => document.getElementById(id));
      
      let currentSection = "home";
      const scrollThreshold = scrollPos + 200; 

      sectionElements.forEach((el, idx) => {
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = rect.top + scrollPos;
          if (top <= scrollThreshold) {
            currentSection = sections[idx];
          }
        }
      });

      if (scrollPos < 100) currentSection = "home";
      setActiveSegment(currentSection);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const id = href.substring(1);
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -100; 
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      style={{ left: "50%" }}
      className={`fixed top-6 z-[100] flex items-center gap-1 px-1.5 py-1.5 border border-[var(--card-border)] backdrop-blur-3xl rounded-full transition-all duration-500 bg-[var(--card-bg)] shadow-[0_20px_50px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.05)] ${
        scrolled ? "scale-90 opacity-90 -translate-y-2" : "scale-100 opacity-100"
      }`}
    >
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 rounded-full opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      
      <div className="flex items-center gap-0.5 relative">
        {NAV_ITEMS.map((item, idx) => {
          const isActive = activeSegment === item.href.substring(1);
          const Icon = item.icon;
          
          return (
            <React.Fragment key={item.href}>
              {/* Group Dividers (Visual grouping) */}
              {(idx === 1 || idx === 3 || idx === 5 || idx === 8) && (
                <div className="w-[1px] h-3 bg-[var(--card-border)] mx-1" />
              )}
              
              <Magnetic strength={0.3}>
                <button
                  onClick={() => scrollTo(item.href)}
                  className={`relative group flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-2 rounded-full transition-all duration-500 active:scale-95 ${
                    isActive ? "text-[var(--foreground)]" : "text-[var(--muted)] hover:text-[var(--foreground)]/60"
                  }`}
                >
                  <Icon size={14} strokeWidth={isActive ? 2.5 : 2} className="relative z-10" />
                  
                  {/* Expand label (Logic: Active or Desktop Entry) */}
                  <AnimatePresence>
                    {((isActive || scrolled === false) && (
                      <motion.span
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "auto", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="hidden md:inline text-[9px] font-bold uppercase tracking-[0.2em] overflow-hidden whitespace-nowrap relative z-10"
                      >
                        {item.label}
                      </motion.span>
                    ))}
                  </AnimatePresence>
                  
                  {/* Sliding Highlight */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-highlight"
                      className="absolute inset-0 bg-[var(--foreground)]/5 border border-[var(--card-border)] rounded-full z-0 shadow-[0_0_15px_rgba(var(--foreground),0.05)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Hover Glow */}
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[var(--foreground)]/5 -z-10" />
                </button>
              </Magnetic>
            </React.Fragment>
          );
        })}
      </div>

      {/* Theme Toggle */}
      <div className="w-[1px] h-5 bg-[var(--card-border)] mx-2" />
      
      <button
        onClick={toggleTheme}
        className="relative w-8 h-8 flex items-center justify-center rounded-full text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5 transition-all duration-300 active:scale-90 group overflow-hidden"
        aria-label="Toggle Theme"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ y: 20, opacity: 0, rotate: 45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: -45 }}
            transition={{ duration: 0.3, ease: "circOut" }}
          >
            {theme === "dark" ? <Sun size={14} strokeWidth={2} /> : <Moon size={14} strokeWidth={2} />}
          </motion.div>
        </AnimatePresence>
      </button>
    </motion.nav>
  );
}
