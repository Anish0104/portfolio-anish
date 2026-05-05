"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, GitCommitHorizontal, Flame } from "lucide-react";
import SectionHeading from "./SectionHeading";

type DayData = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

type WeekData = (DayData | null)[];

const LEVEL_COLORS = [
  "bg-[#ebedf0] border-[#d0d7de]",
  "bg-[#9be9a8] border-[#6fcf97]",
  "bg-[#40c463] border-[#30a14e]",
  "bg-[#30a14e] border-[#216e39]",
  "bg-[#216e39] border-[#144d2b]",
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function buildGrid(data: DayData[], fromDate: string): { weeks: WeekData[]; months: { label: string; col: number }[] } {
  if (!data.length) return { weeks: [], months: [] };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(fromDate);
  start.setHours(0, 0, 0, 0);

  // Align start to the Sunday of that week
  const startDay = start.getDay();
  const alignedStart = new Date(start);
  alignedStart.setDate(start.getDate() - startDay);

  const dayMap = new Map<string, DayData>();
  data.forEach((d) => dayMap.set(d.date, d));

  const weeks: WeekData[] = [];
  const monthsSeen = new Map<string, number>();

  let cursor = new Date(alignedStart);
  let weekIndex = 0;

  while (cursor <= today) {
    const week: (DayData | null)[] = [];
    for (let d = 0; d < 7; d++) {
      const iso = cursor.toISOString().slice(0, 10);
      const isBeforeStart = cursor < start;
      const isAfterToday  = cursor > today;

      if (isBeforeStart || isAfterToday) {
        week.push(null);
      } else {
        const monthKey = `${cursor.getFullYear()}-${cursor.getMonth()}`;
        if (!monthsSeen.has(monthKey)) {
          monthsSeen.set(monthKey, weekIndex);
        }
        week.push(dayMap.get(iso) ?? { date: iso, count: 0, level: 0 });
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
    weekIndex++;
  }

  const months: { label: string; col: number }[] = [];
  monthsSeen.forEach((col, key) => {
    const [, monthIdx] = key.split("-");
    months.push({ label: MONTHS[parseInt(monthIdx)], col });
  });
  months.sort((a, b) => a.col - b.col);

  return { weeks, months };
}

export default function GitHubGraph() {
  const [days, setDays]       = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);
  const [total, setTotal]     = useState(0);
  const [streak, setStreak]   = useState(0);

  useEffect(() => {
    const year = new Date().getFullYear();
    fetch(`https://github-contributions-api.jogruber.de/v4/Anish0104?y=${year}`)
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json();
      })
      .then((d) => {
        const allDays: DayData[] = d.contributions ?? [];
        // Filter from Feb 2026 onwards
        const filtered = allDays.filter((c) => c.date >= "2026-02-01");
        setDays(filtered);
        setTotal(filtered.reduce((s, c) => s + c.count, 0));

        // Calculate current streak
        const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));
        let s = 0;
        for (const day of sorted) {
          if (day.count > 0) s++;
          else break;
        }
        setStreak(s);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const { weeks, months } = buildGrid(days, "2026-02-01");

  return (
    <section id="github" className="py-16 relative">
      <div className="container mx-auto px-6 max-w-5xl">
        <SectionHeading
          title="GitHub Activity"
          subtitle="Contribution graph — live since February 2026."
          centered
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 bg-white rounded-[2rem] border border-[var(--card-border)] shadow-sm p-6 md:p-8 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0F172A]/5 border border-[var(--card-border)] flex items-center justify-center">
                <Github size={16} className="text-[var(--foreground)]" />
              </div>
              <div>
                <p className="text-[13px] font-black uppercase tracking-[0.25em] text-[var(--foreground)]">
                  Anish0104
                </p>
                <p className="text-[10px] text-[var(--muted)] opacity-60">github.com/Anish0104</p>
              </div>
            </div>

            {/* Stats pills */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                <GitCommitHorizontal size={11} className="text-emerald-600" />
                <span className="text-[10px] font-black text-emerald-700">
                  {loading ? "—" : `${total} contributions`}
                </span>
              </div>
              {streak > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
                  <Flame size={11} className="text-amber-600" />
                  <span className="text-[10px] font-black text-amber-700">{streak}-day streak</span>
                </div>
              )}
            </div>
          </div>

          {/* Graph */}
          {loading && (
            <div className="h-28 flex items-center justify-center">
              <div className="flex gap-1 items-end h-8">
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 rounded-sm bg-[#ebedf0]"
                    animate={{ scaleY: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, delay: i * 0.1, repeat: Infinity, ease: "easeInOut" }}
                    style={{ height: `${20 + Math.random() * 60}%`, originY: 1 }}
                  />
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="h-28 flex items-center justify-center text-[13px] text-[var(--muted)] opacity-50">
              Could not load contribution data.
            </div>
          )}

          {!loading && !error && (
            <div className="overflow-x-auto pb-2">
              <div className="min-w-max">
                {/* Month labels */}
                <div className="flex gap-[3px] mb-1 pl-8">
                  {months.map(({ label, col }, i) => (
                    <div
                      key={i}
                      className="text-[10px] font-semibold text-[var(--muted)] opacity-60 absolute"
                      style={{ transform: `translateX(${col * 15}px)` }}
                    >
                      {label}
                    </div>
                  ))}
                </div>
                <div className="pt-4 flex gap-[3px]">
                  {/* Day labels */}
                  <div className="flex flex-col gap-[3px] mr-1.5 mt-0">
                    {DAYS.map((day, i) => (
                      <div key={day} className="w-6 h-[11px] flex items-center justify-end">
                        {i % 2 === 1 && (
                          <span className="text-[9px] text-[var(--muted)] opacity-50 font-medium">{day}</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Weeks */}
                  {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[3px]">
                      {week.map((day, di) => (
                        <div
                          key={di}
                          className={`w-[11px] h-[11px] rounded-sm border transition-transform hover:scale-125 ${
                            day === null
                              ? "bg-transparent border-transparent"
                              : LEVEL_COLORS[day.level]
                          }`}
                          title={day ? `${day.date}: ${day.count} contributions` : ""}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-1.5 mt-3 justify-end">
                  <span className="text-[9px] text-[var(--muted)] opacity-50 mr-1">Less</span>
                  {LEVEL_COLORS.map((cls, i) => (
                    <div key={i} className={`w-[11px] h-[11px] rounded-sm border ${cls}`} />
                  ))}
                  <span className="text-[9px] text-[var(--muted)] opacity-50 ml-1">More</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
