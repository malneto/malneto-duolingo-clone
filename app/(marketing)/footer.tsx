import Image from "next/image";
import db from "@/db/drizzle";
import { courses } from "@/db/schema";
import { eq } from "drizzle-orm";

export const Footer = async () => {
  const publicCourses = await db.query.courses.findMany({
    where: eq(courses.isPublic, true),
  });

  if (!publicCourses.length) return null;

  return (
    <div
      className="w-full px-4 py-6"
      style={{
        borderTop: "1px solid rgba(99,102,241,0.2)",
        background: "rgba(10,14,26,0.8)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="mx-auto flex max-w-screen-lg flex-wrap items-center justify-center gap-3">
        {publicCourses.map((course) => (
          <div
            key={course.id}
            className="flex items-center gap-2 rounded-2xl px-4 py-2 transition-all"
            style={{
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.2)",
            }}
          >
            <Image
              src={course.imageSrc}
              alt={course.title}
              height={24}
              width={30}
              className="rounded-sm"
            />
            <span className="text-sm font-semibold text-slate-300">
              {course.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};