"use client";

import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";

interface Props {
  to: number;
  format?: (n: number) => string;
  duration?: number;
}

export function CountUp({ to, format, duration = 1500 }: Props) {
  const ref    = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const raf = (now: number) => {
      const t      = Math.min((now - start) / duration, 1);
      const eased  = 1 - Math.pow(1 - t, 3); // ease-out-cubic
      setVal(eased * to);
      if (t < 1) requestAnimationFrame(raf);
      else setVal(to);
    };
    requestAnimationFrame(raf);
  }, [inView, to, duration]);

  return <span ref={ref}>{format ? format(val) : Math.round(val).toString()}</span>;
}
