"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { RoleGate } from "@/components/app-shell";
import { Chip } from "@/components/ui";
import { ln, personName } from "@/lib/format";
import { useI18n } from "@/lib/locale";
import { useDemo, useSession } from "@/lib/store";

export default function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const { locale, dict, href } = useI18n();
  const { state, ready } = useDemo();
  const user = useSession();
  if (!ready || !state || !user) return null;
  const course = state.courses.find((c) => c.id === id);
  const allowed = Boolean(course && user.groupId && course.groupIds.includes(user.groupId));
  if (!course || !allowed) {
    return (
      <RoleGate allow="student">
        <div className="page">
          <h1>{dict.common.forbiddenTitle}</h1>
          <p className="sub">{dict.common.forbiddenText}</p>
          <Link className="btn" href={href("/app/courses")}>
            {dict.nav.subjects}
          </Link>
        </div>
      </RoleGate>
    );
  }
  const teacher = state.users.find((u) => u.id === course.teacherId);
  const modules = state.modules.filter((m) => m.courseId === course.id).sort((a, b) => a.order - b.order);
  const assignments = state.assignments.filter((a) => a.courseId === course.id);
  const tests = state.tests.filter((t) => t.courseId === course.id);

  return (
    <RoleGate allow="student">
      <div className="page">
        <div className="course-head">
          <img src={course.image} alt={ln(course.name, locale)} width={220} height={165} />
          <div>
            <p className="kicker">{dict.nav.subjects}</p>
            <h1>{ln(course.name, locale)}</h1>
            <p className="sub">
              {teacher ? personName(teacher, locale) : ""} · {ln(course.room, locale)}
            </p>
          </div>
        </div>
        <h2>{dict.student.programme}</h2>
        {modules.map((mod) => {
          const lessons = state.lessons.filter((l) => l.moduleId === mod.id);
          return (
            <section className="module" key={mod.id}>
              <h3>{ln(mod.title, locale)}</h3>
              {lessons.map((lesson) => (
                <Link className="row-link" key={lesson.id} href={href(`/app/lessons/${lesson.id}`)}>
                  <span className="time">{dict.student.materials}</span>
                  <span>{ln(lesson.title, locale)}</span>
                  <span />
                </Link>
              ))}
            </section>
          );
        })}
        <h2>{dict.nav.assignments}</h2>
        {assignments.map((a) => {
          const sub = state.submissions.find((s) => s.assignmentId === a.id && s.studentId === user.id);
          return (
            <Link className="row-link" key={a.id} href={href(`/app/assignments/${a.id}`)}>
              <span />
              <span>{ln(a.title, locale)}</span>
              <Chip status={sub ? sub.status : "open"} late={sub?.late} />
            </Link>
          );
        })}
        {tests.map((t) => {
          const attempt = state.attempts.find((a) => a.testId === t.id && a.studentId === user.id);
          return (
            <Link className="row-link" key={t.id} href={href(`/app/tests/${t.id}`)}>
              <span />
              <span>{ln(t.title, locale)}</span>
              <span>{attempt ? attempt.score : dict.student.startTest}</span>
            </Link>
          );
        })}
      </div>
    </RoleGate>
  );
}
