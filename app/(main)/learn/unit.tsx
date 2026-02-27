import { lessons, units } from "@/db/schema";

import { LessonButton } from "./lesson-button";

type UnitProps = {
  id: number;
  order: number;
  title: string;
  // description removed
  // icon removed

  lessons: Array<{
    id: number;
    title: string;
    order: number;
    completed: boolean;
    subject?: string | null;
    unitId?: number;
  }>;

  activeLesson:
    | (typeof lessons.$inferSelect & {
        unit: typeof units.$inferSelect;
      })
    | undefined;
  activeLessonPercentage: number;
};

export const Unit = ({
  id,
  order,
  title,
  lessons,
  activeLesson,
  activeLessonPercentage,
}: UnitProps) => {
  return (
    <div className="relative flex flex-col items-center">
      {lessons.map((lesson, i) => {
        const isCurrent = lesson.id === activeLesson?.id;
        const isLocked = !lesson.completed && !isCurrent;

        return (
          <LessonButton
            key={lesson.id}
            id={lesson.id}
            index={i}
            totalCount={lessons.length - 1}
            current={isCurrent}
            locked={isLocked}
            percentage={activeLessonPercentage}
            subject={lesson.subject || "DEFAULT"}
          />
        );
      })}
    </div>
  );
};