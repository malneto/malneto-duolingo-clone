import { FC } from "react";

interface UnitDividerProps {
  children: React.ReactNode;
  nextUnitOrder?: number;
}

const DIVIDER_THEMES = [
  { color: "#a78bfa", label: "🪐 Nova Órbita" },
  { color: "#22d3ee", label: "🌊 Novo Setor" },
  { color: "#4ade80", label: "🌌 Nova Galáxia" },
  { color: "#fb923c", label: "☄️ Nova Rota" },
  { color: "#f472b6", label: "✨ Nova Missão" },
];

export const UnitDivider: FC<UnitDividerProps> = ({ children, nextUnitOrder = 1 }) => {
  const t = DIVIDER_THEMES[(nextUnitOrder - 1) % DIVIDER_THEMES.length];

  return (
    <div className="my-10 flex flex-col items-center gap-3">
      {/* Dotted trail */}
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: `${t.color}55`, animationDelay: `${i * 0.2}s` }} />
      ))}

      {/* Asteroid belt divider */}
      <div
        className="flex items-center gap-3 rounded-full px-6 py-2.5"
        style={{
          background: `linear-gradient(135deg, ${t.color}30, ${t.color}18)`,
          border: `2px solid ${t.color}99`,
          boxShadow: `0 0 24px ${t.color}55, inset 0 0 12px ${t.color}15`,
        }}
      >
        <span className="text-base">{t.label}</span>
        <span style={{ color: "#ffffff", fontWeight: 800, fontSize: "0.875rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {children}
        </span>
        <span className="text-base">🚀</span>
      </div>

      {[0, 1, 2].map((i) => (
        <div key={i} className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: `${t.color}55`, animationDelay: `${i * 0.2}s` }} />
      ))}
    </div>
  );
};