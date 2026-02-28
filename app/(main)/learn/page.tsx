import { redirect } from "next/navigation";

import { Streak } from "@/components/streak";
import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { LessonTopBar } from "@/components/lesson-top-bar";
import { BottomNavigation } from "@/components/bottom-navigation";

import {
  getCourseProgress,
  getLessonPercentage,
  getUnits,
  getUserProgress,
  getUserSubscription,
} from "@/db/queries";

import { UnitsList } from "./units-list";

const LearnPage = async () => {
  const [
    userProgress,
    units,
    courseProgress,
    lessonPercentage,
    userSubscription,
  ] = await Promise.all([
    getUserProgress(),
    getUnits(),
    getCourseProgress(),
    getLessonPercentage(),
    getUserSubscription(),
  ]);

  if (!courseProgress || !userProgress || !userProgress.activeCourse)
    redirect("/courses");

  const isPro = !!userSubscription?.isActive;

  return (
    <>
      {/* Top Bar */}
      <LessonTopBar
        hearts={userProgress.hearts}
        points={userProgress.points}
        currentStreak={userProgress.currentStreak || 0}
        hasActiveSubscription={isPro}
      />

      {/* Adventure trail background */}
      <div
        className="min-h-screen pt-16 pb-28 lg:pb-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, #d1fae5 0%, transparent 50%),
            radial-gradient(ellipse at 80% 60%, #dbeafe 0%, transparent 50%),
            radial-gradient(ellipse at 50% 90%, #fef3c7 0%, transparent 50%),
            linear-gradient(180deg, #f0fdf4 0%, #f0f9ff 50%, #fffbeb 100%)
          `,
        }}
      >
        {/* Floating background decorations */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
          {[
            { top: "8%",  left: "5%",  emoji: "☁️",  size: "text-5xl", opacity: 0.4, delay: "0s" },
            { top: "15%", right: "8%", emoji: "🌟",  size: "text-3xl", opacity: 0.5, delay: "1s" },
            { top: "35%", left: "3%",  emoji: "☁️",  size: "text-4xl", opacity: 0.3, delay: "2s" },
            { top: "50%", right: "5%", emoji: "✨",  size: "text-2xl", opacity: 0.6, delay: "0.5s" },
            { top: "65%", left: "6%",  emoji: "🌿",  size: "text-3xl", opacity: 0.5, delay: "1.5s" },
            { top: "80%", right: "7%", emoji: "☁️",  size: "text-5xl", opacity: 0.3, delay: "3s" },
          ].map((item, i) => (
            <div
              key={i}
              className={`absolute ${item.size} animate-bounce select-none`}
              style={{
                top: item.top,
                left: (item as any).left,
                right: (item as any).right,
                opacity: item.opacity,
                animationDuration: "4s",
                animationDelay: item.delay,
              }}
            >
              {item.emoji}
            </div>
          ))}
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
              <Streak
                currentStreak={userProgress.currentStreak || 0}
                longestStreak={userProgress.longestStreak || 0}
              />
            </div>
            {!isPro && <Promo />}
            <Quests points={userProgress.points} />
          </StickyWrapper>

          {/* Main trail content */}
          <FeedWrapper>
            <UnitsList
              units={units}
              activeLesson={courseProgress.activeLesson}
              activeLessonPercentage={lessonPercentage}
            />
          </FeedWrapper>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </>
  );
};

export default LearnPage;