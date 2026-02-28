import { redirect } from "next/navigation";
import { Streak } from "@/components/streak";
import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { LessonTopBar } from "@/components/lesson-top-bar";
import { getCourseProgress, getLessonPercentage, getUnits, getUserProgress, getUserSubscription } from "@/db/queries";
import { UnitsList } from "./units-list";

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

      <div className="relative z-10 flex flex-row-reverse gap-[48px] px-4 lg:px-6 pt-16">
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

        <FeedWrapper>
          <UnitsList
            units={units}
            activeLesson={courseProgress.activeLesson}
            activeLessonPercentage={lessonPercentage}
          />
        </FeedWrapper>
      </div>
    </>
  );
};

export default LearnPage;