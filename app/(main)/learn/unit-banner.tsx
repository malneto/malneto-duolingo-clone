import Link from "next/link";
import { BookOpen } from "lucide-react";

type UnitBannerProps = {
  unitOrder: number;
  totalUnits: number;
  title: string;
};

// Color themes per unit (cycles)
const UNIT_THEMES = [
  { from: "#FF6B35", to: "#FF9500", shadow: "rgba(255,107,53,0.4)" },   // orange fire
  { from: "#4FACFE", to: "#00F2FE", shadow: "rgba(79,172,254,0.4)" },   // ocean blue
  { from: "#43E97B", to: "#38F9D7", shadow: "rgba(67,233,123,0.4)" },   // fresh green
  { from: "#FA709A", to: "#FEE140", shadow: "rgba(250,112,154,0.4)" },  // sunset
  { from: "#A18CD1", to: "#FBC2EB", shadow: "rgba(161,140,209,0.4)" },  // lavender
];

const UNIT_EMOJIS = ["🗺️", "🌊", "🌲", "🌅", "🔮"];

export const UnitBanner = ({
  unitOrder,
  totalUnits,
  title,
}: UnitBannerProps) => {
  const themeIndex = (unitOrder - 1) % UNIT_THEMES.length;
  const theme = UNIT_THEMES[themeIndex];
  const emoji = UNIT_EMOJIS[themeIndex];

  return (
    <div
      className="sticky top-[56px] z-40 mx-auto mb-6 w-full max-w-[600px] rounded-3xl p-[2px]"
      style={{
        background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
        boxShadow: `0 8px 32px ${theme.shadow}, 0 2px 8px rgba(0,0,0,0.1)`,
      }}
    >
      <div className="flex items-center justify-between gap-4 rounded-[22px] bg-white/10 backdrop-blur-sm px-5 py-4">
        {/* Left: emoji + text */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/25 text-2xl shadow-inner"
          >
            {emoji}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-white/80">
              Unidade {unitOrder} de {totalUnits}
            </p>
            <h2 className="truncate text-lg font-extrabold text-white leading-tight drop-shadow-sm">
              {title}
            </h2>
          </div>
        </div>

        {/* Right: guide button */}
        <Link href="/lesson" className="flex-shrink-0">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/25 text-white transition hover:bg-white/40 active:scale-95 shadow"
            title="Guia da Unidade"
          >
            <BookOpen className="h-5 w-5 stroke-[2.5]" />
          </button>
        </Link>
      </div>
    </div>
  );
};