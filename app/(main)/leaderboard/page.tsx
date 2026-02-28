import Image from "next/image";
import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { UserProgress } from "@/components/user-progress";
import { MESSAGES } from "@/constants/messages";

import {
  getTopTenUsers,
  getUserProgress,
  getUserSubscription,
} from "@/db/queries";

// Starfield decorativo (SSR-safe com valores fixos)
const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  top: `${(i * 37 + 11) % 100}%`,
  left: `${(i * 61 + 7) % 100}%`,
  size: (i % 3) + 1,
  opacity: 0.2 + (i % 4) * 0.1,
}));

const RANK_STYLES: Record<number, { color: string; glow: string; icon: string }> = {
  0: { color: "#fbbf24", glow: "rgba(251,191,36,0.3)",  icon: "🥇" },
  1: { color: "#94a3b8", glow: "rgba(148,163,184,0.25)", icon: "🥈" },
  2: { color: "#fb923c", glow: "rgba(251,146,60,0.25)",  icon: "🥉" },
};

const LeaderboardPage = async () => {
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();
  const leaderboardData = getTopTenUsers();

  const [userProgress, userSubscription, leaderboard] = await Promise.all([
    userProgressData,
    userSubscriptionData,
    leaderboardData,
  ]);

  if (!userProgress || !userProgress.activeCourse) redirect("/courses");

  const isPro = !!userSubscription?.isActive;

  return (
    <div
      className="relative min-h-screen"
      style={{ background: "linear-gradient(180deg, #0a0e1a 0%, #0f172a 60%, #1e1040 100%)" }}
    >
      {/* Starfield */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        {STARS.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{ width: s.size, height: s.size, top: s.top, left: s.left, opacity: s.opacity }}
          />
        ))}
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #0891b2, transparent)" }} />
      </div>

      <div className="relative z-10 flex flex-row-reverse gap-[48px] px-6 py-6">
        <StickyWrapper>
          <UserProgress
            activeCourse={userProgress.activeCourse}
            hearts={userProgress.hearts}
            points={userProgress.points}
            hasActiveSubscription={isPro}
          />
          {!isPro && <Promo />}
          <Quests points={userProgress.points} />
        </StickyWrapper>

        <FeedWrapper>
          <div className="flex w-full flex-col items-center">
            {/* Header */}
            <div className="relative flex flex-col items-center gap-2">
              <div
                className="absolute -inset-6 rounded-full opacity-30 blur-2xl"
                style={{ background: "radial-gradient(circle, #6366f1, transparent)" }}
              />
              <Image src="/leaderboard.svg" alt="Leaderboard" height={90} width={90} className="relative drop-shadow-lg" />
            </div>

            <h1 className="my-5 text-center text-2xl font-extrabold text-white">
              {MESSAGES.leaderboardTitle}
            </h1>
            <p className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-indigo-300">
              {MESSAGES.leaderboardDescription}
            </p>

            {/* Divider */}
            <div className="mb-6 h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)" }} />

            {/* Leaderboard list */}
            <div className="w-full space-y-3">
              {leaderboard.map((entry, i) => {
                const rank = RANK_STYLES[i];
                return (
                  <div
                    key={entry.userId}
                    className="flex w-full items-center gap-4 rounded-2xl px-5 py-3 transition-all duration-150"
                    style={{
                      background: rank
                        ? `linear-gradient(135deg, ${rank.glow.replace("0.3", "0.12")}, rgba(15,23,42,0.7))`
                        : "rgba(15,23,42,0.6)",
                      border: `1.5px solid ${rank ? rank.color + "44" : "rgba(99,102,241,0.2)"}`,
                      boxShadow: rank ? `0 0 16px ${rank.glow}` : "none",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    {/* Rank */}
                    <div className="flex w-8 flex-shrink-0 items-center justify-center">
                      {rank ? (
                        <span className="text-xl">{rank.icon}</span>
                      ) : (
                        <span className="text-sm font-extrabold" style={{ color: "#64748b" }}>
                          {i + 1}
                        </span>
                      )}
                    </div>

                    {/* Avatar */}
                    <Avatar
                      className="h-10 w-10 flex-shrink-0"
                      style={{
                        border: `2px solid ${rank ? rank.color + "66" : "rgba(99,102,241,0.4)"}`,
                        boxShadow: rank ? `0 0 10px ${rank.glow}` : "none",
                      }}
                    >
                      <AvatarImage src={entry.userImageSrc} className="object-cover" />
                    </Avatar>

                    {/* Name */}
                    <p className="flex-1 font-bold" style={{ color: rank ? rank.color : "#e2e8f0" }}>
                      {entry.userName}
                    </p>

                    {/* XP */}
                    <div
                      className="flex items-center gap-1.5 rounded-full px-3 py-1"
                      style={{
                        background: rank ? `${rank.color}18` : "rgba(99,102,241,0.12)",
                        border: `1px solid ${rank ? rank.color + "40" : "rgba(99,102,241,0.3)"}`,
                      }}
                    >
                      <span className="text-xs">⚡</span>
                      <span
                        className="text-sm font-extrabold"
                        style={{ color: rank ? rank.color : "#a5b4fc" }}
                      >
                        {entry.points} XP
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </FeedWrapper>
      </div>
    </div>
  );
};

export default LeaderboardPage;