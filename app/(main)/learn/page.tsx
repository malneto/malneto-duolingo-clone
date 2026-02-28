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
  const userProgressData = getUserProgress();
  const courseProgressData = getCourseProgress();
  const lessonPercentageData = getLessonPercentage();
  const unitsData = getUnits();
  const userSubscriptionData = getUserSubscription();

  const [
    userProgress,
    units,
    courseProgress,
    lessonPercentage,
    userSubscription,
  ] = await Promise.all([
    userProgressData,
    unitsData,
    courseProgressData,
    lessonPercentageData,
    userSubscriptionData,
  ]);

  // Trigger xAI lessons check - Tratamento de erro para evitar SyntaxError ao parsear resposta inválida
  const checkLessonsRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/check-lessons`, { cache: 'no-store' });
  let checkLessons = { success: false, message: "Check failed" };
  if (checkLessonsRes.ok) {
    checkLessons = await checkLessonsRes.json();
  } else {
    console.error("Check lessons API failed:", checkLessonsRes.status, await checkLessonsRes.text());
  }
  console.log('[Fera /learn] Lessons check:', checkLessons);

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

      {/* Conteúdo principal - com ajuste seguro para mobile */}
      <div className="flex flex-row-reverse gap-[48px] px-6 pt-16 pb-28 lg:pb-0 min-h-screen">
        
        <StickyWrapper>
          <UserProgress
            activeCourse={userProgress.activeCourse}
            hearts={userProgress.hearts}
            points={userProgress.points}
            hasActiveSubscription={isPro}
          />

          <div className="mt-6">
            <Streak 
              currentStreak={userProgress.currentStreak || 0}
              longestStreak={userProgress.longestStreak || 0}
            />
          </div>

          {!isPro && <Promo />}
          <Quests points={userProgress.points} />
        </StickyWrapper>

        <FeedWrapper>

          
          <UnitsList 
            units={units} 
            activeLesson={courseProgress.activeLesson} 
            activeLessonPercentage={lessonPercentage} 
          />
        </FeedWrapper>
      </div>

      {/* Bottom Navigation - só no celular */}
      <BottomNavigation />
    </>
  );
};

export default LearnPage;