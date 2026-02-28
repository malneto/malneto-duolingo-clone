import { redirect } from "next/navigation";
import { Streak } from "@/components/streak";
import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { LessonTopBar } from "@/components/lesson-top-bar";
import { BottomNavigation } from "@/components/bottom-navigation";
import { getCourseProgress, getLessonPercentage, getUnits, getUserProgress, getUserSubscription } from "@/db/queries";
import { UnitsList } from "./units-list";

// Fixed star positions (avoids hydration mismatch)
const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  top: `${(i * 37 + 11) % 100}%`,
  left: `${(i * 61 + 7) % 100}%`,
  size: (i % 3) + 1,
  opacity: ((i % 5) + 3) / 10,
  dur: `${((i % 4) + 2)}s`,
  delay: `${(i % 6) * 0.4}s`,
}));

const LearnPage = async () => {
  const [userProgress, units, courseProgress, lessonPercentage, userSubscription] = await Promise.all([
    getUserProgress(), getUnits(), getCourseProgress(), getLessonPercentage(), getUserSubscription(),
  ]);

  if (!courseProgress || !userProgress || !userProgress.activeCourse) redirect("/courses");

  const isPro = !!userSubscription?.isActive;

  return (
    <>
      <LessonTopBar
        hearts={userProgress.hearts}
        points={userProgress.points}
        currentStreak={userProgress.currentStreak || 0}
        hasActiveSubscription={isPro}
      />

      {/* Deep space background */}
      <div className="relative min-h-screen pt-16 pb-28 lg:pb-0"
        style={{ background: "linear-gradient(180deg, #050810 0%, #0a0e1a 40%, #0d0a1f 100%)" }}>

        {/* Starfield */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
          {STARS.map((s) => (
            <div key={s.id} className="absolute rounded-full bg-white animate-pulse"
              style={{ width: s.size, height: s.size, top: s.top, left: s.left, opacity: s.opacity, animationDuration: s.dur, animationDelay: s.delay }} />
          ))}
          {/* Nebula blobs */}
          <div className="absolute top-[10%] left-[15%] h-80 w-80 rounded-full opacity-[0.06]"
            style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
          <div className="absolute top-[45%] right-[10%] h-64 w-64 rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(circle, #0891b2, transparent)" }} />
          <div className="absolute bottom-[15%] left-[30%] h-72 w-72 rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, #be185d, transparent)" }} />

          {/* Occasional shooting star */}
          <div className="absolute top-[20%] left-0 h-px w-32 opacity-40"
            style={{ background: "linear-gradient(90deg, transparent, #22d3ee, transparent)", animation: "shootingStar 6s linear infinite" }} />
        </div>

        <div className="relative z-10 flex flex-row-reverse gap-[48px] px-6">
          {/* Sidebar */}
          <StickyWrapper>
            <UserProgress
              activeCourse={userProgress.activeCourse}
              hearts={userProgress.hearts}
              points={userProgress.points}
              hasActiveSubscription={isPro}
            />
            <div className="mt-2">
              <Streak currentStreak={userProgress.currentStreak || 0} longestStreak={userProgress.longestStreak || 0} />
            </div>
            {!isPro && <Promo />}
            <Quests points={userProgress.points} />
          </StickyWrapper>

          {/* Trail */}
          <FeedWrapper>
            <UnitsList units={units} activeLesson={courseProgress.activeLesson} activeLessonPercentage={lessonPercentage} />
          </FeedWrapper>
        </div>
      </div>

      <BottomNavigation />

      <style>{`
        @keyframes shootingStar {
          0% { transform: translateX(-100px) translateY(0); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translateX(110vw) translateY(60px); opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default LearnPage;