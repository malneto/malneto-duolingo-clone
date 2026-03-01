import { lessons, units } from "@/db/schema";
import { LessonButton } from "./lesson-button";

type UnitProps = {
  id: number;
  order: number;
  title: string;
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

// SVG trail path connecting lessons visually
const TrailPath = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
    <svg
      className="absolute left-1/2 top-0 -translate-x-1/2 opacity-20"
      width="4"
      height="100%"
      preserveAspectRatio="none"
    >
      <line
        x1="2" y1="0" x2="2" y2="100%"
        stroke="#86efac"
        strokeWidth="4"
        strokeDasharray="12 8"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export const Unit = ({
  id,
  order,
  title,
  lessons,
  activeLesson,
  activeLessonPercentage,
}: UnitProps) => {
  return (
    <div className="relative flex flex-col items-center min-h-[100px]">
      <TrailPath />
      {(() => {
        const firstUncompletedIndex = lessons.findIndex((l) => !l.completed);
        return lessons.map((lesson, i) => {
        const isCurrent = lesson.id === activeLesson?.id;
        const isLocked = !lesson.completed && i !== firstUncompletedIndex;

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
      });
      })()}
    </div>
  );
};