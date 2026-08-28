"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { RoleGate } from "@/components/app-shell";
import { Chip, Person } from "@/components/ui";
import { formatDateTime, ln } from "@/lib/format";
import { useI18n } from "@/lib/locale";
import { useDemo, useSession } from "@/lib/store";
import type { Submission, User } from "@/lib/types";

function SubmissionMark({ submission, student }: { submission: Submission; student?: User }) {
  const { dict } = useI18n();
  const { dispatch } = useDemo();
  const [grade, setGrade] = useState(5);
  const [comment, setComment] = useState("");
  const [flash, setFlash] = useState("");
  return (
    <section className="panel" style={{ marginBottom: 16 }}>
      {flash ? <div className="ok">{flash}</div> : null}
      <h2>{student ? <Person user={student} /> : submission.studentId}</h2>
      <Chip status={submission.status} late={submission.late} />
      <p className="prose">{submission.text}</p>
      {submission.fileName ? <p className="sub">{submission.fileName}</p> : null}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          dispatch({
            type: "mark",
            submissionId: submission.id,
            status: "accepted",
            grade,
            comment: { ru: comment, en: comment },
          });
          setFlash(dict.student.saved);
        }}
      >
        <label className="field">
          <span>{dict.teacher.grade}</span>
          <select value={grade} onChange={(e) => setGrade(Number(e.target.value))}>
            {[5, 4, 3, 2].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>{dict.teacher.comment}</span>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
        </label>
        <button className="btn" type="submit">
          {dict.teacher.accept}
        </button>{" "}
        <button
          className="btn ghost"
          type="button"
          onClick={() => {
            dispatch({
              type: "mark",
              submissionId: submission.id,
              status: "returned",
              comment: { ru: comment, en: comment },
            });
            setFlash(dict.student.saved);
          }}
        >
          {dict.teacher.return}
        </button>
      </form>
    </section>
  );
}

export default function MarkingPage() {
  const { id } = useParams<{ id: string }>();
  const { locale, dict, href } = useI18n();
  const { state, ready } = useDemo();
  const user = useSession();
  if (!ready || !state || !user) return null;
  const assignment = state.assignments.find((a) => a.id === id);
  const course = assignment ? state.courses.find((c) => c.id === assignment.courseId) : undefined;
  if (!assignment || !course || course.teacherId !== user.id) {
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
  const subs = state.submissions.filter((s) => s.assignmentId === assignment.id);

  return (
    <RoleGate allow="teacher">
      <div className="page">
        <p className="kicker">
          <Link href={href(`/app/teaching/courses/${course.id}`)}>{ln(course.name, locale)}</Link>
        </p>
        <h1>{ln(assignment.title, locale)}</h1>
        <p className="sub">
          {dict.student.due}: {formatDateTime(assignment.deadline, locale)}
        </p>
        {subs.length === 0 ? (
          <p className="sub">{dict.empty.markingText}</p>
        ) : (
          subs.map((s) => (
            <SubmissionMark
              key={s.id}
              submission={s}
              student={state.users.find((u) => u.id === s.studentId)}
            />
          ))
        )}
      </div>
    </RoleGate>
  );
}
