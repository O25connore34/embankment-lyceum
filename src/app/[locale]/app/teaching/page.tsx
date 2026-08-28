"use client";

import { useState } from "react";
import Link from "next/link";
import { RoleGate } from "@/components/app-shell";
import { Chip, EmptyState } from "@/components/ui";
import { ln, personName } from "@/lib/format";
import { useI18n } from "@/lib/locale";
import { useDemo, useSession } from "@/lib/store";

export default function TeachingPage() {
  const { locale, dict, href } = useI18n();
  const { state, ready, dispatch } = useDemo();
  const user = useSession();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [flash, setFlash] = useState("");
  if (!ready || !state || !user) return null;
  const courses = state.courses.filter((c) => c.teacherId === user.id);
  const pending = state.submissions.filter((s) => {
    const a = state.assignments.find((x) => x.id === s.assignmentId);
    const c = a ? state.courses.find((x) => x.id === a.courseId) : undefined;
    return c?.teacherId === user.id && (s.status === "in_review" || s.status === "submitted");
  });
  const groupId = courses[0]?.groupIds[0] ?? "all";

  return (
    <RoleGate allow="teacher">
      <div className="page">
        {flash ? <div className="ok">{flash}</div> : null}
        <h1>{dict.nav.teaching}</h1>
        {courses.map((course) => (
          <Link className="row-link" key={course.id} href={href(`/app/teaching/courses/${course.id}`)}>
            <img src={course.image} alt="" width={90} height={68} style={{ objectFit: "cover" }} />
            <span>
              <strong>{ln(course.name, locale)}</strong>
              <div className="sub">{ln(course.room, locale)}</div>
            </span>
            <span />
          </Link>
        ))}
        <h2 style={{ marginTop: 28 }}>{dict.nav.marking}</h2>
        {pending.length === 0 ? (
          <EmptyState
            image="/images/empty/empty-notebook.png"
            title={dict.empty.markingTitle}
            text={dict.empty.markingText}
          />
        ) : (
          pending.map((s) => {
            const a = state.assignments.find((x) => x.id === s.assignmentId);
            const st = state.users.find((u) => u.id === s.studentId);
            if (!a) return null;
            return (
              <Link className="row-link" key={s.id} href={href(`/app/teaching/assignments/${a.id}`)}>
                <span>{st ? personName(st, locale) : ""}</span>
                <span>{ln(a.title, locale)}</span>
                <Chip status={s.status} late={s.late} />
              </Link>
            );
          })
        )}
        <h2 style={{ marginTop: 28 }}>{dict.nav.announcements}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            dispatch({
              type: "announce",
              title: { ru: title, en: title },
              body: { ru: body, en: body },
              audience: groupId,
              authorId: user.id,
            });
            setTitle("");
            setBody("");
            setFlash(dict.student.saved);
          }}
        >
          <label className="field">
            <span>{dict.nav.announcements}</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label className="field">
            <span>{dict.teacher.comment}</span>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} required />
          </label>
          <button className="btn" type="submit">
            {dict.admin.publish}
          </button>
        </form>
      </div>
    </RoleGate>
  );
}
