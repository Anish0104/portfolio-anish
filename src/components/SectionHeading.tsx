"use client";

import React from "react";
import { motion } from "framer-motion";

interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeading({ label, title, subtitle, centered = false }: SectionHeadingProps) {
  return (
    <div className={`mb-20 text-center mx-auto max-w-4xl`}>
      {label && (
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5 }}
           className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-blue)]/5 border border-[var(--accent-blue)]/10 text-[var(--accent-blue)] text-[10px] font-black uppercase tracking-[0.3em] mb-6"
        >
           <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse" />
           {label}
        </motion.div>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-section-title uppercase mb-10"
      >
        {title}
      </motion.h2>
      
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[var(--muted)] font-medium text-lg max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
