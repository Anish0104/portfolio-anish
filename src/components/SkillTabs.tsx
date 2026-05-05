"use client";

import { motion } from "framer-motion";

type Skill = {
  name: string;
  color: string;
  /** simpleicons.org slug — leave empty to use devicon or svg fallback */
  slug?: string;
  /** devicons icon name (uses devicon CDN) */
  devicon?: string;
  /** inline SVG path data (single path, viewBox 0 0 24 24) */
  svgPath?: string;
  proficiency: number;
};

type Category = {
  label: string;
  accent: string;
  skills: Skill[];
};

const categories: Category[] = [
  {
    label: "Languages",
    accent: "#3776ab",
    skills: [
      { name: "Python",     color: "#3776ab", slug: "python",     proficiency: 92 },
      { name: "JavaScript", color: "#f7df1e", slug: "javascript", proficiency: 85 },
      { name: "TypeScript", color: "#3b82f6", slug: "typescript", proficiency: 82 },
      { name: "C",          color: "#6b7280", slug: "c",          proficiency: 72 },
      { name: "SQL",        color: "#4479a1", slug: "mysql",      proficiency: 80 },
    ],
  },
  {
    label: "AI & Machine Learning",
    accent: "#ee4c2c",
    skills: [
      { name: "PyTorch",     color: "#ee4c2c", slug: "pytorch",    proficiency: 85 },
      { name: "TensorFlow",  color: "#ff6f00", slug: "tensorflow", proficiency: 78 },
      { name: "Scikit-Learn",color: "#f7931e", slug: "scikitlearn",proficiency: 85 },
      { name: "Pandas",      color: "#9b72f7", slug: "pandas",     proficiency: 90 },
      { name: "NumPy",       color: "#4dabcf", slug: "numpy",      proficiency: 88 },
      { name: "HuggingFace", color: "#f5c518", slug: "huggingface",proficiency: 82 },
      {
        name: "Fine-tuning",
        color: "#a855f7",
        proficiency: 78,
        svgPath: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-3.5 5.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm1 3.5h5v3.5a2.5 2.5 0 0 1-5 0V14z",
      },
      {
        name: "PPO / RL",
        color: "#06b6d4",
        proficiency: 75,
        svgPath: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
      },
    ],
  },
  {
    label: "Generative AI & NLP",
    accent: "#a855f7",
    skills: [
      { name: "LLMs / RAG",   color: "#a855f7", slug: "openai",    proficiency: 88 },
      { name: "LangChain",    color: "#16a34a", slug: "langchain",  proficiency: 85 },
      { name: "ChromaDB",     color: "#e040fb", slug: "chroma",     proficiency: 80 },
      { name: "Gemini API",   color: "#4285f4", slug: "google",     proficiency: 82 },
      { name: "Groq / LLaMA",color: "#f97316", slug: "meta",       proficiency: 78 },
    ],
  },
  {
    label: "Computer Vision",
    accent: "#2563eb",
    skills: [
      { name: "YOLOv8",      color: "#2563eb", slug: "ultralytics", proficiency: 80 },
      { name: "OpenCV",      color: "#5c5cff", slug: "opencv",      proficiency: 82 },
      {
        name: "ByteTrack",
        color: "#06b6d4",
        proficiency: 75,
        svgPath: "M3 6h18M3 12h18M3 18h18M7 3v18M12 3v18M17 3v18",
      },
      { name: "Ultralytics", color: "#3b82f6", slug: "ultralytics", proficiency: 78 },
    ],
  },
  {
    label: "Web & Backend",
    accent: "#10b981",
    skills: [
      { name: "Next.js",    color: "#111827", slug: "nextdotjs",  proficiency: 85 },
      { name: "React",      color: "#61dafb", slug: "react",      proficiency: 83 },
      { name: "FastAPI",    color: "#059669", slug: "fastapi",    proficiency: 85 },
      { name: "Flask",      color: "#111827", slug: "flask",      proficiency: 78 },
      { name: "Streamlit",  color: "#ff4b4b", slug: "streamlit",  proficiency: 80 },
      { name: "Supabase",   color: "#3ecf8e", slug: "supabase",   proficiency: 78 },
      { name: "Firebase",   color: "#ffca28", slug: "firebase",   proficiency: 75 },
      { name: "Tailwind",   color: "#38bdf8", slug: "tailwindcss",proficiency: 88 },
      { name: "shadcn/ui",  color: "#111827", slug: "shadcnui",   proficiency: 80 },
    ],
  },
  {
    label: "MLOps & Infrastructure",
    accent: "#2496ed",
    skills: [
      { name: "Docker",     color: "#2496ed", slug: "docker",           proficiency: 72 },
      { name: "AWS",        color: "#ff9900", slug: "amazonaws",        proficiency: 70 },
      { name: "GCP",        color: "#4285f4", slug: "googlecloud",      proficiency: 68 },
      { name: "Git",        color: "#f05032", slug: "git",              proficiency: 92 },
      { name: "Vercel",     color: "#111827", slug: "vercel",           proficiency: 85 },
      { name: "W&B",        color: "#f5c518", slug: "weightsandbiases", proficiency: 75 },
      { name: "HF Spaces",  color: "#f5c518", slug: "huggingface",      proficiency: 78 },
      { name: "Anaconda",   color: "#44a833", slug: "anaconda",         proficiency: 88 },
    ],
  },
];

function SkillIcon({ skill }: { skill: Skill }) {
  const initials = skill.name
    .replace(/[^a-zA-Z0-9\s/&]/g, "")
    .split(/[\s/&]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  if (skill.svgPath) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={skill.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d={skill.svgPath} />
      </svg>
    );
  }

  if (skill.slug) {
    return (
      <img
        src={`https://cdn.simpleicons.org/${skill.slug}/${skill.color.replace("#", "")}`}
        alt={skill.name}
        className="w-full h-full object-contain"
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.style.display = "none";
          const parent = img.parentElement;
          if (parent) {
            parent.innerHTML = `<span style="color:${skill.color};font-size:12px;font-weight:900;letter-spacing:-0.03em;font-family:monospace">${initials}</span>`;
          }
        }}
      />
    );
  }

  return (
    <span style={{ color: skill.color, fontSize: 13, fontWeight: 900, fontFamily: "monospace", letterSpacing: "-0.03em" }}>
      {initials}
    </span>
  );
}

function SkillCircle({ skill, index }: { skill: Skill; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-2.5"
    >
      <div
        className="group relative w-[80px] h-[80px] md:w-[88px] md:h-[88px] rounded-full cursor-pointer transition-all duration-300"
        style={{
          border: `1.5px solid ${skill.color}45`,
          background: "rgba(255,255,255,0.7)",
          boxShadow: "0 1px 6px rgba(15,23,42,0.06)",
        }}
      >
        {/* Hover ring glow */}
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
          style={{
            background: `radial-gradient(circle, ${skill.color}14 0%, transparent 70%)`,
            border: `1.5px solid ${skill.color}80`,
            boxShadow: `0 0 18px ${skill.color}30`,
          }}
        />

        {/* Icon — fades on hover */}
        <div className="absolute inset-0 flex items-center justify-center p-[22px] transition-opacity duration-300 group-hover:opacity-0">
          <SkillIcon skill={skill} />
        </div>

        {/* Proficiency — reveals on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <span className="text-sm font-black tracking-tight" style={{ color: skill.color }}>
            {skill.proficiency}%
          </span>
        </div>
      </div>

      <span className="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)] text-center leading-tight max-w-[76px]">
        {skill.name}
      </span>
    </motion.div>
  );
}

export default function SkillTabs() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-14">
      <p className="text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--muted)] opacity-50">
        Hover to reveal proficiency
      </p>

      {categories.map((cat, catIdx) => (
        <motion.div
          key={cat.label}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: catIdx * 0.07, duration: 0.55, ease: "easeOut" }}
        >
          {/* Category header */}
          <div className="flex items-center gap-3 mb-8">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: cat.accent, boxShadow: `0 0 8px ${cat.accent}60` }}
            />
            <span className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--foreground)]">
              {cat.label}
            </span>
            <div className="flex-1 h-px" style={{ background: `${cat.accent}20` }} />
            <span className="text-[9px] font-semibold text-[var(--muted)] tabular-nums">
              {cat.skills.length} skills
            </span>
          </div>

          {/* Skills grid */}
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-8">
            {cat.skills.map((skill, i) => (
              <SkillCircle key={skill.name} skill={skill} index={i} />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
