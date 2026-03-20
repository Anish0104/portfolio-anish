"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";

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

const RADIUS = 300;

// Pre-compute sphere positions on module load (runs once)
const basePoints = skills.map((skill, i) => {
  const phi = Math.acos(-1 + (2 * i) / skills.length);
  const theta = Math.sqrt(skills.length * Math.PI) * phi;
  return {
    ...skill,
    x: RADIUS * Math.cos(theta) * Math.sin(phi),
    y: RADIUS * Math.sin(theta) * Math.sin(phi),
    z: RADIUS * Math.cos(phi),
  };
});

// Pre-compute wireframe connections (runs once)
const wireframeConnections: { i1: number; i2: number }[] = [];
for (let i = 0; i < basePoints.length; i++) {
  const sorted = basePoints
    .map((p, idx) => ({
      idx,
      dist: Math.hypot(
        p.x - basePoints[i].x,
        p.y - basePoints[i].y,
        p.z - basePoints[i].z
      ),
    }))
    .sort((a, b) => a.dist - b.dist);
  [sorted[1], sorted[2]].forEach((s) => {
    wireframeConnections.push({ i1: i, i2: s.idx });
  });
}

function rotatePoint(
  x: number,
  y: number,
  z: number,
  angleX: number,
  angleY: number
) {
  const cosY = Math.cos(angleY);
  const sinY = Math.sin(angleY);
  const x1 = x * cosY - z * sinY;
  const z1 = x * sinY + z * cosY;
  const cosX = Math.cos(angleX);
  const sinX = Math.sin(angleX);
  const y1 = y * cosX - z1 * sinX;
  const z2 = y * sinX + z1 * cosX;
  return { x: x1, y: y1, z: z2 };
}

export default function SkillSphere() {
  const [mounted, setMounted] = useState(false);

  // All animation state stored in refs — no re-renders during animation
  const angleXRef = useRef(0);
  const angleYRef = useRef(0);
  const velocityRef = useRef({ x: 0.005, y: 0.005 });
  const draggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  // DOM refs for direct manipulation
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);

  const animate = useCallback(() => {
    if (!draggingRef.current) {
      const vel = velocityRef.current;
      angleXRef.current += vel.x;
      angleYRef.current += vel.y;
      // Decay velocity, maintain minimum
      const newVx = Math.abs(vel.x) < 0.0025 ? 0.0025 : vel.x * 0.992;
      const newVy = Math.abs(vel.y) < 0.0025 ? 0.0025 : vel.y * 0.992;
      velocityRef.current = { x: newVx, y: newVy };
    }

    const aX = angleXRef.current;
    const aY = angleYRef.current;

    // Update each skill node DOM element directly
    basePoints.forEach((p, i) => {
      const r = rotatePoint(p.x, p.y, p.z, aX, aY);
      const perspective = (r.z + RADIUS * 2) / (RADIUS * 3);
      const opacity = 0.15 + ((r.z + RADIUS) / (RADIUS * 2)) * 0.85;
      const zIndex = Math.round(r.z + RADIUS);

      const el = nodeRefs.current[i];
      if (el) {
        el.style.transform = `translate(${r.x}px, ${r.y}px) scale(${perspective})`;
        el.style.opacity = `${opacity}`;
        el.style.zIndex = `${zIndex}`;
      }
    });

    // Update wireframe lines directly on SVG elements
    wireframeConnections.forEach((conn, i) => {
      const p1 = rotatePoint(
        basePoints[conn.i1].x,
        basePoints[conn.i1].y,
        basePoints[conn.i1].z,
        aX,
        aY
      );
      const p2 = rotatePoint(
        basePoints[conn.i2].x,
        basePoints[conn.i2].y,
        basePoints[conn.i2].z,
        aX,
        aY
      );
      const zMid = (p1.z + p2.z) / 2;
      const depth = (zMid + RADIUS) / (2 * RADIUS);
      const lineOpacity = 0.02 + depth * 0.12;

      const lineEl = lineRefs.current[i];
      if (lineEl) {
        lineEl.setAttribute("x1", String(p1.x));
        lineEl.setAttribute("y1", String(p1.y));
        lineEl.setAttribute("x2", String(p2.x));
        lineEl.setAttribute("y2", String(p2.y));
        lineEl.setAttribute("stroke-opacity", String(lineOpacity));
      }
    });

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [mounted, animate]);

  const handleMouseDown = (e: React.MouseEvent) => {
    draggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingRef.current) return;
    const dx = (e.clientX - lastMouseRef.current.x) * 0.01;
    const dy = (e.clientY - lastMouseRef.current.y) * 0.01;
    angleYRef.current += dx;
    angleXRef.current -= dy;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
    velocityRef.current = { x: -dy * 0.5, y: dx * 0.5 };
  };

  const stopDragging = () => {
    draggingRef.current = false;
  };

  if (!mounted) return <div className="h-[650px] w-full" />;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[650px] flex items-center justify-center cursor-grab active:cursor-grabbing preserve-3d"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
    >
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        viewBox="-400 -300 800 600"
      >
        {wireframeConnections.map((_, i) => (
          <line
            key={i}
            ref={(el) => { lineRefs.current[i] = el; }}
            stroke="currentColor"
            strokeWidth="0.5"
            strokeOpacity="0.02"
            className="text-[var(--accent-blue)]"
          />
        ))}
      </svg>

      <div className="relative">
        {basePoints.map((p, i) => (
          <div
            key={i}
            ref={(el) => { nodeRefs.current[i] = el; }}
            style={{
              position: "absolute",
              transform: `translate(${p.x}px, ${p.y}px)`,
              opacity: 0.5,
            }}
            className="-translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <div className="flex flex-col items-center gap-1 group transition-all duration-300 transform">
              <div
                className="w-10 h-10 p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white/10"
                style={{ boxShadow: `0 0 20px ${p.color}22` }}
              >
                <img
                  src={`https://cdn.simpleicons.org/${p.slug}/${p.color.replace("#", "")}`}
                  alt={p.name}
                  className="object-contain w-full h-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://cdn.simpleicons.org/${p.slug}/white`;
                  }}
                />
              </div>
              <span
                className="text-[8px] font-black uppercase tracking-[0.2em] whitespace-nowrap opacity-60 transition-opacity group-hover:opacity-100"
                style={{ color: p.color }}
              >
                {p.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute w-40 h-40 bg-[var(--accent-blue)]/5 rounded-full blur-[80px] pointer-events-none animate-pulse" />
    </div>
  );
}
