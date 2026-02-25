import { redirect } from "next/navigation";

import { Streak } from "@/components/streak";
import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { LessonTopBar } from "@/components/lesson-top-bar";
import { BottomNavigation } from "@/components/bottom-navigation";   // ← Import adicionado

import {
  getCourseProgress,
  getLessonPercentage,
  getUnits,
  getUserProgress,
  getUserSubscription,
} from "@/db/queries";

import { Header } from "./header";
import { Unit } from "./unit";

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

  if (!courseProgress || !userProgress || !userProgress.activeCourse)
    redirect("/courses");

  const isPro = !!userSubscription?.isActive;

  return (
    <>
      {/* Barra fixa no topo */}
      <LessonTopBar
        hearts={userProgress.hearts}
        points={userProgress.points}
        currentStreak={userProgress.currentStreak || 0}
        hasActiveSubscription={isPro}
      />

      <div className="flex flex-row-reverse gap-[48px] px-6 pt-16 pb-20 lg:pb-0">   {/* ← pb-20 adicionado */}
        
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
          <Header title={userProgress.activeCourse.title} />
          {units.map((unit) => (
            <div key={unit.id} className="mb-10">
              <Unit
                id={unit.id}
                order={unit.order}
                description={unit.description || "Sem descrição disponível"}
                title={unit.title}
                lessons={unit.lessons}
                activeLesson={courseProgress.activeLesson}
                activeLessonPercentage={lessonPercentage}
              />
            </div>
          ))}
        </FeedWrapper>
      </div>

      {/* BARRA INFERIOR FIXA - Só aparece no celular (igual Duolingo) */}
      <BottomNavigation />
    </>
  );
};

export default LearnPage;