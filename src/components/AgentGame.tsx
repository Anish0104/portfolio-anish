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
  const lastTimeRef = useRef<number>(0);
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
    lastTimeRef.current = performance.now();
    setGameState("PLAYING");
  }, []);

  const update = (time: number) => {
    if (gameState !== "PLAYING") return;

    // Delta time calculation for frame-rate independence (base 60fps)
    const dt = Math.min((time - lastTimeRef.current) / 16.67, 2.0); 
    lastTimeRef.current = time;

    const player = playerRef.current;
    const agent = agentRef.current;

    // 0. Update Metrics
    setScore(prev => prev + dt);
    const scoreVal = Math.floor(score);
    const elapsedSeconds = score / 60;

    // 1. Shrinking Arena
    if (elapsedSeconds > 2) {             
      if (ARENA_WIDTH - arenaShrinkRef.current * 2 > MIN_ARENA_SIZE) {
        arenaShrinkRef.current += ARENA_SHRINK_RATE * dt;
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
    if (keysRef.current["KeyW"] || keysRef.current["ArrowUp"]) player.vy -= PLAYER_ACCEL * dt;
    if (keysRef.current["KeyS"] || keysRef.current["ArrowDown"]) player.vy += PLAYER_ACCEL * dt;
    if (keysRef.current["KeyA"] || keysRef.current["ArrowLeft"]) player.vx -= PLAYER_ACCEL * dt;
    if (keysRef.current["KeyD"] || keysRef.current["ArrowRight"]) player.vx += PLAYER_ACCEL * dt;

    player.vx *= Math.pow(FRICTION, dt);
    player.vy *= Math.pow(FRICTION, dt);
    player.x += player.vx * dt;
    player.y += player.vy * dt;

    // Boundary check
    if (player.x < currentArena.minX + PLAYER_SIZE) { player.x = currentArena.minX + PLAYER_SIZE; player.vx *= -0.5; }
    if (player.x > currentArena.maxX - PLAYER_SIZE) { player.x = currentArena.maxX - PLAYER_SIZE; player.vx *= -0.5; }
    if (player.y < currentArena.minY + PLAYER_SIZE) { player.y = currentArena.minY + PLAYER_SIZE; player.vy *= -0.5; }
    if (player.y > currentArena.maxY - PLAYER_SIZE) { player.y = currentArena.maxY - PLAYER_SIZE; player.vy *= -0.5; }

    // 3. AI Agent
    playerPathRef.current.push({ x: player.x, y: player.y });
    if (playerPathRef.current.length > 60) playerPathRef.current.shift();

    let isLooping = false;
    if (playerPathRef.current.length === 60) {
      const p1 = playerPathRef.current[0];
      const p2 = playerPathRef.current[59];
      const disp = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
      if (disp < 40) isLooping = true;
    }

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

    agent.x += agent.vx * dt;
    agent.y += agent.vy * dt;

    // 4. Hazards
    if (elapsedSeconds > 5 && Math.random() < (1 / HAZARD_SPAWN_INTERVAL) * dt) {   
      const side = Math.floor(Math.random() * 4);
      let hx = 0, hy = 0, hvx = 0, hvy = 0;
      if (side === 0) { hx = currentArena.minX; hy = Math.random() * ARENA_HEIGHT; hvx = 2; }
      else if (side === 1) { hx = currentArena.maxX; hy = Math.random() * ARENA_HEIGHT; hvx = -2; }
      else if (side === 2) { hx = Math.random() * ARENA_WIDTH; hy = currentArena.minY; hvy = 2; }
      else { hx = Math.random() * ARENA_WIDTH; hy = currentArena.maxY; hvy = -2; }
      
      hazardsRef.current.push({ id: Date.now(), x: hx, y: hy, vx: hvx, vy: hvy, color: "#f43f5e" });
    }

    hazardsRef.current.forEach(h => {
      h.x += h.vx * dt;
      h.y += h.vy * dt;
    });

    hazardsRef.current = hazardsRef.current.filter(h => 
      h.x > -50 && h.x < ARENA_WIDTH + 50 && h.y > -50 && h.y < ARENA_HEIGHT + 50
    );

    // 5. Collision
    const agentCol = Math.sqrt(Math.pow(player.x - agent.x, 2) + Math.pow(player.y - agent.y, 2));
    const hazardCol = hazardsRef.current.some(h => 
      Math.sqrt(Math.pow(player.x - h.x, 2) + Math.pow(player.y - h.y, 2)) < PLAYER_SIZE + HAZARD_SIZE
    );

    if (agentCol < PLAYER_SIZE + AGENT_SIZE || hazardCol) {
      setGameState("GAMEOVER");
      if (score > highScore) {
        setHighScore(Math.floor(score));
        if (typeof window !== "undefined") {
          localStorage.setItem("agent_game_highscore", Math.floor(score).toString());
        }
      }
    }

    agentSpeedRef.current += DIFFICULTY_RAMP * dt;

    draw(currentArena);
    requestRef.current = requestAnimationFrame(update);
  };

  const draw = (arena: { minX: number, maxX: number, minY: number, maxY: number }) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

    // Draw Background Grid
    const gridColor = "rgba(255,255,255,0.02)";
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let x = 0; x < ARENA_WIDTH; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ARENA_HEIGHT); ctx.stroke(); }
    for (let y = 0; y < ARENA_HEIGHT; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(ARENA_WIDTH, y); ctx.stroke(); }

    // Draw Shrunk Arena Border
    const borderColor = score / 60 > 30 ? "rgba(244, 63, 94, 0.4)" : "rgba(255,255,255,0.1)";
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
      ctx.strokeStyle = h.color;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(h.x, h.y, HAZARD_SIZE + Math.sin(timeRef.current / 100) * 4, 0, Math.PI * 2); ctx.stroke();
    });

    ctx.shadowBlur = 0;
  };

  const timeRef = useRef(0);
  useEffect(() => {
    if (gameState === "PLAYING") {
      requestRef.current = requestAnimationFrame(update);
    } else {
      draw({ minX: 0, maxX: ARENA_WIDTH, minY: 0, maxY: ARENA_HEIGHT });
    }
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [gameState]);

  const pressKey = useCallback((key: string, e?: React.PointerEvent) => {
    if (e) e.preventDefault();
    keysRef.current[key] = true;
  }, []);

  const releaseKey = useCallback((key: string, e?: React.PointerEvent) => {
    if (e) e.preventDefault();
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
                    <button 
                       onClick={resetGame} 
                       className="group relative flex items-center justify-center gap-3 w-full py-6 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.3em] hover:bg-white/90 transition-all active:scale-95 shadow-2xl shadow-blue-500/20"
                    >
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
                    {Math.floor(score) >= highScore && score > 0 && <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] animate-pulse">New Tactical Achievement Unlocked</p>}
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Adaptive Helper */}
        {gameState === "PLAYING" && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-10 right-10 px-5 py-2.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-3xl hidden md:flex items-center gap-4">
             <div className="relative">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute inset-0" />
                <div className="w-2 h-2 rounded-full bg-red-500 relative" />
             </div>
             <span className="text-[10px] font-black italic text-white/60 uppercase tracking-[0.2em] font-mono">Status: Adversarial Adaptation Active</span>
           </motion.div>
        )}

        {/* Mobile Controls Overlay */}
        {gameState === "PLAYING" && (
          <div className="absolute inset-0 md:hidden z-50 pointer-events-none select-none">
            {/* D-Pad - Bottom Center, larger and more hit area */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
              <div className="relative w-48 h-48">
                {/* UP */}
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl active:bg-white/20 transition-colors"
                  onPointerDown={(e) => pressKey("KeyW", e)} onPointerUp={(e) => releaseKey("KeyW", e)}
                ><span className="text-white/40">▲</span></div>
                {/* DOWN */}
                <div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl active:bg-white/20 transition-colors"
                  onPointerDown={(e) => pressKey("KeyS", e)} onPointerUp={(e) => releaseKey("KeyS", e)}
                ><span className="text-white/40">▼</span></div>
                {/* LEFT */}
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl active:bg-white/20 transition-colors"
                  onPointerDown={(e) => pressKey("KeyA", e)} onPointerUp={(e) => releaseKey("KeyA", e)}
                ><span className="text-white/40">◀</span></div>
                {/* RIGHT */}
                <div 
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl active:bg-white/20 transition-colors"
                  onPointerDown={(e) => pressKey("KeyD", e)} onPointerUp={(e) => releaseKey("KeyD", e)}
                ><span className="text-white/40">▶</span></div>
                
                {/* Center visual only */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 border border-white/5" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* How it works panel */}
      <div className="max-w-4xl mx-auto px-4">
        <button onClick={() => setShowHowItWorks(!showHowItWorks)} className="flex items-center gap-4 px-8 py-5 rounded-[24px] bg-white/[0.03] border border-white/5 text-white/30 hover:text-white hover:border-white/10 transition-all w-full group">
          <Info size={18} className="group-hover:rotate-12 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] flex-1 text-left">How It Works: The RL Architecture V3</span>
          <div className={`w-2 h-2 rounded-full transition-colors ${showHowItWorks ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white/10'}`} />
        </button>

        <AnimatePresence>
          {showHowItWorks && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="mt-4 pt-10 pb-12 grid md:grid-cols-2 gap-12 border border-white/5 px-10 rounded-[32px] bg-white/[0.02] backdrop-blur-xl shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-blue-400">
                    <Cpu size={24} />
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em]">Adaptive Intercept (V3)</h4>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed font-medium">
                    The V3 agent features <span className="text-white font-black">Refresh-Synced Physics</span>. It ensures the simulation remains consistent whether running on a 60Hz laptop or 120Hz mobile display. The D-Pad interface has been re-engineered for capacitive touch precision.
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-purple-400">
                    <Brain size={24} />
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em]">Spatial Constraint RL</h4>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed font-medium">
                    The environment features a <span className="text-white font-black">Shrinking Reward Arena</span>. Every frame you survive increases the agent's reward, but spatial constraints tighten at a rate of 0.20px/frame. Drifting mines introduce random state-space noise, forcing constant re-planning.
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
