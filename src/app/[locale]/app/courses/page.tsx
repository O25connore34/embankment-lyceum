"use client";

import Link from "next/link";
import { RoleGate } from "@/components/app-shell";
import { EmptyState } from "@/components/ui";
import { ln, personName } from "@/lib/format";
import { useI18n } from "@/lib/locale";
import { useDemo, useSession } from "@/lib/store";

export default function CoursesPage() {
  const { locale, dict, href } = useI18n();
  const { state, ready } = useDemo();
  const user = useSession();
  if (!ready || !state || !user) return null;
  const courses = state.courses.filter((c) => user.groupId && c.groupIds.includes(user.groupId));

  return (
    <RoleGate allow="student">
      <div className="page">
        <h1>{dict.nav.subjects}</h1>
        {courses.length === 0 ? (
          <EmptyState
            image="/images/empty/empty-notebook.png"
            title={dict.empty.coursesTitle}
            text={dict.empty.coursesText}
          />
        ) : (
          courses.map((course) => {
            const teacher = state.users.find((u) => u.id === course.teacherId);
            return (
              <Link className="row-link" key={course.id} href={href(`/app/courses/${course.id}`)}>
                <img src={course.image} alt="" width={90} height={68} style={{ objectFit: "cover" }} />
                <span>
                  <strong>{ln(course.name, locale)}</strong>
                  <div className="sub">
                    {teacher ? personName(teacher, locale) : ""} · {ln(course.room, locale)}
                  </div>
                </span>
                <span />
              </Link>
            );
          })
        )}
      </div>
    </RoleGate>
  );
}
