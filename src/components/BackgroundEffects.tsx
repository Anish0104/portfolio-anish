"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function BackgroundEffects() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for high-performance feel
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
      {/* Interactive Radial Glow (Spotlight) */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "var(--blend-mode)" as any,
          opacity: "var(--blob-opacity)" as any,
        }}
        className="absolute w-[1000px] h-[1000px] rounded-full bg-[var(--accent-purple)] blur-[130px]"
      />
      
      <motion.div
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "var(--blend-mode)" as any,
          opacity: "var(--blob-opacity)" as any,
        }}
        transition={{ delay: 0.1 }}
        className="absolute w-[800px] h-[800px] rounded-full bg-[var(--accent-blue)] blur-[110px]"
      />

      {/* Animated Mesh Blobs - Immersive movement */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        style={{
          mixBlendMode: "var(--blend-mode)" as any,
          opacity: "var(--blob-opacity)" as any,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full bg-[var(--accent-blue)] blur-[150px]"
      />

      <motion.div
        animate={{
          x: [0, -120, 80, 0],
          y: [0, 150, -80, 0],
          scale: [1, 0.8, 1.1, 1],
        }}
        style={{
          mixBlendMode: "var(--blend-mode)" as any,
          opacity: "var(--blob-opacity)" as any,
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[900px] h-[900px] rounded-full bg-[var(--accent-purple)] blur-[180px]"
      />

      <motion.div
        animate={{
          x: [0, 200, -100, 0],
          y: [0, 300, -150, 0],
        }}
        style={{
          mixBlendMode: "var(--blend-mode)" as any,
          opacity: "var(--blob-opacity)" as any,
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
        className="absolute top-[30%] left-[40%] w-[600px] h-[600px] rounded-full bg-[var(--accent-blue)] blur-[160px]"
      />
    </div>
  );
}
