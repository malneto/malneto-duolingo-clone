import Link from "next/link";
import { BookOpen } from "lucide-react";

type UnitBannerProps = { unitOrder: number; totalUnits: number; title: string };

const PLANET_THEMES = [
  { from: "#7c3aed", to: "#4f46e5", glow: "rgba(124,58,237,0.4)", planet: "🪐", name: "Saturno" },
  { from: "#0e7490", to: "#0284c7", glow: "rgba(14,116,144,0.4)", planet: "🌍", name: "Terra" },
  { from: "#b45309", to: "#d97706", glow: "rgba(180,83,9,0.4)",   planet: "🔴", name: "Marte" },
  { from: "#be185d", to: "#db2777", glow: "rgba(190,24,93,0.4)",  planet: "🌸", name: "Vênus" },
  { from: "#065f46", to: "#059669", glow: "rgba(6,95,70,0.4)",    planet: "🌑", name: "Plutão" },
];

export const UnitBanner = ({ unitOrder, totalUnits, title }: UnitBannerProps) => {
  const t = PLANET_THEMES[(unitOrder - 1) % PLANET_THEMES.length];

  return (
    <div
      className="sticky top-[56px] z-40 mx-auto mb-8 w-full max-w-[600px] rounded-3xl p-px"
      style={{
        background: `linear-gradient(135deg, ${t.from}, ${t.to})`,
        boxShadow: `0 8px 32px ${t.glow}, 0 0 0 1px rgba(255,255,255,0.05)`,
      }}
    >
      <div
        className="flex items-center justify-between gap-4 rounded-[22px] px-5 py-4"
        style={{ background: "rgba(10,14,26,0.75)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-2xl"
            style={{ background: `linear-gradient(135deg, ${t.from}44, ${t.to}44)`, border: `1px solid ${t.from}66` }}
          >
            {t.planet}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: `${t.from}cc` }}>
              Planeta {t.name} · U{unitOrder}/{totalUnits}
            </p>
            <h2 className="truncate text-lg font-extrabold text-white leading-tight">{title}</h2>
          </div>
        </div>

        <Link href="/lesson" className="flex-shrink-0">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-2xl transition hover:scale-110 active:scale-95"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#94a3b8" }}
          >
            <BookOpen className="h-5 w-5" />
          </button>
        </Link>
      </div>
    </div>
  );
};