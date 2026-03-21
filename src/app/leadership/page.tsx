"use client";

import React from "react";
import SubPageLayout from "@/components/SubPageLayout";
import { motion } from "framer-motion";
import { Users, Trophy, BookOpen, Heart, Calendar, MapPin, ShieldCheck } from "lucide-react";

const roles = [
  {
    title: "President",
    organization: "Institute of Engineers India, TCET",
    date: "Aug 2023 – Aug 2024",
    description: "Led the student engineering chapter, managing a core team of officers and spearheading Zephyr, TCET's annual tech fest with 5,000+ attendees. Organized workshops and seminars bridging academic learning with real-world engineering practice.",
    highlights: ["Managed 5,000+ attendee tech fest", "Led core team of officers", "Organized academic-practice workshops"],
    color: "emerald",
    icon: <Trophy size={24} />,
  },
  {
    title: "General Advisor",
    organization: "Institute of Engineers India, TCET",
    date: "Aug 2024 – Aug 2025",
    description: "Mentored incoming leadership on event planning, member engagement, and chapter operations. Represented the chapter's long-term vision to faculty coordinators and ensured continuity of initiatives.",
    highlights: ["Mentored leadership team", "Liaison with faculty", "Strategy continuity"],
    color: "blue",
    icon: <Users size={24} />,
  },
  {
    title: "Editorial Associate",
    organization: "IoT Department Magazine, TCET",
    date: "Aug 2022 – Aug 2023",
    description: "Curated and edited technical content from students and faculty, collaborating with writers, designers, and advisors to produce a publication highlighting IoT research and departmental achievements.",
    highlights: ["Curated technical content", "Department-wide publication", "Collaborative editing"],
    color: "purple",
    icon: <BookOpen size={24} />,
  },
  {
    title: "Volunteer",
    organization: "Late Knights, Rutgers University",
    date: "Sep 2025 – Present",
    description: "Planning and executing late-night campus events promoting safe, engaging student experiences. Managing logistics and fostering an inclusive community environment.",
    highlights: ["Event planning & logistics", "Campus community building", "Promoting safe spaces"],
    color: "orange",
    icon: <Heart size={24} />,
  },
];

const colorMap: Record<string, { border: string; bg: string; icon: string; glow: string; badge: string }> = {
  emerald: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    icon: "text-emerald-400",
    glow: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
    badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  },
  blue: {
    border: "border-blue-500/30",
    bg: "bg-blue-500/5",
    icon: "text-blue-400",
    glow: "bg-blue-500/10 group-hover:bg-blue-500/20",
    badge: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  },
  purple: {
    border: "border-purple-500/30",
    bg: "bg-purple-500/5",
    icon: "text-purple-400",
    glow: "bg-purple-500/10 group-hover:bg-purple-500/20",
    badge: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  },
  orange: {
    border: "border-orange-500/30",
    bg: "bg-orange-500/5",
    icon: "text-orange-400",
    glow: "bg-orange-500/10 group-hover:bg-orange-500/20",
    badge: "bg-orange-500/10 text-orange-300 border-orange-500/20",
  },
};

export default function LeadershipPage() {
  return (
    <SubPageLayout
      title="Leadership Roles"
      subtitle="A showcase of the strategic roles I've led and the impact I've created through community and technical initiatives."
    >
      <div className="grid md:grid-cols-2 gap-6">
        {roles.map((role, idx) => {
          const c = colorMap[role.color];
          return (
            <motion.div
              key={role.title + idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-8 flex flex-col group relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-3xl transition-colors ${c.glow}`} />

              <div className="flex items-center justify-between mb-8">
                <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center ${c.border} ${c.bg}`}>
                  <div className={c.icon}>{role.icon}</div>
                </div>
                <div className="flex items-center gap-1.5 text-[var(--muted)] text-[10px] font-black uppercase tracking-widest">
                  <Calendar size={12} /> {role.date}
                </div>
              </div>

              <h3 className="text-2xl font-black tracking-tight mb-2 text-white group-hover:text-blue-400 transition-colors">
                {role.title}
              </h3>
              <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-6 border-b border-white/5 pb-4 ${c.icon}`}>
                <MapPin size={10} /> {role.organization}
              </div>

              <p className="text-[var(--muted)] text-sm leading-relaxed mb-8 flex-1 font-medium">
                {role.description}
              </p>

              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                  <ShieldCheck size={12} className="text-blue-500" /> Key Contributions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {role.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${c.badge}`}
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </SubPageLayout>
  );
}
