"use client";

import React from "react";
import SectionHeading from "./SectionHeading";
import { motion } from "framer-motion";
import SkillSphere from "./SkillSphere";

export default function Skills() {
  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 flex flex-col items-center">
        <SectionHeading 
          title="My Skills"
          subtitle="A comprehensive overview of the technologies and tools I use to build intelligent systems."
          centered
        />

        {/* 3D Sphere Interactive Area */}
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ delay: 0.3, duration: 0.8 }}
           className="w-full relative"
        >
          <SkillSphere />
        </motion.div>
      </div>
    </section>
  );
}
