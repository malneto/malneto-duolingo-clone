import { lessons, units } from "@/db/schema";

import { LessonButton } from "./lesson-button";

type UnitProps = {
  id: number;
  order: number;
  title: string;
  // description removed
  // icon removed

  lessons: Array&lt;{
    id: number;
    title: string;
    order: number;
    completed: boolean;
    subject?: string | null;
    unitId?: number;
  }&gt;;

  activeLesson:
    | (typeof lessons.$inferSelect &amp; {
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
}: UnitProps) =&gt; {
  return (
    &lt;div className="relative flex flex-col items-center"&gt;
      {lessons.map((lesson, i) =&gt; {
        const isCurrent = lesson.id === activeLesson?.id;
        const isLocked = !lesson.completed &amp;&amp; !isCurrent;

        return (
          &lt;LessonButton
            key={lesson.id}
            id={lesson.id}
            index={i}
            totalCount={lessons.length - 1}
            current={isCurrent}
            locked={isLocked}
            percentage={activeLessonPercentage}
            subject={lesson.subject || "DEFAULT"}
          /&gt;
        );
      })}
    &lt;/div&gt;
  );
};