import Image from "next/image";
import { redirect } from "next/navigation";

import { MESSAGES } from "@/constants/messages";
import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { QUESTS } from "@/constants";
import { getUserProgress, getUserSubscription } from "@/db/queries";

const QuestsPage = async () => {
  const [userProgress, userSubscription] = await Promise.all([
    getUserProgress(),
    getUserSubscription(),
  ]);

  if (!userProgress || !userProgress.activeCourse) redirect("/courses");

  const isPro = !!userSubscription?.isActive;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isPro}
        />
        {!isPro && <Promo />}
      </StickyWrapper>

      <FeedWrapper>
        <div className="flex w-full flex-col items-center">
          {/* Icon with glow */}
          <div className="relative flex items-center justify-center">
            <div
              className="absolute h-24 w-24 rounded-full opacity-30 blur-2xl"
              style={{ background: "radial-gradient(circle, #fbbf24, transparent)" }}
            />
            <Image src="/quests.svg" alt="Quests" height={90} width={90} className="relative drop-shadow-lg" />
          </div>

          <h1 className="my-5 text-center text-2xl font-extrabold text-white">
            {MESSAGES.questsTitle}
          </h1>
          <p className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-indigo-300">
            {MESSAGES.questsSubtitle}
          </p>

          {/* Divider */}
          <div className="mb-6 h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)" }} />

          {/* Quest list */}
          <ul className="w-full space-y-3">
            {QUESTS.map((quest) => {
              const progress = Math.min((userProgress.points / quest.value) * 100, 100);
              const isComplete = progress >= 100;

              return (
                <li
                  key={quest.title}
                  className="flex w-full items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-150"
                  style={{
                    background: isComplete
                      ? "linear-gradient(135deg, rgba(74,222,128,0.12), rgba(15,23,42,0.8))"
                      : "rgba(15,23,42,0.6)",
                    border: `1.5px solid ${isComplete ? "rgba(74,222,128,0.5)" : "rgba(99,102,241,0.25)"}`,
                    boxShadow: isComplete ? "0 0 16px rgba(74,222,128,0.2)" : "none",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {/* Icon */}
                  <div
                    className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl"
                    style={{
                      background: isComplete ? "rgba(74,222,128,0.15)" : "rgba(251,191,36,0.1)",
                      border: `1.5px solid ${isComplete ? "rgba(74,222,128,0.4)" : "rgba(251,191,36,0.3)"}`,
                    }}
                  >
                    <Image src="/points.svg" alt="Points" width={36} height={36} />
                    {isComplete && (
                      <span className="absolute -top-1 -right-1 text-sm">✅</span>
                    )}
                  </div>

                  {/* Info + bar */}
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <p className="font-extrabold" style={{ color: isComplete ? "#86efac" : "#e2e8f0" }}>
                        {quest.title}
                      </p>
                      <span
                        className="text-xs font-bold"
                        style={{ color: isComplete ? "#86efac" : "#a5b4fc" }}
                      >
                        {Math.min(userProgress.points, quest.value)} / {quest.value} XP
                      </span>
                    </div>

                    {/* Custom progress bar */}
                    <div
                      className="relative h-3 w-full overflow-hidden rounded-full"
                      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                        style={{
                          width: `${progress}%`,
                          background: isComplete
                            ? "linear-gradient(90deg, #4ade80, #22c55e)"
                            : "linear-gradient(90deg, #6366f1, #22d3ee)",
                          boxShadow: isComplete
                            ? "0 0 8px rgba(74,222,128,0.6)"
                            : "0 0 8px rgba(34,211,238,0.5)",
                        }}
                      />
                      {/* Shine */}
                      <div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{
                          width: `${progress}%`,
                          background: "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 60%)",
                        }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </FeedWrapper>
    </div>
  );
};

export default QuestsPage;