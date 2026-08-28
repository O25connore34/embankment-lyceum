"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { RoleGate } from "@/components/app-shell";
import { Mark, Person } from "@/components/ui";
import { ln } from "@/lib/format";
import { useI18n } from "@/lib/locale";
import { useDemo, useSession } from "@/lib/store";

export default function TeachingTestPage() {
  const { id } = useParams<{ id: string }>();
  const { locale, dict, href } = useI18n();
  const { state, ready } = useDemo();
  const user = useSession();
  if (!ready || !state || !user) return null;
  const test = state.tests.find((t) => t.id === id);
  const course = test ? state.courses.find((c) => c.id === test.courseId) : undefined;
  if (!test || !course || course.teacherId !== user.id) {
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
  const attempts = state.attempts.filter((a) => a.testId === test.id);

  return (
    <RoleGate allow="teacher">
      <div className="page">
        <p className="kicker">
          <Link href={href(`/app/teaching/courses/${course.id}`)}>{ln(course.name, locale)}</Link>
        </p>
        <h1>{ln(test.title, locale)}</h1>
        {test.questions.map((q) => (
          <p key={q.id}>
            <strong>{ln(q.prompt, locale)}</strong>
          </p>
        ))}
        <h2>{dict.teacher.attempts}</h2>
        {attempts.length === 0 ? (
          <p className="sub">{dict.teacher.noAttempts}</p>
        ) : (
          attempts.map((a) => {
            const st = state.users.find((u) => u.id === a.studentId);
            return (
              <div className="row-link" key={a.id}>
                <span>{st ? <Person user={st} /> : a.studentId}</span>
                <span />
                <Mark value={a.score} />
              </div>
            );
          })
        )}
      </div>
    </RoleGate>
  );
}
