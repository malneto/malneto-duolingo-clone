import Link from "next/link";
import { BookOpen } from "lucide-react";

type UnitBannerProps = { unitOrder: number; totalUnits: number; title: string };

const PLANET_THEMES = [
  { from: "#7c3aed", to: "#4f46e5", glow: "rgba(124,58,237,0.5)",  planet: "🪐", name: "Saturno" },
  { from: "#0e7490", to: "#0284c7", glow: "rgba(14,116,144,0.5)",  planet: "🌍", name: "Terra"   },
  { from: "#b45309", to: "#d97706", glow: "rgba(180,83,9,0.5)",    planet: "🔴", name: "Marte"   },
  { from: "#be185d", to: "#db2777", glow: "rgba(190,24,93,0.5)",   planet: "🌸", name: "Vênus"   },
  { from: "#065f46", to: "#059669", glow: "rgba(6,95,70,0.5)",     planet: "🌑", name: "Plutão"  },
];

export const UnitBanner = ({ unitOrder, totalUnits, title }: UnitBannerProps) => {
  const t = PLANET_THEMES[(unitOrder - 1) % PLANET_THEMES.length];

  return (
    <div
      className="sticky top-[56px] z-40 mx-auto mb-8 w-full max-w-[600px] rounded-3xl p-px"
      style={{
        background: `linear-gradient(135deg, ${t.from}, ${t.to})`,
        boxShadow: `0 8px 32px ${t.glow}, 0 0 0 1px rgba(255,255,255,0.08)`,
      }}
    >
      <div
        className="flex items-center justify-between gap-4 rounded-[22px] px-5 py-4"
        style={{ background: "rgba(8,10,20,0.82)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Planet icon */}
          <div
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-2xl"
            style={{
              background: `linear-gradient(135deg, ${t.from}55, ${t.to}44)`,
              border: `1.5px solid ${t.from}99`,
              boxShadow: `0 0 12px ${t.glow}`,
            }}
          >
            {t.planet}
          </div>

          <div className="min-w-0">
            {/* Subtitle — brighter */}
            <p
              className="text-xs font-extrabold uppercase tracking-widest"
              style={{ color: t.from === "#7c3aed" ? "#c4b5fd" : t.from === "#0e7490" ? "#67e8f9" : t.from === "#b45309" ? "#fcd34d" : t.from === "#be185d" ? "#f9a8d4" : "#6ee7b7" }}
            >
              Planeta {t.name} · U{unitOrder}/{totalUnits}
            </p>
            {/* Title — pure white, no truncation risk */}
            <h2 className="text-lg font-extrabold leading-tight text-white drop-shadow-sm">
              {title}
            </h2>
          </div>
        </div>

        <Link href="/lesson" className="flex-shrink-0">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-2xl transition hover:scale-110 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#e2e8f0",
            }}
          >
            <BookOpen className="h-5 w-5" />
          </button>
        </Link>
      </div>
    </div>
  );
};