"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { RoleGate } from "@/components/app-shell";
import { Mark, Person } from "@/components/ui";
import { ln } from "@/lib/format";
import { useI18n } from "@/lib/locale";
import { useDemo, useSession } from "@/lib/store";

export default function ClassGradebookPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { locale, dict, href } = useI18n();
  const { state, ready, dispatch } = useDemo();
  const user = useSession();
  const [studentId, setStudentId] = useState("");
  const [value, setValue] = useState(5);
  const [title, setTitle] = useState("");
  const [flash, setFlash] = useState("");
  if (!ready || !state || !user) return null;
  const course = state.courses.find((c) => c.id === courseId && c.teacherId === user.id);
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
  const studentIds = state.groups.filter((g) => course.groupIds.includes(g.id)).flatMap((g) => g.studentIds);
  const students = state.users.filter((u) => studentIds.includes(u.id));
  const columns = [
    ...state.assignments.filter((a) => a.courseId === course.id),
    ...state.tests.filter((t) => t.courseId === course.id),
  ];

  return (
    <RoleGate allow="teacher">
      <div className="page">
        {flash ? <div className="ok">{flash}</div> : null}
        <p className="kicker">
          <Link href={href(`/app/teaching/courses/${course.id}`)}>{ln(course.name, locale)}</Link>
        </p>
        <h1>{dict.nav.gradebook}</h1>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th />
                {columns.map((col) => (
                  <th key={col.id}>{ln(col.title, locale)}</th>
                ))}
                <th>{dict.teacher.classWork}</th>
              </tr>
            </thead>
            <tbody>
              {students.map((st) => (
                <tr key={st.id}>
                  <td>
                    <Person user={st} />
                  </td>
                  {columns.map((col) => {
                    const g = state.grades.find(
                      (x) => x.studentId === st.id && x.sourceId === col.id && x.courseId === course.id
                    );
                    return <td key={col.id}>{g ? <Mark value={g.value} /> : dict.common.none}</td>;
                  })}
                  <td>
                    {state.grades
                      .filter((g) => g.studentId === st.id && g.courseId === course.id && g.source === "lesson")
                      .map((g) => (
                        <Mark key={g.id} value={g.value} />
                      ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2 style={{ marginTop: 24 }}>{dict.teacher.classWork}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            dispatch({
              type: "classMark",
              studentId,
              courseId: course.id,
              title: { ru: title, en: title },
              value,
            });
            setFlash(dict.student.saved);
          }}
        >
          <label className="field">
            <span>{dict.roles.student}</span>
            <select value={studentId} onChange={(e) => setStudentId(e.target.value)} required>
              <option value="">{dict.common.none}</option>
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.lastName[locale]} {st.firstName[locale]}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>{dict.teacher.classWork}</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label className="field">
            <span>{dict.teacher.grade}</span>
            <select value={value} onChange={(e) => setValue(Number(e.target.value))}>
              {[5, 4, 3, 2].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <button className="btn" type="submit">
            {dict.teacher.putMark}
          </button>
        </form>
      </div>
    </RoleGate>
  );
}
