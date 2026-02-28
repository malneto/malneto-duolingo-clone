import { useCallback } from "react";

import Image from "next/image";
import { useAudio, useKey } from "react-use";

import { cn } from "@/lib/utils";

type CardProps = {
  id: number;
  text: string;
  imageSrc: string | null;
  audioSrc: string | null;
  shortcut: string;
  selected?: boolean;
  onClick: () => void;
  status?: "correct" | "wrong" | "none";
  disabled?: boolean;
  type: string;
};

export const Card = ({
  text,
  imageSrc,
  audioSrc,
  shortcut,
  selected,
  onClick,
  status,
  disabled,
  type,
}: CardProps) => {
  const [audio, _, controls] = useAudio({ src: audioSrc || "" });

  const handleClick = useCallback(() => {
    if (disabled) return;
    if (audioSrc && controls) void controls.play();
    onClick();
  }, [disabled, onClick, controls, audioSrc]);

  useKey(shortcut, handleClick, {}, [handleClick]);

  const borderColor =
    selected && status === "correct" ? "rgba(74,222,128,0.7)"
    : selected && status === "wrong"   ? "rgba(248,113,113,0.7)"
    : selected                         ? "rgba(34,211,238,0.7)"
    : "rgba(99,102,241,0.3)";

  const bgColor =
    selected && status === "correct" ? "rgba(74,222,128,0.1)"
    : selected && status === "wrong"   ? "rgba(248,113,113,0.1)"
    : selected                         ? "rgba(34,211,238,0.1)"
    : "rgba(15,23,42,0.6)";

  const glowColor =
    selected && status === "correct" ? "0 0 18px rgba(74,222,128,0.35)"
    : selected && status === "wrong"   ? "0 0 18px rgba(248,113,113,0.35)"
    : selected                         ? "0 0 18px rgba(34,211,238,0.35)"
    : "0 0 8px rgba(99,102,241,0.15)";

  const textColor =
    selected && status === "correct" ? "#86efac"
    : selected && status === "wrong"   ? "#fca5a5"
    : selected                         ? "#67e8f9"
    : "#94a3b8";

  return (
    <div
      onClick={handleClick}
      className={cn(
        "h-full cursor-pointer rounded-2xl border-2 p-4 transition-all duration-150 active:scale-[0.98] lg:p-6",
        disabled && "pointer-events-none opacity-50",
        type === "ASSIST" && "w-full lg:p-3"
      )}
      style={{
        borderColor,
        backgroundColor: bgColor,
        boxShadow: glowColor,
        backdropFilter: "blur(8px)",
      }}
    >
      {audioSrc && audio}

      {imageSrc && (
        <div className="relative mb-4 aspect-square max-h-[80px] w-full lg:max-h-[150px]">
          <Image src={imageSrc} fill alt={text} />
        </div>
      )}

      <div className={cn("flex items-center justify-between", type === "ASSIST" && "flex-row-reverse")}>
        {type === "ASSIST" && <div aria-hidden />}

        <p className="text-sm font-semibold lg:text-base" style={{ color: textColor }}>
          {text}
        </p>

        <div
          className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold lg:h-[30px] lg:w-[30px] lg:text-[15px]"
          style={{
            border: `1.5px solid ${borderColor}`,
            color: textColor,
            backgroundColor: selected ? `${borderColor.replace("0.7", "0.15")}` : "transparent",
          }}
        >
          {shortcut}
        </div>
      </div>
    </div>
  );
};