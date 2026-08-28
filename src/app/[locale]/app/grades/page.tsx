"use client";

import Link from "next/link";
import { RoleGate } from "@/components/app-shell";
import { EmptyState, Mark } from "@/components/ui";
import { formatDate, ln } from "@/lib/format";
import { useI18n } from "@/lib/locale";
import { useDemo, useSession } from "@/lib/store";

export default function GradesPage() {
  const { locale, dict, href } = useI18n();
  const { state, ready } = useDemo();
  const user = useSession();
  if (!ready || !state || !user) return null;
  const myCourses = state.courses.filter((c) => user.groupId && c.groupIds.includes(user.groupId));
  const grades = state.grades.filter((g) => g.studentId === user.id);

  return (
    <RoleGate allow="student">
      <div className="page">
        <h1>{dict.nav.gradebook}</h1>
        {grades.length === 0 ? (
          <EmptyState
            image="/images/empty/empty-gradebook.png"
            title={dict.empty.gradesTitle}
            text={dict.empty.gradesText}
          />
        ) : (
          myCourses.map((course) => {
            const rows = grades.filter((g) => g.courseId === course.id);
            if (rows.length === 0) return null;
            return (
              <section className="panel" key={course.id} style={{ marginBottom: 16 }}>
                <h2>
                  <Link href={href(`/app/courses/${course.id}`)}>{ln(course.name, locale)}</Link>
                </h2>
                {rows.map((g) => (
                  <div className="row-link" key={g.id}>
                    <span className="time">{formatDate(g.date, locale)}</span>
                    <span>{ln(g.title, locale)}</span>
                    <Mark value={g.value} />
                  </div>
                ))}
              </section>
            );
          })
        )}
      </div>
    </RoleGate>
  );
}
