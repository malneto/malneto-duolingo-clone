import { Check } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type CardProps = {
  title: string;
  id: number;
  imageSrc: string;
  onClick: (id: number) => void;
  disabled?: boolean;
  isActive?: boolean;
};

const PLANET_COLORS = [
  { border: "rgba(34,211,238,0.6)",  glow: "rgba(34,211,238,0.25)",  bg: "rgba(34,211,238,0.07)"  },
  { border: "rgba(167,139,250,0.6)", glow: "rgba(167,139,250,0.25)", bg: "rgba(167,139,250,0.07)" },
  { border: "rgba(251,146,60,0.6)",  glow: "rgba(251,146,60,0.25)",  bg: "rgba(251,146,60,0.07)"  },
  { border: "rgba(244,114,182,0.6)", glow: "rgba(244,114,182,0.25)", bg: "rgba(244,114,182,0.07)" },
  { border: "rgba(74,222,128,0.6)",  glow: "rgba(74,222,128,0.25)",  bg: "rgba(74,222,128,0.07)"  },
  { border: "rgba(251,191,36,0.6)",  glow: "rgba(251,191,36,0.25)",  bg: "rgba(251,191,36,0.07)"  },
];

export const Card = ({ title, id, imageSrc, onClick, disabled, isActive }: CardProps) => {
  const col = PLANET_COLORS[id % PLANET_COLORS.length];

  return (
    <div
      onClick={() => onClick(id)}
      className={cn(
        "relative flex h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl p-4 transition-all duration-200 hover:scale-105 active:scale-95",
        disabled && "pointer-events-none opacity-40"
      )}
      style={{
        background: isActive
          ? "linear-gradient(135deg, rgba(74,222,128,0.15), rgba(15,23,42,0.8))"
          : `linear-gradient(135deg, ${col.bg}, rgba(15,23,42,0.7))`,
        border: `2px solid ${isActive ? "rgba(74,222,128,0.7)" : col.border}`,
        boxShadow: isActive
          ? "0 0 24px rgba(74,222,128,0.35), 0 0 60px rgba(74,222,128,0.08)"
          : `0 0 16px ${col.glow}`,
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Active check badge */}
      {isActive && (
        <div
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full"
          style={{
            background: "linear-gradient(135deg, #4ade80, #22c55e)",
            boxShadow: "0 0 12px rgba(74,222,128,0.5)",
          }}
        >
          <Check className="h-4 w-4 stroke-[3px] text-white" />
        </div>
      )}

      {/* Image with orbit ring */}
      <div className="relative flex items-center justify-center">
        <div
          className="absolute h-16 w-16 animate-spin rounded-full border border-dashed opacity-40"
          style={{ borderColor: isActive ? "#4ade80" : col.border, animationDuration: "12s" }}
        />
        <Image
          src={imageSrc}
          alt={title}
          width={52}
          height={52}
          className="relative rounded-2xl object-cover"
          style={{ filter: `drop-shadow(0 0 8px ${col.glow})` }}
        />
      </div>

      {/* Title */}
      <p
        className="text-center text-sm font-extrabold leading-tight tracking-wide"
        style={{ color: isActive ? "#86efac" : "#e2e8f0" }}
      >
        {title}
      </p>

      {/* Active pill */}
      {isActive && (
        <span
          className="rounded-full px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-widest"
          style={{
            background: "rgba(74,222,128,0.15)",
            border: "1px solid rgba(74,222,128,0.4)",
            color: "#86efac",
          }}
        >
          🚀 Ativo
        </span>
      )}
    </div>
  );
};