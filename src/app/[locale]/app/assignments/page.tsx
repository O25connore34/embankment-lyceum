"use client";

import Link from "next/link";
import { RoleGate } from "@/components/app-shell";
import { Chip, EmptyState } from "@/components/ui";
import { formatDateTime, ln } from "@/lib/format";
import { useI18n } from "@/lib/locale";
import { useDemo, useSession } from "@/lib/store";

export default function AssignmentsPage() {
  const { locale, dict, href } = useI18n();
  const { state, ready } = useDemo();
  const user = useSession();
  if (!ready || !state || !user) return null;
  const myCourses = state.courses.filter((c) => user.groupId && c.groupIds.includes(user.groupId));
  const items = state.assignments.filter((a) => myCourses.some((c) => c.id === a.courseId));

  return (
    <RoleGate allow="student">
      <div className="page">
        <h1>{dict.nav.assignments}</h1>
        {items.length === 0 ? (
          <EmptyState
            image="/images/empty/empty-notebook.png"
            title={dict.empty.assignmentsTitle}
            text={dict.empty.assignmentsText}
          />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{dict.nav.subjects}</th>
                  <th>{dict.nav.assignments}</th>
                  <th>{dict.student.due}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((a) => {
                  const course = state.courses.find((c) => c.id === a.courseId);
                  const sub = state.submissions.find(
                    (s) => s.assignmentId === a.id && s.studentId === user.id
                  );
                  const overdue = !sub && Date.now() > new Date(a.deadline).getTime();
                  return (
                    <tr key={a.id}>
                      <td>{course ? ln(course.name, locale) : ""}</td>
                      <td>
                        <Link href={href(`/app/assignments/${a.id}`)}>{ln(a.title, locale)}</Link>
                      </td>
                      <td>{formatDateTime(a.deadline, locale)}</td>
                      <td>
                        <Chip status={sub ? sub.status : overdue ? "overdue" : "open"} late={sub?.late} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </RoleGate>
  );
}
