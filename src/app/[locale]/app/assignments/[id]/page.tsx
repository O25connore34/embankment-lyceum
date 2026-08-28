"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { RoleGate } from "@/components/app-shell";
import { Chip, Mark } from "@/components/ui";
import { formatDateTime, ln } from "@/lib/format";
import { useI18n } from "@/lib/locale";
import { useDemo, useSession } from "@/lib/store";

export default function AssignmentPage() {
  const { id } = useParams<{ id: string }>();
  const { locale, dict, href } = useI18n();
  const { state, ready, dispatch } = useDemo();
  const user = useSession();
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string>();
  const [flash, setFlash] = useState("");
  if (!ready || !state || !user) return null;
  const assignment = state.assignments.find((a) => a.id === id);
  const course = assignment ? state.courses.find((c) => c.id === assignment.courseId) : undefined;
  const allowed = Boolean(course && user.groupId && course.groupIds.includes(user.groupId));
  if (!assignment || !course || !allowed) {
    return (
      <RoleGate allow="student">
        <div className="page">
          <h1>{dict.common.forbiddenTitle}</h1>
          <Link className="btn" href={href("/app/assignments")}>
            {dict.nav.assignments}
          </Link>
        </div>
      </RoleGate>
    );
  }
  const sub = state.submissions.find((s) => s.assignmentId === assignment.id && s.studentId === user.id);
  const overdue = !sub && Date.now() > new Date(assignment.deadline).getTime();

  return (
    <RoleGate allow="student">
      <div className="page">
        {flash ? <div className="ok">{flash}</div> : null}
        <p className="kicker">
          <Link href={href(`/app/courses/${course.id}`)}>{ln(course.name, locale)}</Link>
        </p>
        <h1>{ln(assignment.title, locale)}</h1>
        <p>
          {dict.student.due}: {formatDateTime(assignment.deadline, locale)}{" "}
          <Chip status={sub ? sub.status : overdue ? "overdue" : "open"} late={sub?.late} />
        </p>
        <div className="prose">{ln(assignment.brief, locale)}</div>
        {sub ? (
          <section className="panel" style={{ marginTop: 20 }}>
            <h2>{dict.student.yourWork}</h2>
            <p className="prose">{sub.text}</p>
            {sub.fileName ? <p className="sub">{sub.fileName}</p> : null}
            {sub.comment ? (
              <p>
                <strong>{dict.student.teacherComment}:</strong> {ln(sub.comment, locale)}
              </p>
            ) : null}
            {sub.grade ? (
              <p>
                {dict.student.mark}: <Mark value={sub.grade} />
              </p>
            ) : null}
          </section>
        ) : null}
        {sub?.status === "accepted" ? null : (
          <form
            style={{ marginTop: 20 }}
            onSubmit={(e) => {
              e.preventDefault();
              dispatch({
                type: "submit",
                assignmentId: assignment.id,
                studentId: user.id,
                text: text || sub?.text || "",
                fileName,
              });
              setFlash(dict.student.saved);
            }}
          >
            <p className="sub">{dict.student.submitHint}</p>
            <label className="field">
              <span>{dict.student.submit}</span>
              <textarea value={text} onChange={(e) => setText(e.target.value)} required={!sub} />
            </label>
            <label className="field">
              <span>{dict.common.chooseFile}</span>
              <input
                type="file"
                onChange={(e) => setFileName(e.target.files?.[0]?.name)}
              />
            </label>
            <button className="btn" type="submit">
              {dict.student.submit}
            </button>
          </form>
        )}
      </div>
    </RoleGate>
  );
}
