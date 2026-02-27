import { getCourses, getUserProgress } from "@/db/queries";

import { List } from "./list";
import { MESSAGES } from "@/constants/messages";

const CoursesPage = async () => {
  const coursesData = getCourses();
  const userProgressData = getUserProgress();

  const [courses, userProgress] = await Promise.all([
    coursesData,
    userProgressData,
  ]);

  return (
    <div className="mx-auto h-dvh max-w-[912px] px-3 flex flex-col overflow-hidden">
      <h1 className="flex-none text-2xl font-bold text-neutral-700 mb-6">{MESSAGES.coursesTitle}</h1>

      <div className="flex-1 min-h-0 overflow-y-auto pb-[max(20px,env(safe-area-inset-bottom,20px))]">
        <List courses={courses} activeCourseId={userProgress?.activeCourseId} />
      </div>
    </div>
  );
};

export default CoursesPage;
