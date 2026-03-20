"use client";

import React, { useEffect, useState } from "react";

export default function BackgroundEffects() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
      {/* Static ambient blobs — animated with pure CSS (GPU-composited, zero JS) */}
      <div className="bg-blob bg-blob-blue" />
      <div className="bg-blob bg-blob-purple" />
      <div className="bg-blob bg-blob-center" />
    </div>
  );
}
