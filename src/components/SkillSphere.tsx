"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";

const skills = [
  { name: "Python", color: "#3776ab" },
  { name: "PyTorch", color: "#ee4c2c" },
  { name: "TensorFlow", color: "#ff6f00" },
  { name: "LLMs / RAG", color: "#a855f7" },
  { name: "YOLOv8", color: "#2563eb" },
  { name: "Next.js", color: "#ffffff" },
  { name: "TypeScript", color: "#3178c6" },
  { name: "Tailwind", color: "#38bdf8" },
  { name: "Supabase", color: "#3ecf8e" },
  { name: "Firebase", color: "#ffca28" },
  { name: "FastAPI", color: "#05998b" },
  { name: "OpenCV", color: "#5c3ee8" },
  { name: "PostgreSQL", color: "#336791" },
  { name: "Pandas", color: "#150458" },
  { name: "Scikit-Learn", color: "#f7931e" },
  { name: "Docker", color: "#2496ed" },
  { name: "AWS", color: "#ff9900" },
  { name: "Google Cloud", color: "#4285f4" },
  { name: "Git", color: "#f05032" },
  { name: "LangChain", color: "#1c3c3c" },
  { name: "NLP", color: "#10b981" },
  { name: "CV", color: "#f43f5e" },
  { name: "MongoDB", color: "#47a248" },
  { name: "Framer Motion", color: "#00d8ff" },
  { name: "Vercel", color: "#ffffff" },
  { name: "Anaconda", color: "#44a833" },
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

// Helper for wireframe triangulation
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
  const springConfig = { damping: 30, stiffness: 200 };
  const tiltX = useSpring(useTransform(mouseY, [-400, 400], [0.1, -0.1]), springConfig);
  const tiltY = useSpring(useTransform(mouseX, [-400, 400], [-0.1, 0.1]), springConfig);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (dragging) return;
    const frame = requestAnimationFrame(() => {
      setAngleX((prev) => prev + velocity.x);
      setAngleY((prev) => prev + velocity.y);
      setVelocity(v => ({ x: v.x * 0.99, y: v.y * 0.99 }));
      if (Math.abs(velocity.x) < 0.002) setVelocity(v => ({ ...v, x: 0.002 }));
      if (Math.abs(velocity.y) < 0.002) setVelocity(v => ({ ...v, y: 0.002 }));
    });
    return () => cancelAnimationFrame(frame);
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

  const handleMouseUp = () => setDragging(false);

  if (!mounted) return <div className="h-[600px]" />;

  const renderAngleX = angleX + tiltX.get();
  const renderAngleY = angleY + tiltY.get();

  const rotatedPoints = points.map((p) => {
    const rotated = rotatePoint(p.x, p.y, p.z, renderAngleX, renderAngleY);
    const scale = (rotated.z + RADIUS * 2) / (RADIUS * 3);
    const opacity = (rotated.z + RADIUS) / (RADIUS * 2);
    return { ...p, ...rotated, scale, opacity };
  });

  const rotatedWire = wireframeLines.map((ln) => {
    const p1 = rotatePoint(ln.x1, ln.y1, ln.z, renderAngleX, renderAngleY);
    const p2 = rotatePoint(ln.x2, ln.y2, ln.z, renderAngleX, renderAngleY);
    const zMid = (p1.z + p2.z) / 2; 
    const depth = (zMid + RADIUS) / (2 * RADIUS);
    return { p1, p2, opacity: 0.04 + depth * 0.1 };
  });

  return (
    <div 
      className="relative w-full h-[600px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleGlobalMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent-blue)/5_0%,transparent_70%)] pointer-events-none" />
      
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
        <g transform="translate(50% 50%)">
           {rotatedWire.map((line, i) => (
             <line
               key={i}
               x1={line.p1.x}
               y1={line.p1.y}
               x2={line.p2.x}
               y2={line.p2.y}
               stroke="currentColor"
               strokeWidth="0.5"
               strokeOpacity={line.opacity}
               className="text-[var(--accent-blue)] opacity-20"
               style={{ transform: `translate(50%, 50%)` }} // Fallback if transform fails
             />
           ))}
        </g>
      </svg>

      <div className="relative">
        {rotatedPoints.map((p, i) => (
          <motion.div
            key={i}
            style={{
              x: p.x,
              y: p.y,
              scale: p.scale,
              opacity: 0.1 + p.opacity * 0.9,
              zIndex: Math.round(p.z + RADIUS),
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
          >
            <div 
              className="px-4 py-2 rounded-xl backdrop-blur-md border border-white/5 shadow-2xl transition-all duration-300 hover:border-[var(--accent-blue)] group"
              style={{ backgroundColor: `rgba(0,0,0,0.4)` }}
            >
              <div 
                className="text-[10px] font-black uppercase tracking-widest transition-colors duration-300 group-hover:text-white"
                style={{ color: p.color }}
              >
                {p.name}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
