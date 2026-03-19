"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

interface SkillItem {
  id: string;
  label: string;
  iconUrl: string;
}

const skills: SkillItem[] = [
  { id: "python",     label: "PYTHON",      iconUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" },
  { id: "pytorch",    label: "PYTORCH",     iconUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/pytorch/pytorch-original.svg" },
  { id: "tensorflow", label: "TENSORFLOW",  iconUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/tensorflow/tensorflow-original.svg" },
  { id: "react",      label: "REACT",       iconUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" },
  { id: "nextjs",     label: "NEXT.JS",     iconUrl: "https://cdn.simpleicons.org/nextdotjs/white" },
  { id: "typescript", label: "TYPESCRIPT",  iconUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" },
  { id: "docker",     label: "DOCKER",      iconUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg" },
  { id: "aws",        label: "AWS",         iconUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
  { id: "opencv",     label: "OPENCV",      iconUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/opencv/opencv-original.svg" },
  { id: "fastapi",    label: "FASTAPI",     iconUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/fastapi/fastapi-original.svg" },
  { id: "pandas",     label: "PANDAS",      iconUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/pandas/pandas-original.svg" },
  { id: "numpy",      label: "NUMPY",       iconUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/numpy/numpy-original.svg" },
  { id: "supabase",   label: "SUPABASE",    iconUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/supabase/supabase-original.svg" },
  { id: "firebase",   label: "FIREBASE",    iconUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/firebase/firebase-plain.svg" },
  { id: "postgresql", label: "POSTGRESQL",  iconUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg" },
  { id: "mongodb",    label: "MONGODB",     iconUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg" },
  { id: "git",        label: "GIT",         iconUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg" },
  { id: "linux",      label: "LINUX",       iconUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/linux/linux-original.svg" },
  { id: "anaconda",   label: "ANACONDA",    iconUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/anaconda/anaconda-original.svg" },
  { id: "scipy",      label: "SCIPY",       iconUrl: "https://cdn.simpleicons.org/scipy" },
  { id: "scikitlearn",label: "SKLEARN",     iconUrl: "https://raw.githubusercontent.com/devicons/devicon/master/icons/scikitlearn/scikitlearn-original.svg" },
  { id: "huggingface",label: "HUGGING FACE",iconUrl: "https://cdn.simpleicons.org/huggingface" },
];

// Point on a sphere via fibonacci distribution
function fibonacci3D(n: number, total: number, radius: number) {
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  const theta = Math.acos(1 - (2 * n) / (total - 1));
  const phi = (2 * Math.PI * n) / goldenRatio;
  return {
    x: radius * Math.sin(theta) * Math.cos(phi),
    y: radius * Math.sin(theta) * Math.sin(phi),
    z: radius * Math.cos(theta),
  };
}

// Rotate a 3D point by angles around X and Y
function rotatePoint(
  x: number, y: number, z: number,
  angleX: number, angleY: number
) {
  // Rotate around Y axis
  const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
  const x1 = x * cosY + z * sinY;
  const z1 = -x * sinY + z * cosY;

  // Rotate around X axis
  const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
  const y2 = y * cosX - z1 * sinX;
  const z2 = y * sinX + z1 * cosX;

  return { x: x1, y: y2, z: z2 };
}

const RADIUS = 200;
const TOTAL = skills.length;

// Pre-compute base positions
const basePositions = skills.map((_, i) => fibonacci3D(i, TOTAL, RADIUS));

// Build wireframe lines as pairs of lat/lon rings
const WIREFRAME_SEGMENTS = 24;
function buildWireframeLines() {
  const lines: { x1: number; y1: number; x2: number; y2: number; z: number }[] = [];
  const R = RADIUS;

  // Latitude circles (5 rings)
  for (let lat = -60; lat <= 60; lat += 30) {
    const y = R * Math.sin((lat * Math.PI) / 180);
    const r = R * Math.cos((lat * Math.PI) / 180);
    for (let i = 0; i < WIREFRAME_SEGMENTS; i++) {
      const a1 = (i / WIREFRAME_SEGMENTS) * Math.PI * 2;
      const a2 = ((i + 1) / WIREFRAME_SEGMENTS) * Math.PI * 2;
      lines.push({
        x1: r * Math.cos(a1), y1: y, x2: r * Math.cos(a2), y2: y,
        z: (r * Math.sin(a1) + r * Math.sin(a2)) / 2,
      });
    }
  }
  // Longitude meridians (6 lines)
  for (let lon = 0; lon < 180; lon += 30) {
    for (let i = 0; i < WIREFRAME_SEGMENTS; i++) {
      const lat1 = (i / WIREFRAME_SEGMENTS) * Math.PI * 2 - Math.PI;
      const lat2 = ((i + 1) / WIREFRAME_SEGMENTS) * Math.PI * 2 - Math.PI;
      const angle = (lon * Math.PI) / 180;
      lines.push({
        x1: R * Math.sin(lat1) * Math.cos(angle),
        y1: R * Math.cos(lat1),
        x2: R * Math.sin(lat2) * Math.cos(angle),
        y2: R * Math.cos(lat2),
        z: (R * Math.sin(lat1) * Math.sin(angle) + R * Math.sin(lat2) * Math.sin(angle)) / 2,
      });
    }
  }
  return lines;
}

const wireframeLines = buildWireframeLines();

export default function SkillSphere() {
  const [angleX, setAngleX] = useState(0.3);
  const [angleY, setAngleY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  
  const rafRef = useRef<number | null>(null);
  const anglesRef = useRef({ x: 0.3, y: 0 });
  const pausedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    const animate = () => {
      if (!pausedRef.current) {
        anglesRef.current.y += 0.003;
        anglesRef.current.x += 0.0005;
        setAngleX(anglesRef.current.x);
        setAngleY(anglesRef.current.y);
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
    pausedRef.current = true;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // 1. Calculate Parallax Tilt (Even when not dragging)
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Normalize -1 to 1 based on distance from center
    const offX = (e.clientX - centerX) / (rect.width / 2);
    const offY = (e.clientY - centerY) / (rect.height / 2);
    
    // Subtle tilt: max 0.15 radians
    setMouseOffset({ x: offY * 0.15, y: offX * 0.15 });

    // 2. Drag Logic
    if (dragging) {
      const dx = e.clientX - lastMouse.x;
      const dy = e.clientY - lastMouse.y;
      anglesRef.current.y += dx * 0.005;
      anglesRef.current.x += dy * 0.005;
      setAngleX(anglesRef.current.x);
      setAngleY(anglesRef.current.y);
      setLastMouse({ x: e.clientX, y: e.clientY });
    }
  }, [dragging, lastMouse]);

  const handleMouseUp = useCallback(() => {
    setDragging(false);
    pausedRef.current = false;
  }, []);

  if (!mounted) return <div style={{ height: 600 }} />;

  // Display angles = auto-rotation + drag + mouse parallax
  const renderAngleX = angleX + mouseOffset.x;
  const renderAngleY = angleY + mouseOffset.y;

  // Compute rotated positions for icons
  const rotatedSkills = skills.map((skill, i) => {
    const base = basePositions[i];
    const { x, y, z } = rotatePoint(base.x, base.y, base.z, renderAngleX, renderAngleY);
    // depth-based opacity & scale: z ranges from -RADIUS to +RADIUS
    const depth = (z + RADIUS) / (2 * RADIUS); // 0=back, 1=front
    const opacity = 0.2 + depth * 0.8;
    const scale = 0.5 + depth * 0.7;
    const size = 48 * scale;
    return { skill, x, y, z, opacity, scale, size };
  });

  // Sort back-to-front
  rotatedSkills.sort((a, b) => a.z - b.z);

  // Wireframe: rotate and project
  const rotatedWire = wireframeLines.map((ln) => {
    const p1 = rotatePoint(ln.x1, ln.y1, ln.z, renderAngleX, renderAngleY);
    const p2 = rotatePoint(ln.x2, ln.y2, ln.z, renderAngleX, renderAngleY);
    const zMid = (ln.z + p2.z) / 2; // Approximate mid Z for opacity
    const depth = (zMid + RADIUS) / (2 * RADIUS);
    return { p1, p2, opacity: 0.04 + depth * 0.1 };
  });

  const viewSize = 520;
  const cx = viewSize / 2;
  const cy = viewSize / 2;

  return (
    <div
      className="relative w-full mx-auto flex items-center justify-center select-none"
      style={{ height: 600, cursor: dragging ? "grabbing" : "grab" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <svg
        width={viewSize}
        height={viewSize}
        viewBox={`0 0 ${viewSize} ${viewSize}`}
        style={{ overflow: "visible", pointerEvents: "none", position: "absolute" }}
      >
        {/* Outer glow ring */}
        <circle
          cx={cx} cy={cy} r={RADIUS + 5}
          fill="none"
          stroke="rgba(147,112,219,0.18)"
          strokeWidth={1}
          filter="url(#glow)"
        />
        <defs>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Wireframe Lines */}
        {rotatedWire.map((ln, i) => (
          <line
            key={i}
            x1={cx + ln.p1.x} y1={cy - ln.p1.y}
            x2={cx + ln.p2.x} y2={cy - ln.p2.y}
            stroke="var(--accent-purple)"
            strokeOpacity={ln.opacity}
            strokeWidth={0.8}
          />
        ))}
      </svg>

      {/* Icons rendered as DOM elements for crisp SVG rendering */}
      <div
        style={{
          position: "absolute",
          width: viewSize,
          height: viewSize,
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      >
        {rotatedSkills.map(({ skill, x, y, opacity, scale, size }) => {
          const px = cx + x;
          const py = cy - y;
          return (
            <div
              key={skill.id}
              style={{
                position: "absolute",
                left: px,
                top: py,
                transform: `translate(-50%, -50%)`,
                opacity,
                transition: "opacity 0.05s",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 5,
                pointerEvents: "none",
              }}
            >
              {/* Icon */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={skill.iconUrl}
                alt={skill.label}
                style={{
                  width: size,
                  height: size,
                  objectFit: "contain",
                  filter: `drop-shadow(0 0 ${6 * scale}px rgba(168,85,247,${0.3 * opacity}))`,
                  transition: "width 0.05s, height 0.05s",
                }}
              />
              {/* Label */}
              <span
                style={{
                  fontSize: Math.max(8, 10 * scale),
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: "var(--foreground)",
                  opacity: 0.6 + opacity * 0.4,
                  textTransform: "uppercase",
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                  lineHeight: 1,
                }}
              >
                {skill.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
