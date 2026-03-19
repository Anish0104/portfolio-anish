'use client'

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Standard fix for Spline runtime errors in Next.js (SSR conflict cleanup)
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[var(--accent-blue)]/20 border-t-[var(--accent-blue)] animate-spin"></div>
    </div>
  )
});

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <div className={className}>
      <Spline scene={scene} />
    </div>
  )
}
