import Image from "next/image";
import Link from "next/link";
import { QUESTS } from "@/constants";
import { MESSAGES } from "@/constants/messages";

type QuestsProps = { points: number };

export const Quests = ({ points }: QuestsProps) => {
  return (
    <div
      className="space-y-4 rounded-2xl p-4"
      style={{
        background: "rgba(15,23,42,0.7)",
        border: "1.5px solid rgba(99,102,241,0.2)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="flex w-full items-center justify-between">
        <h3 className="text-sm font-extrabold uppercase tracking-widest text-indigo-300">
          🎯 {MESSAGES.questsTitleTsx}
        </h3>
        <Link href="/quests">
          <span
            className="cursor-pointer rounded-full px-3 py-1 text-xs font-bold transition-all hover:opacity-80"
            style={{
              background: "rgba(99,102,241,0.15)",
              border: "1px solid rgba(99,102,241,0.35)",
              color: "#a5b4fc",
            }}
          >
            {MESSAGES.viewAll}
          </span>
        </Link>
      </div>

      <ul className="w-full space-y-3">
        {QUESTS.map((quest) => {
          const progress = Math.min((points / quest.value) * 100, 100);
          const isComplete = progress >= 100;

          return (
            <li key={quest.title} className="flex w-full items-center gap-x-3">
              <div
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: isComplete ? "rgba(74,222,128,0.12)" : "rgba(251,191,36,0.08)",
                  border: `1px solid ${isComplete ? "rgba(74,222,128,0.35)" : "rgba(251,191,36,0.25)"}`,
                }}
              >
                <Image src="/points.svg" alt="Points" width={22} height={22} />
              </div>

              <div className="flex w-full flex-col gap-y-1">
                <p className="text-xs font-bold" style={{ color: isComplete ? "#86efac" : "#cbd5e1" }}>
                  {quest.title}
                </p>
                {/* Progress bar */}
                <div
                  className="relative h-2 w-full overflow-hidden rounded-full"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                      background: isComplete
                        ? "linear-gradient(90deg, #4ade80, #22c55e)"
                        : "linear-gradient(90deg, #6366f1, #22d3ee)",
                      boxShadow: isComplete
                        ? "0 0 6px rgba(74,222,128,0.5)"
                        : "0 0 6px rgba(34,211,238,0.4)",
                    }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};