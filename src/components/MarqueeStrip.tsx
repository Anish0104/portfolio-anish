"use client";

const ITEMS = [
  "Python", "PyTorch", "TensorFlow", "LangChain", "RAG", "YOLOv8",
  "Next.js 16", "FastAPI", "Supabase", "Docker", "CUDA", "HuggingFace",
  "ChromaDB", "NumPy", "LLaMA 3.1", "Gemini 2.5", "Attention-LSTM", "OpenCV",
  "Pandas", "Redis", "ByteTrack", "RL / PPO", "Auth0", "TypeScript",
];

const Row = ({ reverse = false }: { reverse?: boolean }) => {
  const items = [...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden flex items-center">
      <div
        className={reverse ? "animate-marquee-rev" : "animate-marquee"}
        style={{ display: "flex", gap: "2rem", width: "max-content", willChange: "transform" }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="text-[9px] font-black uppercase tracking-[0.35em] text-[var(--muted)] opacity-40 whitespace-nowrap flex items-center gap-2"
          >
            {item}
            <span className="opacity-40 text-[6px]">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default function MarqueeStrip() {
  return (
    <div className="w-full py-4 border-y border-[var(--card-border)] bg-[var(--card-bg)]/50 backdrop-blur-sm flex flex-col gap-3 overflow-hidden">
      <Row />
      <Row reverse />
    </div>
  );
}
