import { redirect } from "next/navigation";

import { getLesson, getUserProgress, getUserSubscription } from "@/db/queries";

import { Quiz } from "./quiz";

const LessonPage = async () => {
  const lessonData = getLesson();
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();

  const [lesson, userProgress, userSubscription] = await Promise.all([
    lessonData,
    userProgressData,
    userSubscriptionData,
  ]);

  if (!lesson || !userProgress) return redirect("/learn");

  // FORÇA a ordenação correta por "order" (isso resolve o problema)
  const sortedChallenges = [...lesson.challenges].sort((a, b) => a.order - b.order);

  const initialPercentage =
    (sortedChallenges.filter((challenge) => challenge.completed).length /
      sortedChallenges.length) *
    100;

  return (
    <Quiz
      initialLessonId={lesson.id}
      initialLessonChallenges={sortedChallenges}   // ← USANDO LISTA ORDENADA
      initialHearts={userProgress.hearts}
      initialPercentage={initialPercentage}
      userSubscription={userSubscription}
    />
  );
};

export default LessonPage;