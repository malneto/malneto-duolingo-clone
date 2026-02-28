import { FC } from "react";

interface UnitDividerProps {
  children: React.ReactNode;
  nextUnitOrder?: number;
}

const SECTION_THEMES = [
  { bg: "from-amber-100 to-orange-100", border: "border-amber-300", text: "text-amber-700", emoji: "🏆" },
  { bg: "from-sky-100 to-blue-100",     border: "border-sky-300",   text: "text-sky-700",   emoji: "🌊" },
  { bg: "from-green-100 to-emerald-100",border: "border-green-300", text: "text-green-700", emoji: "🌲" },
  { bg: "from-rose-100 to-pink-100",    border: "border-rose-300",  text: "text-rose-700",  emoji: "🌸" },
  { bg: "from-violet-100 to-purple-100",border: "border-violet-300",text: "text-violet-700",emoji: "💜" },
];

export const UnitDivider: FC<UnitDividerProps> = ({ children, nextUnitOrder = 1 }) => {
  const theme = SECTION_THEMES[(nextUnitOrder - 1) % SECTION_THEMES.length];

  return (
    <div className="my-10 flex flex-col items-center gap-3">
      {/* Dotted trail connecting line */}
      <div className="flex flex-col items-center gap-1.5">
        {[0,1,2].map(i => (
          <div key={i} className="h-2 w-2 rounded-full bg-slate-300" />
        ))}
      </div>

      {/* Section label pill */}
      <div
        className={`
          flex items-center gap-2 rounded-full bg-gradient-to-r px-6 py-3
          border-2 ${theme.border} ${theme.bg}
          shadow-md
        `}
      >
        <span className="text-xl">{theme.emoji}</span>
        <span className={`text-sm font-extrabold tracking-wide uppercase ${theme.text}`}>
          {children}
        </span>
        <span className="text-xl">{theme.emoji}</span>
      </div>

      {/* Dotted trail connecting line */}
      <div className="flex flex-col items-center gap-1.5">
        {[0,1,2].map(i => (
          <div key={i} className="h-2 w-2 rounded-full bg-slate-300" />
        ))}
      </div>
    </div>
  );
};