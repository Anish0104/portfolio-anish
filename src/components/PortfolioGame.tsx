"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Github, ExternalLink, X, Maximize2, Minimize2 } from "lucide-react";

// ─── Project Data ────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: "vtrack",
    title: "VTrack",
    description:
      "Real-time traffic analysis system using YOLOv8 for vehicle detection and ByteTrack for robust multi-object tracking. Features a FastAPI backend and React dashboard.",
    tech: ["YOLOv8", "ByteTrack", "FastAPI", "React", "Supabase"],
    github: "https://github.com/Anish0104/VTrack",
    demo: "https://vtrack.demo.com",
    color: "#00e5ff",
  },
  {
    id: "skillgap",
    title: "SkillGap",
    description:
      "AI career assistant performing resume parsing, skill gap analysis, and interview simulation using Gemini for intelligent, context-aware feedback.",
    tech: ["Next.js", "Supabase", "Gemini API", "Tailwind"],
    github: "https://github.com/Anish0104/SkillGap",
    demo: "https://skillgap.demo.com",
    color: "#b388ff",
  },
  {
    id: "docpilot",
    title: "DocPilot",
    description:
      "RAG-based documentation assistant using ChromaDB for vector storage and LLaMA for generating context-aware, grounded responses from any codebase.",
    tech: ["ChromaDB", "LLaMA", "HuggingFace", "Streamlit"],
    github: "https://github.com/Anish0104/DocPilot",
    color: "#69ff47",
  },
  {
    id: "weather",
    title: "Weather Forecast",
    description:
      "Attention-LSTM weather prediction system integrated with IoT sensors, deployed on cloud infrastructure for real-time monitoring and anomaly detection.",
    tech: ["Python", "TensorFlow", "IoT", "AWS", "W&B"],
    github: "https://github.com/Anish0104/WeatherForecast",
    color: "#ffab40",
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────
const W = 900;
const H = 480;
const GRAVITY = 0.38;
const JUMP_FORCE = -8.5;
const PIPE_GAP = 165;
const PIPE_WIDTH = 32;
const PLAYER_X = 140;
const PLAYER_SIZE = 18;
const LIVES_MAX = 3;
const NN_NODES = 30;
const NN_SPEED = 0.6;

interface NNNode {
  x: number;
  y: number;
  vx: number;
  r: number;
  pulse: number;
  pulseSpeed: number;
}

interface NNEdge {
  a: number;
  b: number;
}

interface Pipe {
  x: number;
  topH: number;
  collectible: (typeof PROJECTS)[number] | null;
  collected: boolean;
  scored: boolean;
}

type GameState = "start" | "playing" | "paused" | "over";

// ─── Neural Net Background ────────────────────────────────────────────────────
function initNN(): { nodes: NNNode[]; edges: NNEdge[] } {
  const nodes: NNNode[] = Array.from({ length: NN_NODES }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: -NN_SPEED * (0.5 + Math.random() * 0.8),
    r: 2 + Math.random() * 3,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03,
  }));
  const edges: NNEdge[] = [];
  for (let i = 0; i < NN_NODES; i++) {
    for (let j = i + 1; j < NN_NODES; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      if (Math.sqrt(dx * dx + dy * dy) < 180) edges.push({ a: i, b: j });
    }
  }
  return { nodes, edges };
}

function tickNN(nodes: NNNode[]) {
  nodes.forEach((n) => {
    n.x += n.vx;
    n.pulse += n.pulseSpeed;
    if (n.x < -20) n.x = W + 20;
  });
}

function drawNN(
  ctx: CanvasRenderingContext2D,
  nodes: NNNode[],
  edges: NNEdge[]
) {
  // Edges
  edges.forEach(({ a, b }) => {
    const na = nodes[a];
    const nb = nodes[b];
    const dx = na.x - nb.x;
    const dy = na.y - nb.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 200) return;
    const alpha = ((200 - dist) / 200) * 0.12;
    ctx.beginPath();
    ctx.moveTo(na.x, na.y);
    ctx.lineTo(nb.x, nb.y);
    ctx.strokeStyle = `rgba(100,150,255,${alpha})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  });

  // Nodes
  nodes.forEach((n) => {
    const glow = 0.5 + 0.5 * Math.sin(n.pulse);
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r + glow * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(120,180,255,${0.3 + glow * 0.35})`;
    ctx.fill();
  });
}

// ─── Draw Player (diamond shape) ─────────────────────────────────────────────
function drawPlayer(
  ctx: CanvasRenderingContext2D,
  y: number,
  alive: boolean,
  flash: boolean
) {
  const s = PLAYER_SIZE;
  const x = PLAYER_X;
  if (flash) return; // blink on hit

  ctx.save();
  // Glow
  ctx.shadowColor = alive ? "#00e5ff" : "#ff1744";
  ctx.shadowBlur = 18;

  // Diamond body
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.lineTo(x + s * 0.65, y);
  ctx.lineTo(x, y + s);
  ctx.lineTo(x - s * 0.65, y);
  ctx.closePath();

  const grad = ctx.createLinearGradient(x - s, y - s, x + s, y + s);
  grad.addColorStop(0, alive ? "#b3e5fc" : "#ff8a80");
  grad.addColorStop(1, alive ? "#00acc1" : "#d50000");
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = alive ? "#e0f7fa" : "#ff5252";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.restore();
}

// ─── Draw Pipe / Spike ───────────────────────────────────────────────────────
function drawPipe(ctx: CanvasRenderingContext2D, pipe: Pipe) {
  const x = pipe.x;
  const topH = pipe.topH;
  const botY = topH + PIPE_GAP;

  ctx.save();
  ctx.shadowColor = "#ff1744";
  ctx.shadowBlur = 10;

  // Top spike block
  const g1 = ctx.createLinearGradient(x, 0, x + PIPE_WIDTH, 0);
  g1.addColorStop(0, "#b71c1c");
  g1.addColorStop(1, "#f44336");
  ctx.fillStyle = g1;
  ctx.fillRect(x, 0, PIPE_WIDTH, topH - 10);

  // Top spike tip (triangle pointing down)
  ctx.beginPath();
  ctx.moveTo(x, topH - 10);
  ctx.lineTo(x + PIPE_WIDTH / 2, topH + 8);
  ctx.lineTo(x + PIPE_WIDTH, topH - 10);
  ctx.closePath();
  ctx.fill();

  // Bottom spike block
  const g2 = ctx.createLinearGradient(x, 0, x + PIPE_WIDTH, 0);
  g2.addColorStop(0, "#b71c1c");
  g2.addColorStop(1, "#f44336");
  ctx.fillStyle = g2;
  ctx.fillRect(x, botY + 10, PIPE_WIDTH, H - botY - 10);

  // Bottom spike tip (triangle pointing up)
  ctx.beginPath();
  ctx.moveTo(x, botY + 10);
  ctx.lineTo(x + PIPE_WIDTH / 2, botY - 8);
  ctx.lineTo(x + PIPE_WIDTH, botY + 10);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

// ─── Draw Collectible ─────────────────────────────────────────────────────────
function drawCollectible(
  ctx: CanvasRenderingContext2D,
  pipe: Pipe,
  tick: number
) {
  if (!pipe.collectible || pipe.collected) return;
  const cx = pipe.x + PIPE_WIDTH / 2;
  const cy = pipe.topH + PIPE_GAP / 2 + Math.sin(tick * 0.05) * 8;
  const color = pipe.collectible.color;
  const r = 14;

  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = 22;

  // Hexagon
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const ang = (Math.PI / 3) * i - Math.PI / 6;
    const px = cx + r * Math.cos(ang);
    const py = cy + r * Math.sin(ang);
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  g.addColorStop(0, color + "ff");
  g.addColorStop(1, color + "44");
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Inner ">" arrow
  ctx.fillStyle = "#fff";
  ctx.font = `bold 10px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("▶", cx, cy);

  ctx.restore();
}

// ─── HUD ──────────────────────────────────────────────────────────────────────
function drawHUD(
  ctx: CanvasRenderingContext2D,
  score: number,
  hi: number,
  lives: number
) {
  ctx.save();
  ctx.font = `bold 14px 'Courier New', monospace`;
  ctx.fillStyle = "rgba(0,229,255,0.9)";
  ctx.textAlign = "left";
  ctx.fillText(`SCORE  ${String(score).padStart(5, "0")}`, 16, 28);
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillText(`HI     ${String(hi).padStart(5, "0")}`, 16, 48);

  // lives
  for (let i = 0; i < LIVES_MAX; i++) {
    ctx.beginPath();
    ctx.arc(W - 26 - i * 22, 24, 7, 0, Math.PI * 2);
    ctx.fillStyle = i < lives ? "#00e5ff" : "rgba(255,255,255,0.15)";
    ctx.fill();
    if (i < lives) {
      ctx.shadowColor = "#00e5ff";
      ctx.shadowBlur = 10;
      ctx.fill();
    }
    ctx.restore();
    ctx.save();
  }
  ctx.restore();
}

// ─── Start Screen ─────────────────────────────────────────────────────────────
function drawStartScreen(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.fillStyle = "rgba(5,10,30,0.82)";
  ctx.fillRect(0, 0, W, H);

  ctx.textAlign = "center";
  ctx.shadowColor = "#00e5ff";
  ctx.shadowBlur = 25;
  ctx.fillStyle = "#00e5ff";
  ctx.font = `bold 42px 'Courier New', monospace`;
  ctx.fillText("NEURAL DRIFT", W / 2, H / 2 - 60);

  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.font = `14px 'Courier New', monospace`;
  ctx.fillText("Navigate the neural network · collect project nodes", W / 2, H / 2 - 20);
  ctx.fillText("CLICK  ·  TAP  ·  SPACE  to pulse upward", W / 2, H / 2 + 4);

  // Pulsing button
  ctx.save();
  ctx.shadowColor = "#00e5ff";
  ctx.shadowBlur = 20;
  ctx.strokeStyle = "#00e5ff";
  ctx.lineWidth = 2;
  ctx.strokeRect(W / 2 - 90, H / 2 + 34, 180, 44);
  ctx.fillStyle = "rgba(0,229,255,0.08)";
  ctx.fillRect(W / 2 - 90, H / 2 + 34, 180, 44);
  ctx.fillStyle = "#00e5ff";
  ctx.font = `bold 16px 'Courier New', monospace`;
  ctx.fillText("▶  LAUNCH", W / 2, H / 2 + 62);
  ctx.restore();

  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ctx.font = `11px 'Courier New', monospace`;
  ctx.fillText("Collect ⬡ project nodes to discover my work", W / 2, H / 2 + 110);
  ctx.restore();
}

// ─── Game Over Screen ─────────────────────────────────────────────────────────
function drawGameOver(
  ctx: CanvasRenderingContext2D,
  score: number,
  hi: number
) {
  ctx.save();
  ctx.fillStyle = "rgba(5,10,30,0.88)";
  ctx.fillRect(0, 0, W, H);

  ctx.textAlign = "center";
  ctx.shadowColor = "#ff1744";
  ctx.shadowBlur = 20;
  ctx.fillStyle = "#ff5252";
  ctx.font = `bold 38px 'Courier New', monospace`;
  ctx.fillText("SIGNAL LOST", W / 2, H / 2 - 60);

  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = `16px 'Courier New', monospace`;
  ctx.fillText(`SCORE: ${score}   HI: ${hi}`, W / 2, H / 2 - 16);

  ctx.save();
  ctx.shadowColor = "#00e5ff";
  ctx.shadowBlur = 16;
  ctx.strokeStyle = "#00e5ff";
  ctx.lineWidth = 2;
  ctx.strokeRect(W / 2 - 90, H / 2 + 20, 180, 44);
  ctx.fillStyle = "rgba(0,229,255,0.08)";
  ctx.fillRect(W / 2 - 90, H / 2 + 20, 180, 44);
  ctx.fillStyle = "#00e5ff";
  ctx.font = `bold 15px 'Courier New', monospace`;
  ctx.fillText("↺  RETRY", W / 2, H / 2 + 48);
  ctx.restore();
  ctx.restore();
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PortfolioGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>("start");
  const playerYRef = useRef(H / 2);
  const velYRef = useRef(0);
  const pipesRef = useRef<Pipe[]>([]);
  const nnRef = useRef(initNN());
  const tickRef = useRef(0);
  const scoreRef = useRef(0);
  const livesRef = useRef(LIVES_MAX);
  const hiRef = useRef(0);
  const flashRef = useRef(0); // frames of invincibility flash
  const speedRef = useRef(2.8);
  const nextPipeRef = useRef(W + 80);
  const rafRef = useRef<number | null>(null);
  const collectedIndices = useRef<Set<number>>(new Set());

  const [gameState, setGameState] = useState<GameState>("start");
  const [activeProject, setActiveProject] = useState<
    (typeof PROJECTS)[number] | null
  >(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load hi score
  useEffect(() => {
    const hi = parseInt(localStorage.getItem("nd_hi") || "0", 10);
    hiRef.current = hi;
  }, []);

  // Reset game state
  const resetGame = useCallback((state: GameState = "playing") => {
    playerYRef.current = H / 2;
    velYRef.current = 0;
    pipesRef.current = [];
    nnRef.current = initNN();
    tickRef.current = 0;
    scoreRef.current = 0;
    livesRef.current = LIVES_MAX;
    flashRef.current = 0;
    speedRef.current = 2.8;
    nextPipeRef.current = W + 80;
    collectedIndices.current = new Set();
    stateRef.current = state;
    setGameState(state);
    setActiveProject(null);
  }, []);

  // Jump
  const jump = useCallback(() => {
    if (stateRef.current === "start" || stateRef.current === "over") {
      resetGame("playing");
      return;
    }
    if (stateRef.current === "playing") {
      velYRef.current = JUMP_FORCE;
    }
  }, [resetGame]);

  // Spawn pipe
  function spawnPipe(projectIdx: number | null) {
    const topH = 60 + Math.random() * (H - PIPE_GAP - 100);
    let collectible: (typeof PROJECTS)[number] | null = null;
    if (projectIdx !== null && !collectedIndices.current.has(projectIdx)) {
      collectible = PROJECTS[projectIdx];
    }
    pipesRef.current.push({
      x: W + PIPE_WIDTH,
      topH,
      collectible,
      collected: false,
      scored: false,
    });
  }

  // Main loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let projectCycleIdx = 0;
    let pipeCount = 0;

    const loop = () => {
      const st = stateRef.current;
      const { nodes, edges } = nnRef.current;
      tickRef.current++;
      const tick = tickRef.current;

      // ── Background ──────────────────────────────────────────────
      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#050a1e");
      bg.addColorStop(1, "#0a0f2e");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      if (st === "playing" || st === "paused") {
        tickNN(nodes);
      }
      drawNN(ctx, nodes, edges);

      if (st === "start") {
        drawStartScreen(ctx);
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      if (st === "over") {
        drawGameOver(ctx, scoreRef.current, hiRef.current);
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      if (st === "paused") {
        // Draw current scene frozen
        drawPlayer(ctx, playerYRef.current, true, false);
        pipesRef.current.forEach((p) => {
          drawPipe(ctx, p);
          drawCollectible(ctx, p, tick);
        });
        drawHUD(ctx, scoreRef.current, hiRef.current, livesRef.current);
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      // ── Physics ──────────────────────────────────────────────────
      velYRef.current += GRAVITY;
      playerYRef.current += velYRef.current;

      // Clamp to floor/ceiling
      if (playerYRef.current - PLAYER_SIZE < 0) {
        playerYRef.current = PLAYER_SIZE;
        velYRef.current = 0;
      }
      if (playerYRef.current + PLAYER_SIZE > H) {
        playerYRef.current = H - PLAYER_SIZE;
        velYRef.current = 0;
        if (flashRef.current <= 0) hit();
      }

      // ── Speed ramp ────────────────────────────────────────────────
      if (tick % 400 === 0) speedRef.current = Math.min(speedRef.current + 0.2, 5.5);

      // ── Spawn pipes ───────────────────────────────────────────────
      if (pipesRef.current.length === 0 || pipesRef.current[pipesRef.current.length - 1].x < nextPipeRef.current) {
        const isProjectPipe = pipeCount % 3 === 2; // every 3rd pipe has a collectible
        const idx = isProjectPipe ? projectCycleIdx % PROJECTS.length : null;
        spawnPipe(idx);
        if (isProjectPipe) projectCycleIdx++;
        pipeCount++;
        nextPipeRef.current = W + 240 + Math.random() * 100;
      }

      // ── Move pipes ────────────────────────────────────────────────
      const speed = speedRef.current;
      pipesRef.current = pipesRef.current.filter((p) => p.x > -PIPE_WIDTH - 30);
      pipesRef.current.forEach((p) => { p.x -= speed; });

      // ── Collision & collect ───────────────────────────────────────
      const py = playerYRef.current;
      const px = PLAYER_X;

      pipesRef.current.forEach((p) => {
        const pRight = p.x + PIPE_WIDTH;
        const inX = px + PLAYER_SIZE * 0.55 > p.x && px - PLAYER_SIZE * 0.55 < pRight;

        // Collectible pick
        if (p.collectible && !p.collected) {
          const collX = p.x + PIPE_WIDTH / 2;
          const collY = p.topH + PIPE_GAP / 2 + Math.sin(tick * 0.05) * 8;
          const dist = Math.hypot(px - collX, py - collY);
          if (dist < PLAYER_SIZE + 16) {
            p.collected = true;
            collectedIndices.current.add(PROJECTS.findIndex(pr => pr.id === p.collectible!.id));
            stateRef.current = "paused";
            setGameState("paused");
            setActiveProject(p.collectible);
          }
        }

        // Pipe collision
        if (inX) {
          const hitTop = py - PLAYER_SIZE * 0.7 < p.topH + 8;
          const hitBot = py + PLAYER_SIZE * 0.7 > p.topH + PIPE_GAP - 8;
          if ((hitTop || hitBot) && flashRef.current <= 0) hit();
        }

        // Score
        if (!p.scored && pRight < px) {
          p.scored = true;
          scoreRef.current += 1;
          if (scoreRef.current > hiRef.current) {
            hiRef.current = scoreRef.current;
            localStorage.setItem("nd_hi", String(hiRef.current));
          }
        }
      });

      // Flash countdown
      if (flashRef.current > 0) flashRef.current--;

      // ── Draw ──────────────────────────────────────────────────────
      pipesRef.current.forEach((p) => {
        drawPipe(ctx, p);
        drawCollectible(ctx, p, tick);
      });
      drawPlayer(ctx, py, true, flashRef.current % 4 < 2 && flashRef.current > 0);
      drawHUD(ctx, scoreRef.current, hiRef.current, livesRef.current);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function hit() {
    livesRef.current -= 1;
    flashRef.current = 60;
    velYRef.current = JUMP_FORCE * 0.5;
    if (livesRef.current <= 0) {
      stateRef.current = "over";
      setGameState("over");
    }
  }

  // Input handling
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") { e.preventDefault(); jump(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jump]);

  // Resume from project card
  const handleResume = () => {
    setActiveProject(null);
    stateRef.current = "playing";
    setGameState("playing");
    velYRef.current = JUMP_FORCE * 0.6; // small upward boost after modal
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center bg-[#050a1e] rounded-2xl overflow-hidden"
      style={{ border: "1px solid rgba(0,229,255,0.15)", boxShadow: "0 0 60px rgba(0,229,255,0.06)" }}
    >
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="block w-full h-full"
        style={{ maxWidth: W, cursor: "pointer" }}
        onClick={jump}
      />

      {/* Fullscreen toggle */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-3 right-3 p-2 rounded-lg text-white/40 hover:text-cyan-400 transition-colors"
        style={{ backdropFilter: "blur(8px)", background: "rgba(255,255,255,0.04)" }}
        aria-label="Toggle fullscreen"
      >
        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </button>

      {/* Project Card Modal */}
      {activeProject && (
        <div
          className="absolute inset-0 flex items-center justify-center z-20"
          style={{ backdropFilter: "blur(12px)", background: "rgba(5,10,30,0.7)" }}
        >
          <div
            className="relative max-w-md w-full mx-4 rounded-2xl p-6"
            style={{
              background: "rgba(10,15,46,0.95)",
              border: `1px solid ${activeProject.color}55`,
              boxShadow: `0 0 40px ${activeProject.color}22`,
            }}
          >
            {/* Close */}
            <button
              onClick={handleResume}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            {/* "Found!" label */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-xs font-bold tracking-widest uppercase px-2 py-1 rounded"
                style={{ color: activeProject.color, background: activeProject.color + "18", border: `1px solid ${activeProject.color}44` }}
              >
                ⬡ Node Collected
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-3">{activeProject.title}</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-4">{activeProject.description}</p>

            <div className="flex flex-wrap gap-2 mb-5">
              {activeProject.tech.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{ background: activeProject.color + "15", color: activeProject.color, border: `1px solid ${activeProject.color}35` }}
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex gap-3">
              <a
                href={activeProject.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors px-3 py-2 rounded-lg border border-white/10 hover:border-white/30"
              >
                <Github size={14} /> GitHub
              </a>
              {"demo" in activeProject && activeProject.demo && (
                <a
                  href={(activeProject as typeof activeProject & { demo?: string }).demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-colors"
                  style={{ background: activeProject.color + "20", color: activeProject.color, border: `1px solid ${activeProject.color}44` }}
                >
                  <ExternalLink size={14} /> Live Demo
                </a>
              )}
              <button
                onClick={handleResume}
                className="ml-auto flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-all"
                style={{ background: activeProject.color, color: "#050a1e" }}
              >
                Continue ▶
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
