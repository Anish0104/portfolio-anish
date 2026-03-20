"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import Image from "next/image";

const skills = [
  { name: "Python", color: "#3776ab", slug: "python" },
  { name: "PyTorch", color: "#ee4c2c", slug: "pytorch" },
  { name: "TensorFlow", color: "#ff6f00", slug: "tensorflow" },
  { name: "LLMs / RAG", color: "#a855f7", slug: "google-gemini" },
  { name: "YOLOv8", color: "#2563eb", slug: "opencv" },
  { name: "Next.js", color: "#ffffff", slug: "nextdotjs" },
  { name: "TypeScript", color: "#3178c6", slug: "typescript" },
  { name: "Tailwind", color: "#38bdf8", slug: "tailwindcss" },
  { name: "Supabase", color: "#3ecf8e", slug: "supabase" },
  { name: "Firebase", color: "#ffca28", slug: "firebase" },
  { name: "FastAPI", color: "#05998b", slug: "fastapi" },
  { name: "OpenCV", color: "#5c3ee8", slug: "opencv" },
  { name: "PostgreSQL", color: "#336791", slug: "postgresql" },
  { name: "Pandas", color: "#150458", slug: "pandas" },
  { name: "Scikit-Learn", color: "#f7931e", slug: "scikitlearn" },
  { name: "Docker", color: "#2496ed", slug: "docker" },
  { name: "AWS", color: "#ff9900", slug: "amazonwebservices" },
  { name: "Google Cloud", color: "#4285f4", slug: "googlecloud" },
  { name: "Git", color: "#f05032", slug: "git" },
  { name: "LangChain", color: "#1c3c3c", slug: "langchain" },
  { name: "NLP", color: "#10b981", slug: "spacy" },
  { name: "CV", color: "#f43f5e", slug: "python" },
  { name: "MongoDB", color: "#47a248", slug: "mongodb" },
  { name: "Framer Motion", color: "#00d8ff", slug: "framer" },
  { name: "Vercel", color: "#ffffff", slug: "vercel" },
  { name: "Anaconda", color: "#44a833", slug: "anaconda" },
];

const RADIUS = 280;

// Fibonacci Sphere math
const points = skills.map((skill, i) => {
  const phi = Math.acos(-1 + (2 * i) / skills.length);
  const theta = Math.sqrt(skills.length * Math.PI) * phi;
  return {
    ...skill,
    x: RADIUS * Math.cos(theta) * Math.sin(phi),
    y: RADIUS * Math.sin(theta) * Math.sin(phi),
    z: RADIUS * Math.cos(phi),
  };
});

// Triangulation lines for technical grid
const wireframeLines: { x1: number; y1: number; x2: number; y2: number; z: number }[] = [];
for (let i = 0; i < points.length; i++) {
  const sorted = [...points]
    .map((p, idx) => ({ idx, dist: Math.hypot(p.x - points[i].x, p.y - points[i].y, p.z - points[i].z) }))
    .sort((a, b) => a.dist - b.dist);
  
  [sorted[1], sorted[2]].forEach(s => {
    wireframeLines.push({
      x1: points[i].x, y1: points[i].y,
      x2: points[s.idx].x, y2: points[s.idx].y,
      z: (points[i].z + points[s.idx].z) / 2
    });
  });
}

function rotatePoint(x: number, y: number, z: number, angleX: number, angleY: number) {
  let cos = Math.cos(angleY);
  let sin = Math.sin(angleY);
  let x1 = x * cos - z * sin;
  let z1 = x * sin + z * cos;
  cos = Math.cos(angleX);
  sin = Math.sin(angleX);
  let y1 = y * cos - z1 * sin;
  let z2 = y * sin + z1 * cos;
  return { x: x1, y: y1, z: z2 };
}

export default function SkillSphere() {
  const [mounted, setMounted] = useState(false);
  const [angleX, setAngleX] = useState(0);
  const [angleY, setAngleY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0.005, y: 0.005 });
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 40, stiffness: 150 };
  const tiltX = useSpring(useTransform(mouseY, [-400, 400], [0.12, -0.12]), springConfig);
  const tiltY = useSpring(useTransform(mouseX, [-400, 400], [-0.12, 0.12]), springConfig);

  useEffect(() => {
    setMounted(true);
    const updateMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", updateMouse);
    return () => window.removeEventListener("mousemove", updateMouse);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (dragging) return;
    const interval = requestAnimationFrame(() => {
      setAngleX((prev) => prev + velocity.x);
      setAngleY((prev) => prev + velocity.y);
      setVelocity(v => ({ x: v.x * 0.99, y: v.y * 0.99 }));
      if (Math.abs(velocity.x) < 0.002) setVelocity(v => ({ ...v, x: 0.002 }));
      if (Math.abs(velocity.y) < 0.002) setVelocity(v => ({ ...v, y: 0.002 }));
    });
    return () => cancelAnimationFrame(interval);
  }, [angleX, angleY, dragging, velocity]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleGlobalMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    const dx = (e.clientX - lastMouse.x) * 0.01;
    const dy = (e.clientY - lastMouse.y) * 0.01;
    setAngleY((prev) => prev + dx);
    setAngleX((prev) => prev - dy);
    setLastMouse({ x: e.clientX, y: e.clientY });
    setVelocity({ x: -dy * 0.5, y: dx * 0.5 });
  };

  const stopDragging = () => setDragging(false);

  if (!mounted) return <div className="h-[600px] w-full" />;

  const currentAngleX = angleX + tiltX.get();
  const currentAngleY = angleY + tiltY.get();

  const renderedPoints = points.map((p) => {
    const r = rotatePoint(p.x, p.y, p.z, currentAngleX, currentAngleY);
    const perspective = (r.z + RADIUS * 2) / (RADIUS * 3);
    const opacity = (r.z + RADIUS) / (RADIUS * 2);
    return { ...p, ...r, scale: perspective, opacity };
  });

  const renderedWire = wireframeLines.map((ln) => {
    const p1 = rotatePoint(ln.x1, ln.y1, ln.z, currentAngleX, currentAngleY);
    const p2 = rotatePoint(ln.x2, ln.y2, ln.z, currentAngleX, currentAngleY);
    const zMid = (p1.z + p2.z) / 2;
    const depth = (zMid + RADIUS) / (2 * RADIUS);
    return { p1, p2, opacity: 0.05 + depth * 0.15 };
  });

  return (
    <div 
      className="relative w-full h-[600px] flex items-center justify-center cursor-grab active:cursor-grabbing preserve-3d"
      onMouseDown={handleMouseDown}
      onMouseMove={handleGlobalMouseMove}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
    >
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" 
        viewBox="-400 -300 800 600"
      >
        {renderedWire.map((line, i) => (
          <line
            key={i}
            x1={line.p1.x}
            y1={line.p1.y}
            x2={line.p2.x}
            y2={line.p2.y}
            stroke="currentColor"
            strokeWidth="0.5"
            strokeOpacity={line.opacity}
            className="text-[var(--accent-blue)]"
          />
        ))}
      </svg>

      <div className="relative">
        {renderedPoints.map((p, i) => (
          <motion.div
            key={i}
            style={{
              x: p.x,
              y: p.y,
              scale: p.scale,
              opacity: 0.15 + p.opacity * 0.85,
              zIndex: Math.round(p.z + RADIUS),
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border border-[var(--card-border)] bg-[var(--card-bg)] shadow-2xl transition-all duration-300"
            >
              <div className="w-5 h-5 relative shrink-0">
                <img
                  src={`https://cdn.simpleicons.org/${p.slug}/${p.color.replace('#', '')}`}
                  alt={p.name}
                  className="object-contain w-full h-full"
                  onError={(e) => {
                     // Fallback for dark themes or missing slugs
                     (e.target as HTMLImageElement).src = `https://cdn.simpleicons.org/${p.slug}/white`;
                  }}
                />
              </div>
              <span 
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: p.color }}
              >
                {p.name}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="absolute w-40 h-40 bg-[var(--accent-blue)]/5 rounded-full blur-[80px] pointer-events-none animate-pulse" />
    </div>
  );
}
