"use client";

import Link from "next/link";
import { RoleGate } from "@/components/app-shell";
import { Chip, EmptyState, Mark } from "@/components/ui";
import { formatDateTime, jsWeekdayToSlot, ln } from "@/lib/format";
import { useI18n } from "@/lib/locale";
import { useDemo, useSession } from "@/lib/store";

export default function TodayPage() {
  const { locale, dict, href } = useI18n();
  const { state, ready } = useDemo();
  const user = useSession();
  if (!ready || !state || !user) return null;

  const day = jsWeekdayToSlot();
  const groupId = user.groupId;
  const slots = state.slots
    .filter((s) => s.groupId === groupId && s.weekday === day)
    .sort((a, b) => a.start.localeCompare(b.start));
  const myCourses = state.courses.filter((c) => groupId && c.groupIds.includes(groupId));
  const deadlines = state.assignments
    .filter((a) => myCourses.some((c) => c.id === a.courseId))
    .sort((a, b) => a.deadline.localeCompare(b.deadline));
  const recentGrades = state.grades
    .filter((g) => g.studentId === user.id)
    .slice(0, 5);
  const announcements = state.announcements.filter(
    (a) => a.audience === "all" || a.audience === groupId
  );

  return (
    <RoleGate allow="student">
      <div className="page">
        <p className="kicker">{dict.student.todayKicker}</p>
        <h1>{dict.nav.today}</h1>
        <p className="sub">{ln(state.institution.termLabel, locale)}</p>
        <div className="grid-day">
          <section className="panel">
            <h2>{dict.student.todayLessons}</h2>
            {slots.length === 0 ? (
              <EmptyState
                image="/images/empty/empty-schedule.png"
                title={dict.empty.todayTitle}
                text={dict.empty.todayText}
              />
            ) : (
              slots.map((slot) => {
                const course = state.courses.find((c) => c.id === slot.courseId);
                if (!course) return null;
                const lesson = state.lessons.find((l) =>
                  state.modules.some((m) => m.id === l.moduleId && m.courseId === course.id)
                );
                return (
                  <Link className="row-link" key={slot.id} href={href(`/app/courses/${course.id}`)}>
                    <span className="time">
                      {slot.start}–{slot.end}
                    </span>
                    <span>
                      <strong>{ln(course.name, locale)}</strong>
                      <div className="sub">
                        {ln(slot.room, locale)}
                        {slot.meetingUrl ? ` · ${dict.student.link}` : ""}
                      </div>
                    </span>
                    {lesson ? (
                      <span className="sub">{ln(lesson.title, locale)}</span>
                    ) : (
                      <span />
                    )}
                  </Link>
                );
              })
            )}
          </section>
          <section className="panel">
            <h2>{dict.student.todayDeadlines}</h2>
            {deadlines.length === 0 ? (
              <p className="sub">{dict.empty.assignmentsText}</p>
            ) : (
              deadlines.map((a) => {
                const sub = state.submissions.find(
                  (s) => s.assignmentId === a.id && s.studentId === user.id
                );
                const overdue = !sub && Date.now() > new Date(a.deadline).getTime();
                const course = state.courses.find((c) => c.id === a.courseId);
                return (
                  <Link className="row-link" key={a.id} href={href(`/app/assignments/${a.id}`)}>
                    <span className="time">{formatDateTime(a.deadline, locale)}</span>
                    <span>
                      <strong>{ln(a.title, locale)}</strong>
                      <div className="sub">{course ? ln(course.name, locale) : ""}</div>
                    </span>
                    <Chip
                      status={sub ? sub.status : overdue ? "overdue" : "open"}
                      late={sub?.late}
                    />
                  </Link>
                );
              })
            )}
          </section>
          <section className="panel">
            <h2>{dict.student.todayGrades}</h2>
            {recentGrades.length === 0 ? (
              <p className="sub">{dict.empty.gradesText}</p>
            ) : (
              recentGrades.map((g) => (
                <Link className="row-link" key={g.id} href={href("/app/grades")}>
                  <span className="time">{formatDateTime(g.date, locale)}</span>
                  <span>{ln(g.title, locale)}</span>
                  <Mark value={g.value} />
                </Link>
              ))
            )}
          </section>
          <section className="panel">
            <h2>{dict.student.todayAnnouncements}</h2>
            {announcements.map((a) => (
              <div className="row-link" key={a.id}>
                <span className="time">{formatDateTime(a.createdAt, locale)}</span>
                <span>
                  <strong>{ln(a.title, locale)}</strong>
                  <div className="sub">{ln(a.body, locale)}</div>
                </span>
                <span />
              </div>
            ))}
          </section>
        </div>
      </div>
    </RoleGate>
  );
}
