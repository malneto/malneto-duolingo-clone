import { redirect } from &quot;next/navigation&quot;;

import { Streak } from &quot;@/components/streak&quot;;
import { FeedWrapper } from &quot;@/components/feed-wrapper&quot;;
import { Promo } from &quot;@/components/promo&quot;;
import { Quests } from &quot;@/components/quests&quot;;
import { StickyWrapper } from &quot;@/components/sticky-wrapper&quot;;
import { UserProgress } from &quot;@/components/user-progress&quot;;
import { LessonTopBar } from &quot;@/components/lesson-top-bar&quot;;
import { BottomNavigation } from &quot;@/components/bottom-navigation&quot;;

import {
  getCourseProgress,
  getLessonPercentage,
  getUnits,
  getUserProgress,
  getUserSubscription,
} from &quot;@/db/queries&quot;;


import { UnitsList } from &quot;./units-list&quot;;

const LearnPage = async () =&gt; {
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
    redirect(&quot;/courses&quot;);

  const isPro = !!userSubscription?.isActive;

  return (
    &lt;&gt;
      {/* Top Bar */}
      &lt;LessonTopBar
        hearts={userProgress.hearts}
        points={userProgress.points}
        currentStreak={userProgress.currentStreak || 0}
        hasActiveSubscription={isPro}
      /&gt;

      {/* Conteúdo principal - com ajuste seguro para mobile */}
      &lt;div className=&quot;flex flex-row-reverse gap-[48px] px-6 pt-16 pb-28 lg:pb-0 min-h-screen&quot;&gt;
        
        &lt;StickyWrapper&gt;
          &lt;UserProgress
            activeCourse={userProgress.activeCourse}
            hearts={userProgress.hearts}
            points={userProgress.points}
            hasActiveSubscription={isPro}
          /&gt;

          &lt;div className=&quot;mt-6&quot;&gt;
            &lt;Streak 
              currentStreak={userProgress.currentStreak || 0}
              longestStreak={userProgress.longestStreak || 0}
            /&gt;
          &lt;/div&gt;

          {!isPro &amp;&amp; &lt;Promo /&gt;}
          &lt;Quests points={userProgress.points} /&gt;
        &lt;/StickyWrapper&gt;

        &lt;FeedWrapper&gt;

          
          &lt;UnitsList 
            units={units} 
            activeLesson={courseProgress.activeLesson} 
            activeLessonPercentage={lessonPercentage} 
          /&gt;
        &lt;/FeedWrapper&gt;
      &lt;/div&gt;

      {/* Bottom Navigation - só no celular */}
      &lt;BottomNavigation /&gt;
    &lt;/&gt;
  );
};

export default LearnPage;