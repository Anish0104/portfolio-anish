"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

interface SubPageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function SubPageLayout({ title, subtitle, children }: SubPageLayoutProps) {
  return (
    <main className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-dot-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px] -z-10" />

      <div className="container mx-auto max-w-5xl">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-16">
          <Link 
            href="/#achievements" 
            className="group flex items-center gap-2 text-[var(--muted)] hover:text-white transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <ArrowLeft size={16} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">Back to Portfolio</span>
          </Link>
          
          <Link href="/" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <Home size={20} className="text-blue-500" />
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl text-[var(--muted)] font-medium max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </motion.div>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mt-8 rounded-full" />
        </header>

        {/* Content */}
        <section className="relative z-10">
          {children}
        </section>
      </div>
    </main>
  );
}
