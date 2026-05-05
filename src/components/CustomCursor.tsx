"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);

  /* Dot follows cursor precisely */
  const dotX = useSpring(rawX, { stiffness: 800, damping: 40, mass: 0.3 });
  const dotY = useSpring(rawY, { stiffness: 800, damping: 40, mass: 0.3 });

  /* Ring lags behind with a softer spring */
  const ringX = useSpring(rawX, { stiffness: 160, damping: 20, mass: 0.6 });
  const ringY = useSpring(rawY, { stiffness: 160, damping: 20, mass: 0.6 });

  useEffect(() => {
    /* Only enable on non-touch devices */
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onLeave  = () => setVisible(false);
    const onEnter  = () => setVisible(true);
    const onDown   = () => setClicking(true);
    const onUp     = () => setClicking(false);

    const onHoverStart = () => setHovering(true);
    const onHoverEnd   = () => setHovering(false);

    const interactables = "a, button, [role='button'], input, textarea, select, label, [data-cursor='pointer']";

    const attachHover = () => {
      document.querySelectorAll<HTMLElement>(interactables).forEach((el) => {
        el.addEventListener("mouseenter", onHoverStart);
        el.addEventListener("mouseleave", onHoverEnd);
      });
    };

    /* Observe DOM changes to re-attach on new elements */
    const observer = new MutationObserver(attachHover);
    observer.observe(document.body, { childList: true, subtree: true });
    attachHover();

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    /* Hide the native cursor via style tag */
    const style = document.createElement("style");
    style.id = "custom-cursor-hide";
    style.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(style);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      observer.disconnect();
      document.getElementById("custom-cursor-hide")?.remove();
    };
  }, [rawX, rawY, visible]);

  if (!visible) return null;

  return (
    <>
      {/* Outer ring — lags, expands on hover */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] rounded-full border pointer-events-none"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          borderColor: "rgba(37,99,235,0.45)",
        }}
        animate={{
          width:   hovering ? 44 : clicking ? 20 : 32,
          height:  hovering ? 44 : clicking ? 20 : 32,
          opacity: visible ? 1 : 0,
          borderWidth: hovering ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      />

      {/* Inner dot — precise, shrinks on hover */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] rounded-full pointer-events-none"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          background: "linear-gradient(135deg, #2563eb, #7c3aed)",
        }}
        animate={{
          width:   hovering ? 6 : clicking ? 10 : 8,
          height:  hovering ? 6 : clicking ? 10 : 8,
          opacity: visible ? 1 : 0,
          scale:   clicking ? 0.7 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      />
    </>
  );
}
