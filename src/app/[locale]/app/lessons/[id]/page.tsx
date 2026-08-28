"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { RoleGate } from "@/components/app-shell";
import { ln } from "@/lib/format";
import { useI18n } from "@/lib/locale";
import { useDemo, useSession } from "@/lib/store";

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const { locale, dict, href } = useI18n();
  const { state, ready } = useDemo();
  const user = useSession();
  if (!ready || !state || !user) return null;
  const lesson = state.lessons.find((l) => l.id === id);
  const mod = lesson ? state.modules.find((m) => m.id === lesson.moduleId) : undefined;
  const course = mod ? state.courses.find((c) => c.id === mod.courseId) : undefined;
  const allowed = Boolean(course && user.groupId && course.groupIds.includes(user.groupId));
  if (!lesson || !course || !allowed) {
    return (
      <RoleGate allow="student">
        <div className="page">
          <h1>{dict.common.forbiddenTitle}</h1>
          <Link className="btn" href={href("/app/courses")}>
            {dict.nav.subjects}
          </Link>
        </div>
      </RoleGate>
    );
  }

  return (
    <RoleGate allow="student">
      <div className="page">
        <p className="kicker">
          <Link href={href(`/app/courses/${course.id}`)}>{ln(course.name, locale)}</Link>
        </p>
        <h1>{ln(lesson.title, locale)}</h1>
        <div className="prose">{ln(lesson.body, locale)}</div>
        <p style={{ marginTop: 20, display: "flex", gap: 16, flexWrap: "wrap" }}>
          {lesson.file ? (
            <a className="btn ghost" href={lesson.file.href} download>
              {dict.student.download}: {ln(lesson.file.name, locale)}
            </a>
          ) : null}
          {lesson.video ? (
            <a className="btn" href={lesson.video.href} target="_blank" rel="noreferrer">
              {dict.student.watch}
            </a>
          ) : null}
        </p>
      </div>
    </RoleGate>
  );
}
