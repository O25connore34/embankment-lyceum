"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { RoleGate } from "@/components/app-shell";
import { ln } from "@/lib/format";
import { useI18n } from "@/lib/locale";
import { useDemo, useSession } from "@/lib/store";

export default function TeachingCoursePage() {
  const { id } = useParams<{ id: string }>();
  const { locale, dict, href } = useI18n();
  const { state, ready } = useDemo();
  const user = useSession();
  if (!ready || !state || !user) return null;
  const course = state.courses.find((c) => c.id === id && c.teacherId === user.id);
  if (!course) {
    return (
      <RoleGate allow="teacher">
        <div className="page">
          <h1>{dict.common.forbiddenTitle}</h1>
          <Link className="btn" href={href("/app/teaching")}>
            {dict.nav.teaching}
          </Link>
        </div>
      </RoleGate>
    );
  }
  const modules = state.modules.filter((m) => m.courseId === course.id).sort((a, b) => a.order - b.order);
  const assignments = state.assignments.filter((a) => a.courseId === course.id);
  const tests = state.tests.filter((t) => t.courseId === course.id);

  return (
    <RoleGate allow="teacher">
      <div className="page">
        <div className="course-head">
          <img src={course.image} alt={ln(course.name, locale)} width={220} height={165} />
          <div>
            <h1>{ln(course.name, locale)}</h1>
            <p className="sub">{ln(course.room, locale)}</p>
            <p style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link className="btn ghost small" href={href(`/app/teaching/courses/${course.id}/edit`)}>
                {dict.teacher.editProgramme}
              </Link>
              <Link className="btn ghost small" href={href(`/app/teaching/grades/${course.id}`)}>
                {dict.nav.gradebook}
              </Link>
            </p>
          </div>
        </div>
        {modules.map((mod) => (
          <section className="module" key={mod.id}>
            <h3>{ln(mod.title, locale)}</h3>
            {state.lessons
              .filter((l) => l.moduleId === mod.id)
              .map((lesson) => (
                <div className="row-link" key={lesson.id}>
                  <span />
                  <span>{ln(lesson.title, locale)}</span>
                  <span />
                </div>
              ))}
          </section>
        ))}
        <h2>{dict.nav.assignments}</h2>
        {assignments.map((a) => (
          <Link className="row-link" key={a.id} href={href(`/app/teaching/assignments/${a.id}`)}>
            <span />
            <span>{ln(a.title, locale)}</span>
            <span>{dict.teacher.submissions}</span>
          </Link>
        ))}
        {tests.map((t) => (
          <Link className="row-link" key={t.id} href={href(`/app/teaching/tests/${t.id}`)}>
            <span />
            <span>{ln(t.title, locale)}</span>
            <span>{dict.teacher.attempts}</span>
          </Link>
        ))}
      </div>
    </RoleGate>
  );
}
