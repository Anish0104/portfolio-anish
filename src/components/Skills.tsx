"use client";

import React from "react";
import SectionHeading from "./SectionHeading";
import { motion } from "framer-motion";
import SkillTabs from "./SkillTabs";

export default function Skills() {
  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div aria-hidden="true" className="absolute top-0 right-4 md:right-10 text-[140px] md:text-[200px] font-black leading-none select-none pointer-events-none opacity-[0.025] text-[var(--foreground)]">03</div>
      <div className="container mx-auto px-6 flex flex-col items-center">
        <SectionHeading
          title="My Skills"
          subtitle="From model training to production deployment — the full stack of technologies I use to build intelligent systems."
          centered
        />

        <SkillTabs />
      </div>
    </section>
  );
}
