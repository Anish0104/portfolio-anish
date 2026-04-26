"use client";

import React from "react";
import SectionHeading from "./SectionHeading";
import { motion } from "framer-motion";
import { Award, FileText, ArrowRight, Microscope, Users } from "lucide-react";

const cards = [
  {
    title: "Publications",
    highlight: "Research",
    titleColor: "text-orange-500",
    description: "A collection of my research breakthroughs and registered copyrights in AI-driven meteorological systems and deep learning.",
    icon: <Microscope className="text-orange-400" size={32} />,
    iconBg: "border-orange-500/50 text-orange-400",
    link: "/publications",
    delay: 0.1,
  },
  {
    title: "Leadership Roles",
    highlight: "Impact",
    titleColor: "text-emerald-500",
    description: "A showcase of the strategic roles I've led, from student engineering chapters to large-scale technical fests.",
    icon: <Users className="text-emerald-400" size={32} />,
    iconBg: "border-emerald-500/50 text-emerald-400",
    link: "/leadership",
    delay: 0.2,
  },
  {
    title: "Certifications",
    highlight: "Validated",
    titleColor: "text-blue-500",
    description: "Professional milestones and certifications validating my expertise at the forefront of AI and cloud technologies.",
    icon: <Award className="text-blue-400" size={32} />,
    iconBg: "border-blue-500/50 text-blue-400",
    link: "/certifications",
    delay: 0.3,
  },
];

export default function Achievements() {
  return (
    <section id="achievements" className="py-32 relative overflow-hidden bg-transparent">
      <div className="container mx-auto px-6 relative z-10">
        <SectionHeading 
          title="More to Explore"
          subtitle="Check out these additional resources and connect with me"
          centered
        />

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {cards.map((card) => (
            <motion.a
              key={card.title}
              href={card.link}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: card.delay }}
              className="group relative p-12 glass-card flex flex-col items-center text-center"
            >
              {/* Icon Container (Rounded Square) */}
              <div className={`w-20 h-20 rounded-2xl border-2 ${card.iconBg} flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 shadow-2xl`}>
                {card.icon}
              </div>

              {/* Title */}
              <h3 className={`text-4xl font-black mb-6 tracking-tighter ${card.titleColor}`}>
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-[var(--muted)] text-lg leading-relaxed mb-10 font-medium whitespace-pre-line">
                {card.description}
              </p>

              {/* Link Wrapper */}
              <div 
                className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest ${card.titleColor} opacity-60 group-hover:opacity-100 transition-opacity mt-auto`}
              >
                Explore <ArrowRight size={14} />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
