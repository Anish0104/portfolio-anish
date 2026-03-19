"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Trophy, Brain, Cpu, Zap, Info } from "lucide-react";

// --- Constants & Config ---
const ARENA_WIDTH = 800;
const ARENA_HEIGHT = 500;
const PLAYER_SIZE = 12;
const AGENT_SIZE = 14;
const HAZARD_SIZE = 10;
const FRICTION = 0.96;
const PLAYER_ACCEL = 0.6;
const INITIAL_AGENT_SPEED = 4.5;          // was 3.2
const DIFFICULTY_RAMP = 0.0025;           // was 0.0012
const ARENA_SHRINK_RATE = 0.20;           // was 0.14
const MIN_ARENA_SIZE = 300;
const HAZARD_SPAWN_INTERVAL = 120;        // was 200 (mine every 2s)

type GameState = "START" | "PLAYING" | "GAMEOVER";

interface Entity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

interface Hazard extends Entity {
  id: number;
}

export default function AgentGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>("START");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [threatLevel, setThreatLevel] = useState("Low");
  
  // Game Refs
  const playerRef = useRef<Entity>({ x: ARENA_WIDTH / 4, y: ARENA_HEIGHT / 2, vx: 0, vy: 0, color: "#22d3ee" });
  const agentRef = useRef<Entity>({ x: (3 * ARENA_WIDTH) / 4, y: ARENA_HEIGHT / 2, vx: 0, vy: 0, color: "#a855f7" });
  const hazardsRef = useRef<Hazard[]>([]);
  const arenaShrinkRef = useRef(0);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const requestRef = useRef<number | undefined>(undefined);
  const agentSpeedRef = useRef(INITIAL_AGENT_SPEED);
  const playerPathRef = useRef<{ x: number, y: number }[]>([]);

  // Load High Score
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("agent_game_highscore");
      if (saved) setHighScore(parseInt(saved, 10));
    }
  }, []);

  // Handle Input
  useEffect(() => {
    const down = (e: KeyboardEvent) => (keysRef.current[e.code] = true);
    const up = (e: KeyboardEvent) => (keysRef.current[e.code] = false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const resetGame = useCallback(() => {
    playerRef.current = { x: ARENA_WIDTH / 4, y: ARENA_HEIGHT / 2, vx: 0, vy: 0, color: "#22d3ee" };
    agentRef.current = { x: (3 * ARENA_WIDTH) / 4, y: ARENA_HEIGHT / 2, vx: 0, vy: 0, color: "#a855f7" };
    hazardsRef.current = [];
    arenaShrinkRef.current = 0;
    agentSpeedRef.current = INITIAL_AGENT_SPEED;
    playerPathRef.current = [];
    setScore(0);
    setThreatLevel("Low");
    setGameState("PLAYING");
  }, []);

  const update = () => {
    if (gameState !== "PLAYING") return;

    const player = playerRef.current;
    const agent = agentRef.current;
    const scoreVal = score;

    // 0. Update Metrics
    setScore(prev => prev + 1);
    const elapsedSeconds = scoreVal / 60;

    // 1. Shrinking Arena
    if (elapsedSeconds > 2) {             // shrinking starts at 2s
      if (ARENA_WIDTH - arenaShrinkRef.current * 2 > MIN_ARENA_SIZE) {
        arenaShrinkRef.current += ARENA_SHRINK_RATE;
      }
      if (elapsedSeconds > 7 && threatLevel === "Low") setThreatLevel("Medium");
      if (elapsedSeconds > 14 && threatLevel === "Medium") setThreatLevel("High");
    }

    const currentArena = {
      minX: arenaShrinkRef.current,
      maxX: ARENA_WIDTH - arenaShrinkRef.current,
      minY: (arenaShrinkRef.current * ARENA_HEIGHT) / ARENA_WIDTH,
      maxY: ARENA_HEIGHT - (arenaShrinkRef.current * ARENA_HEIGHT) / ARENA_WIDTH,
    };

    // 2. Player Physics
    if (keysRef.current["KeyW"] || keysRef.current["ArrowUp"]) player.vy -= PLAYER_ACCEL;
    if (keysRef.current["KeyS"] || keysRef.current["ArrowDown"]) player.vy += PLAYER_ACCEL;
    if (keysRef.current["KeyA"] || keysRef.current["ArrowLeft"]) player.vx -= PLAYER_ACCEL;
    if (keysRef.current["KeyD"] || keysRef.current["ArrowRight"]) player.vx += PLAYER_ACCEL;

    player.vx *= FRICTION;
    player.vy *= FRICTION;
    player.x += player.vx;
    player.y += player.vy;

    // Boundary check with shrinking bounds
    if (player.x < currentArena.minX + PLAYER_SIZE) { player.x = currentArena.minX + PLAYER_SIZE; player.vx *= -0.5; }
    if (player.x > currentArena.maxX - PLAYER_SIZE) { player.x = currentArena.maxX - PLAYER_SIZE; player.vx *= -0.5; }
    if (player.y < currentArena.minY + PLAYER_SIZE) { player.y = currentArena.minY + PLAYER_SIZE; player.vy *= -0.5; }
    if (player.y > currentArena.maxY - PLAYER_SIZE) { player.y = currentArena.maxY - PLAYER_SIZE; player.vy *= -0.5; }

    // 3. AI Agent - Lead Pursuit V2
    // Track history for pattern detection
    playerPathRef.current.push({ x: player.x, y: player.y });
    if (playerPathRef.current.length > 60) playerPathRef.current.shift();

    // Check if player is looping (displacement vs path length)
    let isLooping = false;
    if (playerPathRef.current.length === 60) {
      const p1 = playerPathRef.current[0];
      const p2 = playerPathRef.current[59];
      const disp = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
      if (disp < 40) isLooping = true; // was 60
    }

    // Dynamic prediction depth
    const currentPrediction = isLooping ? 0 : 25 + (elapsedSeconds * 1.5);
    const targetX = player.x + player.vx * currentPrediction;
    const targetY = player.y + player.vy * currentPrediction;

    const dx = targetX - agent.x;
    const dy = targetY - agent.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 1) {
      const adaptiveSpeed = agentSpeedRef.current * (isLooping ? 1.5 : 1);
      agent.vx = (dx / dist) * adaptiveSpeed;
      agent.vy = (dy / dist) * adaptiveSpeed;
    }

    agent.x += agent.vx;
    agent.y += agent.vy;

    // 4. Hazards (Mines)
    if (elapsedSeconds > 5 && scoreVal % HAZARD_SPAWN_INTERVAL === 0) {   // mines start at 5s
      const side = Math.floor(Math.random() * 4);
      let hx = 0, hy = 0, hvx = 0, hvy = 0;
      if (side === 0) { hx = currentArena.minX; hy = Math.random() * ARENA_HEIGHT; hvx = 2; }
      else if (side === 1) { hx = currentArena.maxX; hy = Math.random() * ARENA_HEIGHT; hvx = -2; }
      else if (side === 2) { hx = Math.random() * ARENA_WIDTH; hy = currentArena.minY; hvy = 2; }
      else { hx = Math.random() * ARENA_WIDTH; hy = currentArena.maxY; hvy = -2; }
      
      hazardsRef.current.push({ id: Date.now(), x: hx, y: hy, vx: hvx, vy: hvy, color: "#f43f5e" });
    }

    hazardsRef.current.forEach(h => {
      h.x += h.vx;
      h.y += h.vy;
    });

    // Clean up out-of-bounds hazards
    hazardsRef.current = hazardsRef.current.filter(h => 
      h.x > -50 && h.x < ARENA_WIDTH + 50 && h.y > -50 && h.y < ARENA_HEIGHT + 50
    );

    // 5. Collision & Scoring
    const agentCol = Math.sqrt(Math.pow(player.x - agent.x, 2) + Math.pow(player.y - agent.y, 2));
    const hazardCol = hazardsRef.current.some(h => 
      Math.sqrt(Math.pow(player.x - h.x, 2) + Math.pow(player.y - h.y, 2)) < PLAYER_SIZE + HAZARD_SIZE
    );

    if (agentCol < PLAYER_SIZE + AGENT_SIZE || hazardCol) {
      setGameState("GAMEOVER");
      if (score > highScore) {
        setHighScore(score);
        if (typeof window !== "undefined") {
          localStorage.setItem("agent_game_highscore", score.toString());
        }
      }
    }

    agentSpeedRef.current += DIFFICULTY_RAMP;

    draw(currentArena);
    requestRef.current = requestAnimationFrame(update);
  };

  const draw = (arena: { minX: number, maxX: number, minY: number, maxY: number }) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

    // Draw Background Grid (Fixed)
    const gridColor = getComputedStyle(canvas).getPropertyValue("--card-border") || "rgba(255,255,255,0.02)";
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let x = 0; x < ARENA_WIDTH; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ARENA_HEIGHT); ctx.stroke(); }
    for (let y = 0; y < ARENA_HEIGHT; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(ARENA_WIDTH, y); ctx.stroke(); }

    // Draw Shrunk Arena Border
    const borderColor = score / 60 > 30 ? "rgba(244, 63, 94, 0.4)" : gridColor;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(arena.minX, arena.minY, arena.maxX - arena.minX, arena.maxY - arena.minY);
    ctx.setLineDash([]);

    // Draw Player
    ctx.shadowBlur = 15;
    ctx.shadowColor = playerRef.current.color;
    ctx.fillStyle = playerRef.current.color;
    ctx.beginPath(); ctx.arc(playerRef.current.x, playerRef.current.y, PLAYER_SIZE, 0, Math.PI * 2); ctx.fill();

    // Draw Agent
    ctx.shadowColor = agentRef.current.color;
    ctx.fillStyle = agentRef.current.color;
    ctx.beginPath(); ctx.arc(agentRef.current.x, agentRef.current.y, AGENT_SIZE, 0, Math.PI * 2); ctx.fill();

    // Draw Hazards
    hazardsRef.current.forEach(h => {
      ctx.shadowColor = h.color;
      ctx.fillStyle = h.color;
      ctx.beginPath();
      ctx.arc(h.x, h.y, HAZARD_SIZE, 0, Math.PI * 2);
      ctx.fill();
      // Pulsing effect
      ctx.strokeStyle = h.color;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(h.x, h.y, HAZARD_SIZE + Math.sin(Date.now() / 100) * 4, 0, Math.PI * 2); ctx.stroke();
    });

    ctx.shadowBlur = 0;
  };

  useEffect(() => {
    if (gameState === "PLAYING") {
      requestRef.current = requestAnimationFrame(update);
    } else {
      draw({ minX: 0, maxX: ARENA_WIDTH, minY: 0, maxY: ARENA_HEIGHT });
    }
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [gameState]);

  const pressKey = useCallback((key: string) => {
    keysRef.current[key] = true;
  }, []);

  const releaseKey = useCallback((key: string) => {
    keysRef.current[key] = false;
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12">
      <div 
        className="relative bg-[var(--background)] rounded-[40px] border border-[var(--card-border)] overflow-hidden shadow-2xl group touch-none transition-colors duration-500"
      >
        {/* Game Canvas */}
        <canvas ref={canvasRef} width={ARENA_WIDTH} height={ARENA_HEIGHT} className="w-full h-auto block" />

        {/* HUD Overlay */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-start pointer-events-none">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-[var(--muted)] uppercase tracking-[0.3em]">Simulation Time</p>
              <p className="text-2xl font-black text-[var(--foreground)] tabular-nums">{(score / 60).toFixed(2)}s</p>
            </div>
            {gameState === "PLAYING" && score / 60 > 8 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Arena Contraction Active</span>
              </motion.div>
            )}
          </div>
          
          <div className="text-right space-y-4">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-[var(--muted)] uppercase tracking-[0.3em] flex items-center justify-end gap-2 text-right">
                <Trophy size={10} /> Sector Record
              </p>
              <p className="text-lg font-bold text-[var(--muted)] tabular-nums">{(highScore / 60).toFixed(2)}s</p>
            </div>
            <div className="space-y-1">
               <p className="text-[9px] font-black text-[var(--muted)] uppercase tracking-[0.3em]">Threat Level</p>
               <p className={cn(
                 "text-xs font-black uppercase tracking-widest transition-colors duration-500",
                 threatLevel === "Low" ? "text-emerald-500" : threatLevel === "Medium" ? "text-amber-500" : "text-red-500 animate-pulse"
               )}>{threatLevel}</p>
            </div>
          </div>
        </div>

        {/* Start / Game Over Overlays */}
        <AnimatePresence>
          {gameState !== "PLAYING" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-2xl">
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="text-center p-12 max-w-md w-full">
                {gameState === "START" ? (
                  <>
                    <div className="w-16 h-16 bg-[var(--accent-blue)]/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-[var(--accent-blue)] border border-[var(--accent-blue)]/20">
                      <Brain size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-[var(--foreground)] mb-4 tracking-tighter uppercase italic">Can You Beat My Agent?</h2>
                    <p className="text-[var(--muted)] text-sm mb-12 font-medium leading-relaxed">
                      Testing predictive pursuit algorithms in a contracting spatial arena. 
                      Agent difficulty escalates exponentially after 10s.
                    </p>
                    <button onClick={resetGame} className="group relative flex items-center justify-center gap-3 w-full py-6 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.3em] hover:bg-white/90 transition-all active:scale-95 shadow-2xl shadow-blue-500/20">
                      Initiate Test Sequence
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-red-500 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                      <Zap size={36} fill="currentColor" />
                    </div>
                    <h2 className="text-3xl font-black text-[var(--foreground)] mb-2 tracking-tighter uppercase italic">Neutralized</h2>
                    <p className="text-[var(--muted)] text-[10px] font-black uppercase tracking-[0.3em] mb-12">The agent successfully intercepted the target pattern.</p>
                    <div className="mb-12">
                      <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest mb-2">Final Duration</p>
                      <p className="text-5xl font-black text-[var(--foreground)] tabular-nums tracking-tighter">{(score / 60).toFixed(2)}s</p>
                    </div>
                    <button onClick={resetGame} className="flex items-center justify-center gap-3 w-full py-6 rounded-2xl bg-white/5 text-white font-black text-xs uppercase tracking-[0.3em] hover:bg-white/10 border border-white/5 transition-all active:scale-95 mb-6">
                      <RotateCcw size={18} /> Re-Initialize
                    </button>
                    {score >= highScore && score > 0 && <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] animate-pulse">New Tactical Achievement Unlocked</p>}
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Adaptive Helper */}
        {gameState === "PLAYING" && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-8 right-8 px-5 py-2.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-3xl hidden md:flex items-center gap-4">
             <div className="relative">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute inset-0" />
                <div className="w-2 h-2 rounded-full bg-red-500 relative" />
             </div>
             <span className="text-[10px] font-black italic text-white/60 uppercase tracking-[0.2em] font-mono">Status: Adversarial Adaptation Active</span>
           </motion.div>
        )}

        {/* Mobile D-Pad Controls */}
        {gameState === "PLAYING" && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:hidden z-50 select-none">
            <div className="relative w-36 h-36">
              {/* Up */}
              <button
                className="absolute top-0 left-1/2 -translate-x-1/2 w-11 h-11 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white/70 active:bg-white/25 active:scale-95 transition-all"
                onPointerDown={() => pressKey("KeyW")} onPointerUp={() => releaseKey("KeyW")} onPointerLeave={() => releaseKey("KeyW")}
              >▲</button>
              {/* Down */}
              <button
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-11 h-11 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white/70 active:bg-white/25 active:scale-95 transition-all"
                onPointerDown={() => pressKey("KeyS")} onPointerUp={() => releaseKey("KeyS")} onPointerLeave={() => releaseKey("KeyS")}
              >▼</button>
              {/* Left */}
              <button
                className="absolute left-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white/70 active:bg-white/25 active:scale-95 transition-all"
                onPointerDown={() => pressKey("KeyA")} onPointerUp={() => releaseKey("KeyA")} onPointerLeave={() => releaseKey("KeyA")}
              >◀</button>
              {/* Right */}
              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white/70 active:bg-white/25 active:scale-95 transition-all"
                onPointerDown={() => pressKey("KeyD")} onPointerUp={() => releaseKey("KeyD")} onPointerLeave={() => releaseKey("KeyD")}
              >▶</button>
              {/* Center dot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/5 border border-white/10" />
            </div>
          </div>
        )}
      </div>

      {/* How it works panel */}
      <div className="max-w-4xl mx-auto px-4">
        <button onClick={() => setShowHowItWorks(!showHowItWorks)} className="flex items-center gap-4 px-8 py-5 rounded-[24px] bg-white/[0.03] border border-white/5 text-white/30 hover:text-white hover:border-white/10 transition-all w-full group">
          <Info size={18} className="group-hover:rotate-12 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] flex-1 text-left">How It Works: The RL Architecture V2</span>
          <div className={`w-2 h-2 rounded-full transition-colors ${showHowItWorks ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white/10'}`} />
        </button>

        <AnimatePresence>
          {showHowItWorks && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="mt-4 pt-10 pb-12 grid md:grid-cols-2 gap-12 border border-white/5 px-10 rounded-[32px] bg-white/[0.02] backdrop-blur-xl shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-blue-400">
                    <Cpu size={24} />
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em]">Adaptive Intercept (V2)</h4>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed font-medium">
                    The V2 agent uses <span className="text-white font-black">Dynamic Prediction Scaling</span>. It doesn't just predict where you'll be - it analyzes your trajectory over 60 frames to detect repetitive patterns. If you move predictably, it shortcuts your path and increases its intercept velocity by 50%.
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-purple-400">
                    <Brain size={24} />
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em]">Spatial Constraint RL</h4>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed font-medium">
                    The environment features a <span className="text-white font-black">Shrinking Reward Arena</span>. Every frame you survive increases the agent's reward, but spatial constraints tighten at a rate of 0.14px/frame. Drifting mines introduce random state-space noise, forcing constant re-planning.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Utility
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
