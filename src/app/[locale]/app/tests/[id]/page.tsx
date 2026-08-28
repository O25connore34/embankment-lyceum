"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { RoleGate } from "@/components/app-shell";
import { Mark } from "@/components/ui";
import { ln } from "@/lib/format";
import { useI18n } from "@/lib/locale";
import { useDemo, useSession } from "@/lib/store";

export default function TestPage() {
  const { id } = useParams<{ id: string }>();
  const { locale, dict, href } = useI18n();
  const { state, ready, dispatch } = useDemo();
  const user = useSession();
  const [answers, setAnswers] = useState<number[]>([]);
  if (!ready || !state || !user) return null;
  const test = state.tests.find((t) => t.id === id);
  const course = test ? state.courses.find((c) => c.id === test.courseId) : undefined;
  const allowed = Boolean(course && user.groupId && course.groupIds.includes(user.groupId));
  if (!test || !course || !allowed) {
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
  const attempt = state.attempts.find((a) => a.testId === test.id && a.studentId === user.id);

  return (
    <RoleGate allow="student">
      <div className="page">
        <p className="kicker">
          <Link href={href(`/app/courses/${course.id}`)}>{ln(course.name, locale)}</Link>
        </p>
        <h1>{ln(test.title, locale)}</h1>
        <p className="sub">{dict.student.testOnce}</p>
        {attempt ? (
          <section>
            <h2>
              {dict.student.testResult}: <Mark value={attempt.score} />
            </h2>
            {test.questions.map((q, i) => {
              const ok = attempt.answers[i] === q.correctIndex;
              return (
                <div className="panel" key={q.id} style={{ marginBottom: 12 }}>
                  <p>
                    <strong>{ln(q.prompt, locale)}</strong>
                  </p>
                  <p className={ok ? "ok" : "error"} style={{ margin: 0 }}>
                    {ok ? dict.student.correct : dict.student.wrong}
                    {": "}
                    {ln(q.options[attempt.answers[i]] ?? q.options[0], locale)}
                  </p>
                </div>
              );
            })}
          </section>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              dispatch({ type: "attempt", testId: test.id, studentId: user.id, answers });
            }}
          >
            {test.questions.map((q, qi) => (
              <fieldset key={q.id} className="panel" style={{ marginBottom: 12, border: 0 }}>
                <legend>
                  <strong>{ln(q.prompt, locale)}</strong>
                </legend>
                {q.options.map((opt, oi) => (
                  <label key={oi} style={{ display: "block", padding: "6px 0" }}>
                    <input
                      type="radio"
                      name={q.id}
                      required
                      onChange={() => {
                        const next = [...answers];
                        next[qi] = oi;
                        setAnswers(next);
                      }}
                    />{" "}
                    {ln(opt, locale)}
                  </label>
                ))}
              </fieldset>
            ))}
            <button className="btn" type="submit">
              {dict.student.submitTest}
            </button>
          </form>
        )}
      </div>
    </RoleGate>
  );
}
