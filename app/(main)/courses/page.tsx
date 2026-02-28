import { getCourses, getUserProgress } from "@/db/queries";
import { MESSAGES } from "@/constants/messages";
import { List } from "./list";

const STARS = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  top: `${(i * 41 + 13) % 100}%`,
  left: `${(i * 67 + 5) % 100}%`,
  size: (i % 3) + 1,
  opacity: 0.15 + (i % 5) * 0.08,
}));

const CoursesPage = async () => {
  const [courses, userProgress] = await Promise.all([getCourses(), getUserProgress()]);

  return (
    <div
      className="relative min-h-dvh"
      style={{ background: "linear-gradient(180deg, #0a0e1a 0%, #0f172a 60%, #1e1040 100%)" }}
    >
      {/* Starfield */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        {STARS.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{ width: s.size, height: s.size, top: s.top, left: s.left, opacity: s.opacity }}
          />
        ))}
        <div className="absolute top-10 left-1/3 h-80 w-80 rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
        <div className="absolute bottom-1/3 right-1/4 h-56 w-56 rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #0891b2, transparent)" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[912px] px-4 py-8">

        {/* Header */}
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <span className="text-5xl">🌌</span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {MESSAGES.coursesTitle}
          </h1>
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-300">
            Escolha seu planeta para explorar
          </p>
          {/* Decorative divider */}
          <div className="mt-2 h-px w-48" style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)" }} />
        </div>

        <List courses={courses} activeCourseId={userProgress?.activeCourseId} />
      </div>
    </div>
  );
};

export default CoursesPage;